use crate::handlers::dto::{
    AlgorithmCreateDto, AlgorithmDto, AlgorithmUpdateDto, PageResultAlgorithmDto,
};
use crate::services::algorithm_service::AlgorithmService;
use napi::Result;
use napi_derive::napi;
use sea_orm::ActiveValue::{NotSet, Set};

fn model_to_dto(model: crate::models::algorithm::Model) -> AlgorithmDto {
    AlgorithmDto {
        id: Some(model.id),
        name: model.name,
        code: model.code,
        desc: model.desc,
        sort: model.sort,
    }
}

#[napi]
pub async fn algorithm_get_by_id(id: i32) -> Result<Option<AlgorithmDto>> {
    let result: Option<crate::models::algorithm::Model> = AlgorithmService::get_by_id(id)
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(result.map(model_to_dto))
}

#[napi]
pub async fn algorithm_get_all() -> Result<Vec<AlgorithmDto>> {
    let result = AlgorithmService::get_all()
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(result.into_iter().map(model_to_dto).collect())
}

#[napi]
pub async fn algorithm_get_page(
    page: u32,
    page_size: u32,
    keyword: Option<String>,
) -> Result<PageResultAlgorithmDto> {
    let result = AlgorithmService::get_page(page, page_size, keyword)
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    Ok(PageResultAlgorithmDto {
        list: result.list.into_iter().map(model_to_dto).collect(),
        total: result.total,
    })
}

#[napi]
pub async fn algorithm_create(dto: AlgorithmCreateDto) -> Result<AlgorithmDto> {
    let model = crate::models::algorithm::ActiveModel {
        id: NotSet,
        name: Set(dto.name),
        code: Set(dto.code),
        desc: Set(dto.desc),
        sort: Set(dto.sort),
    };

    let result = AlgorithmService::create(model)
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(model_to_dto(result))
}

#[napi]
pub async fn algorithm_update(dto: AlgorithmUpdateDto) -> Result<AlgorithmDto> {
    let model = crate::models::algorithm::ActiveModel {
        id: Set(dto.id),
        name: Set(dto.name),
        code: Set(dto.code),
        desc: Set(dto.desc),
        sort: Set(dto.sort),
    };

    let result = AlgorithmService::update(model)
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(model_to_dto(result))
}

#[napi]
pub async fn algorithm_delete(id: i32) -> Result<bool> {
    AlgorithmService::delete(id)
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(true)
}
