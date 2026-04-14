use once_cell::sync::OnceCell;
use sea_orm::{Database, DatabaseConnection, DbErr};

pub static DB: OnceCell<DatabaseConnection> = OnceCell::new();

pub async fn establish_connection(database_url: &str) -> Result<(), DbErr> {
    if DB.get().is_some() {
        return Ok(());
    }
    let db = Database::connect(database_url).await?;
    let _ = DB.set(db);
    Ok(())
}

pub fn get_db() -> &'static DatabaseConnection {
    DB.get().expect("DB connection not initialized")
}
