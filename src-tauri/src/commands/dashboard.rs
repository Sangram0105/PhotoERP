use tauri::AppHandle;

use crate::{
    models::dashboard::DashboardStats,
    services::dashboard_service,
};

#[tauri::command]
pub fn get_dashboard_stats(
    app: AppHandle,
) -> Result<DashboardStats, String> {

    dashboard_service::get_dashboard_stats(app)
}