use rusqlite::Connection;

fn column_exists(conn: &Connection, table: &str, column: &str) -> bool {
    conn.prepare(&format!(
        "SELECT COUNT(*) FROM pragma_table_info('{}') WHERE name = ?1",
        table
    ))
    .and_then(|mut stmt| {
        stmt.query_row([column], |row| row.get::<_, i64>(0))
    })
    .map(|count| count > 0)
    .unwrap_or(false)
}

fn table_exists(conn: &Connection, table: &str) -> bool {
    conn.query_row(
        "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?1",
        [table],
        |row| row.get::<_, i64>(0),
    )
    .map(|count| count > 0)
    .unwrap_or(false)
}

pub fn run(conn: &Connection) {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS quotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quotation_number TEXT NOT NULL UNIQUE,

            client_id INTEGER NOT NULL,

            event_type TEXT,
            event_date TEXT,
            event_time TEXT,

            venue TEXT,
            city TEXT,

            subtotal REAL NOT NULL,
            discount REAL NOT NULL,
            advance_amount REAL NOT NULL,
            total REAL NOT NULL,
            balance REAL NOT NULL,

            notes TEXT,
            status TEXT DEFAULT 'Draft',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(client_id)
            REFERENCES clients(id)
        );

        CREATE TABLE IF NOT EXISTS quotation_services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            quotation_id INTEGER NOT NULL,

            service_name TEXT NOT NULL,

            quantity INTEGER NOT NULL,

            price REAL NOT NULL,

            total REAL NOT NULL,

            FOREIGN KEY(quotation_id)
            REFERENCES quotations(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            quotation_id INTEGER NOT NULL,

            amount REAL NOT NULL,

            payment_date TEXT NOT NULL,

            payment_method TEXT,

            notes TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(quotation_id)
            REFERENCES quotations(id)
            ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS migration_meta (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        ",
    )
    .expect("Failed to run migrations");

    // ---------------------------
    // Safe additive migration:
    // Add service delivery status to quotation_services if missing.
    // Does NOT destroy existing data.
    // ---------------------------

    if !column_exists(conn, "quotation_services", "status") {
        conn.execute_batch(
            "
            ALTER TABLE quotation_services
            ADD COLUMN status TEXT NOT NULL DEFAULT 'Pending';
            ",
        )
        .expect("Failed to add status column to quotation_services");
    }

    // ---------------------------
    // Seed existing advance amounts into the payments table once.
    // Markers prevent duplication across application restarts.
    // ---------------------------

    if table_exists(conn, "payments") && !table_exists(conn, "migration_meta") {
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS migration_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );",
        )
        .expect("Failed to create migration_meta table");
    }

    let seeded_advance: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM migration_meta WHERE key = 'advance_payments_seeded'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .map(|count| count > 0)
        .unwrap_or(false);

    if !seeded_advance {
        conn.execute_batch(
            "
            INSERT INTO payments (quotation_id, amount, payment_date, payment_method, notes)
            SELECT
                id,
                advance_amount,
                COALESCE(NULLIF(event_date, ''), date('now')),
                'Advance',
                'Initial advance payment'
            FROM quotations
            WHERE advance_amount > 0;
            ",
        )
        .expect("Failed to seed advance payments");

        conn.execute_batch(
            "
            INSERT INTO migration_meta (key, value)
            VALUES ('advance_payments_seeded', '1');
            ",
        )
        .expect("Failed to mark advance payments as seeded");
    }
}
