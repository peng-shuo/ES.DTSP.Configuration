use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PageResult<T> {
    pub list: Vec<T>,
    pub total: u32,
}
