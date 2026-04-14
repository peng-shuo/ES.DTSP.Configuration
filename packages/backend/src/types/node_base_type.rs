use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// 图元 / 平台关联中的 `base_type` 字段，与数据库小写字符串一致
#[napi(string_enum)]
#[derive(Debug, Clone, PartialEq, Eq, Hash, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum NodeBaseType {
    #[sea_orm(string_value = "system")]
    System,
    #[sea_orm(string_value = "custom")]
    Custom,
}
