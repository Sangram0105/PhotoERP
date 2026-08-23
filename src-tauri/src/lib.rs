mod database;
mod commands;
mod models;
mod services;

use commands::{
    quotation::{
        save_quotation,
        get_quotations,
        delete_quotation,
        get_quotation_by_id,
        update_quotation,
        
    },
    dashboard::get_dashboard_stats,
    revenue::get_monthly_revenue,
};
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            println!("Initializing PhotoERP Database...");

            let conn = database::connection::get_connection(app.handle());

            database::migrations::run(&conn);

            println!("Database Ready!");

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
    greet,
    save_quotation,
    get_quotations,
    delete_quotation,
    get_quotation_by_id,
    update_quotation,
    get_dashboard_stats,
    get_monthly_revenue,
    
     ]) 
     .run(tauri::generate_context!())
        .expect("error while running tauri application");
}