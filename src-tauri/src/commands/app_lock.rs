use rusqlite::{params, Connection};
use sha2::{Digest, Sha256};
use tauri::AppHandle;

use crate::{
    database::connection,
    models::app_lock::AppLockStatus,
};

const KEY_ENABLED: &str = "app_lock_enabled";
const KEY_PIN_SALT: &str = "app_lock_pin_salt";
const KEY_PIN_HASH: &str = "app_lock_pin_hash";

fn read_setting(conn: &Connection, key: &str, fallback: &str) -> String {
    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        params![key],
        |row| row.get::<_, String>(0),
    )
    .unwrap_or_else(|_| fallback.to_string())
}

fn write_setting(conn: &Connection, key: &str, value: &str) -> Result<(), String> {
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        params![key, value],
    )
    .map(|_| ())
    .map_err(|e| format!("Failed to save setting '{key}': {e}"))
}

fn validate_pin(pin: &str) -> Result<(), String> {
    let len = pin.chars().count();

    if (4..=6).contains(&len) && pin.chars().all(|c| c.is_ascii_digit()) {
        Ok(())
    } else {
        Err("PIN must be 4 to 6 digits.".to_string())
    }
}

fn generate_salt(conn: &Connection) -> Result<String, String> {
    conn.query_row(
        "SELECT lower(hex(randomblob(16)))",
        [],
        |row| row.get(0),
    )
    .map_err(|e| format!("Failed to generate PIN salt: {e}"))
}

