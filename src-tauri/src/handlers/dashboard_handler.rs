use crate::{
    services::dashboard_service,
    AppState,
};

#[tauri::command]
pub fn get_dashboard_stats(
    state: tauri::State<AppState>,
) -> Result<
    crate::models::dashboard::DashboardStats,
    String,
> {
    dashboard_service::get_dashboard_stats(
        state.inner(),
    )
}