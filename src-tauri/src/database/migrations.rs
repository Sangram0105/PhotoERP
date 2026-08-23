use rusqlite::Connection;

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
}