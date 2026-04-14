use serde::{Deserialize, Serialize};

/// 算法列表 / 详情返回
#[napi(object)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AlgorithmDto {
    pub id: Option<i32>,
    pub name: String,
    pub code: String,
    pub desc: Option<String>,
    pub sort: i32,
}

/// 新增算法（不含 id）
#[napi(object)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AlgorithmCreateDto {
    pub name: String,
    pub code: String,
    pub desc: Option<String>,
    pub sort: i32,
}

/// 更新算法（必须带 id）
#[napi(object)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AlgorithmUpdateDto {
    pub id: i32,
    pub name: String,
    pub code: String,
    pub desc: Option<String>,
    pub sort: i32,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PageResultAlgorithmDto {
    pub list: Vec<AlgorithmDto>,
    pub total: u32,
}
