# specs — 详细设计与规格

## 作用

在架构之下，描述 **模块/特性的具体设计**：职责、数据结构、关键算法、错误处理与测试要点等。

## 约定

- 与 `requirements/` 中的需求条目可追溯（可引用需求 ID）。
- 接口对外契约可与 `api/` 联合维护，避免重复时以一处为准并交叉链接。

## 推荐阅读

- `dual_db_implementation_spec.md`：MySQL + SQLite 双库实现规格（仓储抽象、迁移、测试矩阵、切换策略）。
- `mvp_phase1_implementation_spec.md`：第一阶段 MVP 实现规格（主窗/子窗、SQLite、保存语义、测试清单）。
