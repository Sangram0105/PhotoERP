use serde::Serialize;

use crate::models::quotation_list::QuotationListItem;

#[derive(Serialize)]
pub struct DashboardStats {
    pub total_quotations: i64,
    pub total_revenue: f64,
    pub pending_balance: f64,
    pub upcoming_events: i64,
    pub recent_quotations: Vec<QuotationListItem>,
     pub upcoming_event_list: Vec<QuotationListItem>,
}