fn compute_hash(salt: &str, pin: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(salt.as_bytes());
    hasher.update(pin.as_bytes());
    let digest = hasher.finalize();
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

fn is_enabled_core(conn: &Connection) -> bool {
    read_setting(conn, KEY_ENABLED, "0") == "1"
}

fn has_pin_core(conn: &Connection) -> bool {
    let salt = read_setting(conn, KEY_PIN_SALT, "");
    let hash = read_setting(conn, KEY_PIN_HASH, "");
    !salt.is_empty() && !hash.is_empty()
}

fn verify_pin_core(conn: &Connection, pin: &str) -> bool {
    let salt = read_setting(conn, KEY_PIN_SALT, "");
    let stored_hash = read_setting(conn, KEY_PIN_HASH, "");

    if salt.is_empty() || stored_hash.is_empty() {
        return false;
    }

    let candidate = compute_hash(&salt, pin);

    // Compare in constant time to avoid leaking the hash through timing.
    let a = candidate.as_bytes();
    let b = stored_hash.as_bytes();

    if a.len() != b.len() {
        return false;
    }

    let mut diff = 0u8;
    for (x, y) in a.iter().zip(b.iter()) {
        diff |= x ^ y;
    }

    diff == 0
}

fn store_new_pin(conn: &Connection, pin: &str) -> Result<(), String> {
    let salt = generate_salt(conn)?;
    let hash = compute_hash(&salt, pin);

    write_setting(conn, KEY_PIN_SALT, &salt)?;
    write_setting(conn, KEY_PIN_HASH, &hash)?;

    Ok(())
}

fn set_enabled_core(conn: &Connection, enabled: bool) -> Result<(), String> {
    write_setting(conn, KEY_ENABLED, if enabled { "1" } else { "0" })
}

fn get_app_lock_status_core(conn: &Connection) -> AppLockStatus {
    AppLockStatus {
        enabled: is_enabled_core(conn),
        has_pin: has_pin_core(conn),
    }
}

#[tauri::command]
pub fn get_app_lock_status(app: AppHandle) -> Result<AppLockStatus, String> {
    let conn = connection::get_connection(&app)?;

    Ok(get_app_lock_status_core(&conn))
}

#[tauri::command]
pub fn verify_app_lock_pin(app: AppHandle, pin: String) -> Result<bool, String> {
    let conn = connection::get_connection(&app)?;

    Ok(verify_pin_core(&conn, &pin))
}

#[tauri::command]
pub fn enable_app_lock(app: AppHandle, pin: String) -> Result<(), String> {
    let conn = connection::get_connection(&app)?;

    enable_app_lock_core(&conn, &pin)
}

fn enable_app_lock_core(conn: &Connection, pin: &str) -> Result<(), String> {
    validate_pin(pin)?;

    if has_pin_core(conn) {
        if !verify_pin_core(conn, pin) {
            return Err("Incorrect PIN.".to_string());
        }
    } else {
        store_new_pin(conn, pin)?;
    }

    set_enabled_core(conn, true)
}

#[tauri::command]
pub fn disable_app_lock(app: AppHandle, pin: String) -> Result<(), String> {
    let conn = connection::get_connection(&app)?;

    disable_app_lock_core(&conn, &pin)
}

fn disable_app_lock_core(conn: &Connection, pin: &str) -> Result<(), String> {
    if !has_pin_core(conn) {
        return Err("App lock has no PIN configured.".to_string());
    }

    if !verify_pin_core(conn, pin) {
        return Err("Incorrect PIN.".to_string());
    }

    set_enabled_core(conn, false)
}

#[tauri::command]
pub fn change_app_lock_pin(
    app: AppHandle,
    current_pin: String,
    new_pin: String,
) -> Result<(), String> {
    let conn = connection::get_connection(&app)?;

    change_app_lock_pin_core(&conn, &current_pin, &new_pin)
}

fn change_app_lock_pin_core(
    conn: &Connection,
    current_pin: &str,
    new_pin: &str,
) -> Result<(), String> {
    validate_pin(new_pin)?;

    if !has_pin_core(conn) {
        return Err("No PIN is configured yet. Enable application lock to create one.".to_string());
    }

    if !verify_pin_core(conn, current_pin) {
        return Err("Incorrect current PIN.".to_string());
    }

    store_new_pin(conn, new_pin)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn enabled_value(conn: &Connection) -> String {
        read_setting(conn, KEY_ENABLED, "")
    }

    #[test]
    fn rejects_invalid_pin_formats() {
        let conn = crate::test_support::test_connection();

        for bad in ["123", "1234567", "12ab", "      ", ""] {
            assert!(
                validate_pin(bad).is_err(),
                "PIN '{bad}' should be rejected"
            );
        }

        for good in ["1234", "12345", "123456"] {
            assert!(validate_pin(good).is_ok(), "PIN '{good}' should be accepted");
        }
    }

    #[test]
    fn enable_creates_pin_and_enables_lock() {
        let conn = crate::test_support::test_connection();

        enable_app_lock_core(&conn, "4321").unwrap();

        let status = get_app_lock_status_core(&conn);
        assert!(status.enabled);
        assert!(status.has_pin);

        let stored_hash = read_setting(&conn, KEY_PIN_HASH, "");
        let stored_salt = read_setting(&conn, KEY_PIN_SALT, "");

        assert!(!stored_hash.is_empty());
        assert!(!stored_salt.is_empty());
        // Plaintext PIN must never be stored.
        assert_ne!(stored_hash, "4321");
        assert_ne!(stored_salt, "4321");
    }

    #[test]
    fn enable_rejects_bad_pin_and_does_not_touch_settings() {
        let conn = crate::test_support::test_connection();

        assert!(enable_app_lock_core(&conn, "12").is_err());

        let status = get_app_lock_status_core(&conn);
        assert!(!status.enabled);
        assert!(!status.has_pin);
    }

    #[test]
    fn re_enabling_requires_existing_pin() {
        let conn = crate::test_support::test_connection();

        enable_app_lock_core(&conn, "1111").unwrap();
        disable_app_lock_core(&conn, "1111").unwrap();

        // Correct PIN re-enables.
        enable_app_lock_core(&conn, "1111").unwrap();
        assert!(is_enabled_core(&conn));

        enable_app_lock_core(&conn, "2222").unwrap_err();
        assert!(is_enabled_core(&conn));
    }

    #[test]
    fn disable_requires_current_pin() {
        let conn = crate::test_support::test_connection();

        enable_app_lock_core(&conn, "5555").unwrap();

        assert!(disable_app_lock_core(&conn, "0000").is_err());
        assert!(is_enabled_core(&conn));

        disable_app_lock_core(&conn, "5555").unwrap();
        assert!(!is_enabled_core(&conn));

        // PIN is preserved so re-enabling uses the same PIN.
        assert!(has_pin_core(&conn));
    }

    #[test]
    fn change_pin_verifies_current_and_updates_credentials() {
        let conn = crate::test_support::test_connection();

        enable_app_lock_core(&conn, "1234").unwrap();

        assert!(change_app_lock_pin_core(&conn, "9999", "654321").is_err());

        change_app_lock_pin_core(&conn, "1234", "654321").unwrap();

        let old_hash = read_setting(&conn, KEY_PIN_HASH, "");

        assert!(verify_pin_core(&conn, "654321"));
        assert!(!verify_pin_core(&conn, "1234"));

        // Re-enable now requires the NEW pin.
        disable_app_lock_core(&conn, "654321").unwrap();
        enable_app_lock_core(&conn, "1234").unwrap_err();
    }

    #[test]
    fn change_pin_without_existing_pin_is_error() {
        let conn = crate::test_support::test_connection();

        assert!(change_app_lock_pin_core(&conn, "1234", "5678").is_err());
    }

    #[test]
    fn verify_reports_false_when_no_pin_configured() {
        let conn = crate::test_support::test_connection();

        assert!(!verify_pin_core(&conn, "1234"));
    }
}