use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct RevenueSummary {
    pub month: String,
    pub amount: f64,
}