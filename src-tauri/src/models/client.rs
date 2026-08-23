use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Client {
    pub name: String,
    pub phone: String,
    pub email: String,
    pub address: String,
}