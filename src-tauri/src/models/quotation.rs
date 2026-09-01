use serde::{Deserialize, Serialize};

use super::client::Client;

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceItem {
    pub service_name: String,
    pub quantity: i32,
    pub price: f64,
    pub total: f64,
    #[serde(default = "default_status")]
    pub status: String,
}

fn default_status() -> String {
    "Pending".to_string()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Quotation {

     pub id: Option<i64>,  
    pub quotation_number: String,

    pub client: Client,

    pub event_type: String,
    pub event_date: String,
    pub event_time: String,

    pub venue: String,
    pub city: String,

    pub subtotal: f64,
    pub discount: f64,
    pub advance_amount: f64,
    pub total: f64,
    pub balance: f64,

    pub notes: String,

    pub services: Vec<ServiceItem>,
}