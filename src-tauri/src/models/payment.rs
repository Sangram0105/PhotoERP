use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Payment {
    pub id: i64,
    pub quotation_id: i64,
    pub amount: f64,
    pub payment_date: String,
    pub payment_method: String,
    pub notes: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentInput {
    pub quotation_id: i64,
    pub amount: f64,
    pub payment_date: String,
    pub payment_method: String,
    pub notes: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentUpdate {
    pub id: i64,
    pub amount: f64,
    pub payment_date: String,
    pub payment_method: String,
    pub notes: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentSummary {
    pub total: f64,
    pub paid: f64,
    pub pending: f64,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QuotationPayments {
    pub quotation_id: i64,
    pub payments: Vec<Payment>,
    pub summary: PaymentSummary,
}