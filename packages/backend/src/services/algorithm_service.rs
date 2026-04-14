use crate::db::get_db;
use crate::models::{algorithm, common::PageResult};
use crate::repositories::algorithm_repository::AlgorithmRepository;
use sea_orm::{ActiveValue, DbErr};

pub struct AlgorithmService;

impl AlgorithmService {
    fn normalize_code(code: &str) -> String {
        code.trim().to_string()
    }

    pub async fn get_all() -> Result<Vec<algorithm::Model>, DbErr> {
        let db = get_db();
        AlgorithmRepository::get_all(db).await
    }

    pub async fn get_by_id(id: i32) -> Result<Option<algorithm::Model>, DbErr> {
        let db = get_db();
        AlgorithmRepository::get_by_id(db, id).await
    }

    pub async fn get_page(
        page: u32,
        page_size: u32,
        keyword: Option<String>,
    ) -> Result<PageResult<algorithm::Model>, DbErr> {
        let db = get_db();
        AlgorithmRepository::get_page(db, page, page_size, keyword).await
    }

    pub async fn create(model: algorithm::ActiveModel) -> Result<algorithm::Model, DbErr> {
        let db = get_db();
        if let ActiveValue::Set(code) = &model.code {
            let code = Self::normalize_code(code);
            if code.is_empty() {
                return Err(DbErr::Custom("算法标识 code 不能为空".to_string()));
            }
            if AlgorithmRepository::exists_by_code(db, &code).await? {
                return Err(DbErr::Custom(format!(
                    "算法标识 code \"{}\" 已存在，请使用其他标识",
                    code
                )));
            }
        }
        AlgorithmRepository::create(db, model).await
    }

    pub async fn update(model: algorithm::ActiveModel) -> Result<algorithm::Model, DbErr> {
        let db = get_db();
        let id = match &model.id {
            ActiveValue::Set(id) => Some(*id),
            _ => None,
        };
        if let ActiveValue::Set(code) = &model.code {
            let code = Self::normalize_code(code);
            if code.is_empty() {
                return Err(DbErr::Custom("算法标识 code 不能为空".to_string()));
            }
            let exists = if let Some(id) = id {
                AlgorithmRepository::exists_by_code_excluding_id(db, &code, id).await?
            } else {
                AlgorithmRepository::exists_by_code(db, &code).await?
            };
            if exists {
                return Err(DbErr::Custom(format!(
                    "算法标识 code \"{}\" 已存在，请使用其他标识",
                    code
                )));
            }
        }
        AlgorithmRepository::update(db, model).await
    }

    pub async fn delete(id: i32) -> Result<bool, DbErr> {
        let db = get_db();
        let affected = AlgorithmRepository::delete(db, id).await?;
        Ok(affected > 0)
    }
}
