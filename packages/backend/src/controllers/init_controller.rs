use napi::Result;
use napi_derive::napi;
use crate::db::establish_connection;

#[napi]
pub async fn init_db(database_url: String) -> Result<()> {
    establish_connection(&database_url).await.map_err(|e| napi::Error::from_reason(e.to_string()))
}
