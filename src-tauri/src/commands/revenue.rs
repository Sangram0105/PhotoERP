use tauri::AppHandle;

use crate::{
    models::revenue::RevenueSummary,
    services::revenue_service,
};

#[tauri::command]
pub fn get_monthly_revenue(
    app: AppHandle,
) -> Result<Vec<RevenueSummary>, String> {

    revenue_service::get_monthly_revenue(app)
}