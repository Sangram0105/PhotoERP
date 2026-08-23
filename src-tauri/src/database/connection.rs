use rusqlite::Connection;
use std::fs;
use tauri::{AppHandle, Manager};

pub fn get_connection(app: &AppHandle) -> Connection {
    let app_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");

    fs::create_dir_all(&app_dir)
        .expect("Failed to create app data directory");

    let db_path = app_dir.join("photoerp.db");

    Connection::open(db_path)
        .expect("Failed to open SQLite database")
}