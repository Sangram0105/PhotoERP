use rusqlite::params;
use tauri::AppHandle;

use crate::{
    database::connection,
    models::payment::{
        Payment,
        PaymentInput,
        PaymentSummary,
        PaymentUpdate,
        QuotationPayments,
    },
};

fn payment_status_calc(total: f64, paid: f64) -> String {
    let pending = total - paid;

    if pending <= 0.0 && paid > 0.0 {
        "Paid".to_string()
    } else if paid > 0.0 {
        "Partial".to_string()
    } else {
        "Pending".to_string()
    }
}

fn quotation_total(conn: &rusqlite::Connection, quotation_id: i64) -> f64 {
    conn.query_row(
        "SELECT IFNULL(total, 0) FROM quotations WHERE id = ?1",
        [quotation_id],
        |row| row.get(0),
    )
    .unwrap_or(0.0)
}

fn total_paid_for_quotation(conn: &rusqlite::Connection, quotation_id: i64) -> f64 {
    conn.query_row(
        "SELECT IFNULL(SUM(amount), 0) FROM payments WHERE quotation_id = ?1",
        [quotation_id],
        |row| row.get(0),
    )
    .unwrap_or(0.0)
}

#[tauri::command]
pub fn add_payment(
    app: AppHandle,
    payment: PaymentInput,
) -> Result<(), String> {
    let conn = connection::get_connection(&app);

    if payment.amount < 0.0 {
        return Err("Payment amount cannot be negative.".to_string());
    }

    let payment_date = if payment.payment_date.is_empty() {
        chrono_default_today()
    } else {
        payment.payment_date.clone()
    };

    conn.execute(
        "
        INSERT INTO payments
        (quotation_id, amount, payment_date, payment_method, notes)
        VALUES (?1, ?2, ?3, ?4, ?5)
        ",
        params![
            payment.quotation_id,
            payment.amount,
            payment_date,
            payment.payment_method,
            payment.notes,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

fn chrono_default_today() -> String {
    // SQLite stores dates as 'YYYY-MM-DD'; provide a simple local-date fallback
    // without pulling in an external chrono dependency.
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let days = (secs / 86_400) as i64;
    let (y, m, d) = civil_from_days(days);
    format!("{:04}-{:02}-{:02}", y, m, d)
}

fn civil_from_days(z: i64) -> (i64, u32, u32) {
    let z = z + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = (z - era * 146_097) as u64;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe as i64 + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = (doy - (153 * mp + 2) / 5 + 1) as u32;
    let m = if mp < 10 { mp + 3 } else { mp - 9 } as u32;
    (if m <= 2 { y + 1 } else { y }, m, d)
}

#[tauri::command]
pub fn get_payments_by_quotation(
    app: AppHandle,
    quotation_id: i64,
) -> Result<QuotationPayments, String> {
    let conn = connection::get_connection(&app);

    let mut stmt = conn
        .prepare(
            "
            SELECT
                id,
                quotation_id,
                amount,
                IFNULL(payment_date, ''),
                IFNULL(payment_method, ''),
                IFNULL(notes, ''),
                IFNULL(created_at, '')
            FROM payments
            WHERE quotation_id = ?1
            ORDER BY id ASC
            ",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([quotation_id], |row| {
            Ok(Payment {
                id: row.get(0)?,
                quotation_id: row.get(1)?,
                amount: row.get(2)?,
                payment_date: row.get(3)?,
                payment_method: row.get(4)?,
                notes: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut payments = Vec::new();

    for row in rows {
        payments.push(row.map_err(|e| e.to_string())?);
    }

    let total = quotation_total(&conn, quotation_id);
    let paid: f64 = payments.iter().map(|p| p.amount).sum();
    let pending = total - paid;

    Ok(QuotationPayments {
        quotation_id,
        payments,
        summary: PaymentSummary {
            total,
            paid,
            pending: if pending < 0.0 { 0.0 } else { pending },
            status: payment_status_calc(total, paid),
        },
    })
}

#[tauri::command]
pub fn get_payment_summary(
    app: AppHandle,
    quotation_id: i64,
) -> Result<PaymentSummary, String> {
    let conn = connection::get_connection(&app);

    let total = quotation_total(&conn, quotation_id);
    let paid = total_paid_for_quotation(&conn, quotation_id);
    let pending = total - paid;

    Ok(PaymentSummary {
        total,
        paid,
        pending: if pending < 0.0 { 0.0 } else { pending },
        status: payment_status_calc(total, paid),
    })
}

#[tauri::command]
pub fn update_payment(
    app: AppHandle,
    payment: PaymentUpdate,
) -> Result<(), String> {
    let conn = connection::get_connection(&app);

    if payment.amount < 0.0 {
        return Err("Payment amount cannot be negative.".to_string());
    }

    conn.execute(
        "
        UPDATE payments
        SET amount = ?1,
            payment_date = ?2,
            payment_method = ?3,
            notes = ?4
        WHERE id = ?5
        ",
        params![
            payment.amount,
            payment.payment_date,
            payment.payment_method,
            payment.notes,
            payment.id,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_payment(
    app: AppHandle,
    id: i64,
) -> Result<(), String> {
    let conn = connection::get_connection(&app);

    conn.execute(
        "DELETE FROM payments WHERE id = ?1",
        [id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}