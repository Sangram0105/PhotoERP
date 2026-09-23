use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppLockStatus {
    pub enabled: bool,
    pub has_pin: bool,
}