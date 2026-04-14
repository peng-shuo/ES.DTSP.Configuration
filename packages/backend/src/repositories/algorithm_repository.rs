use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder,
    DatabaseConnection, DbErr, Condition
};
use crate::models::{algorithm, common::PageResult};

pub struct AlgorithmRepository;

impl AlgorithmRepository {
    pub async fn get_by_code(
        db: &DatabaseConnection,
        code: &str,
    ) -> Result<Option<algorithm::Model>, DbErr> {
        algorithm::Entity::find()
            .filter(algorithm::Column::Code.eq(code))
            .one(db)
            .await
    }

    pub async fn exists_by_code(db: &DatabaseConnection, code: &str) -> Result<bool, DbErr> {
        Ok(Self::get_by_code(db, code).await?.is_some())
    }

    pub async fn exists_by_code_excluding_id(
        db: &DatabaseConnection,
        code: &str,
        exclude_id: i32,
    ) -> Result<bool, DbErr> {
        Ok(
            algorithm::Entity::find()
                .filter(algorithm::Column::Code.eq(code))
                .filter(algorithm::Column::Id.ne(exclude_id))
                .one(db)
                .await?
                .is_some(),
        )
    }

    pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<algorithm::Model>, DbErr> {
        algorithm::Entity::find()
            .order_by_asc(algorithm::Column::Sort)
            .all(db)
            .await
    }

    pub async fn get_by_id(db: &DatabaseConnection, id: i32) -> Result<Option<algorithm::Model>, DbErr> {
        algorithm::Entity::find_by_id(id).one(db).await
    }

    pub async fn get_page(
        db: &DatabaseConnection,
        page: u32,
        page_size: u32,
        keyword: Option<String>,
    ) -> Result<PageResult<algorithm::Model>, DbErr> {
        let mut query = algorithm::Entity::find();

        if let Some(kw) = keyword {
            if !kw.is_empty() {
                query = query.filter(
                    Condition::any()
                        .add(algorithm::Column::Name.contains(&kw))
                        .add(algorithm::Column::Code.contains(&kw))
                );
            }
        }

        let paginator = query
            .order_by_asc(algorithm::Column::Sort)
            .paginate(db, page_size as u64);

        let total = paginator.num_items().await?;
        let list = paginator.fetch_page((page - 1) as u64).await?;

        Ok(PageResult {
            list,
            total: total as u32,
        })
    }

    pub async fn create(
        db: &DatabaseConnection,
        model: algorithm::ActiveModel,
    ) -> Result<algorithm::Model, DbErr> {
        model.insert(db).await
    }

    pub async fn update(
        db: &DatabaseConnection,
        model: algorithm::ActiveModel,
    ) -> Result<algorithm::Model, DbErr> {
        model.update(db).await
    }

    pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<u64, DbErr> {
        let res = algorithm::Entity::delete_by_id(id).exec(db).await?;
        Ok(res.rows_affected)
    }
}
