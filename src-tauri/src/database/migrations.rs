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
}
