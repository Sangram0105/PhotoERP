use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientInfo {
    pub id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientEventService {
    pub id: i64,
    pub service_name: String,
    pub quantity: i32,
    pub price: f64,
    pub total: f64,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientEvent {
    pub quotation_id: i64,
    pub quotation_number: String,
    pub event_type: String,
    pub event_date: String,
    pub event_time: String,
    pub venue: String,
    pub city: String,
    pub total: f64,
    pub paid: f64,
    pub pending: f64,
    pub payment_status: String,
    pub services: Vec<ClientEventService>,
    pub overall_status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientFinancialSummary {
    pub total_business: f64,
    pub amount_paid: f64,
    pub pending_amount: f64,
    pub payment_status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientDetails {
    pub client: ClientInfo,
    pub events: Vec<ClientEvent>,
    pub overall_status: String,
    pub financial: ClientFinancialSummary,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientListItem {
    pub id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub event_count: i64,
    pub overall_status: String,
}