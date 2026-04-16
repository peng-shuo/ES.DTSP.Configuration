# specs — 详细设计与规格

## 作用

在架构之下，描述 **模块/特性的具体设计**，按 **业务 / 技术** 分栏：

- [business](./business/README.md)：业务规则、验收口径、业务语义下的数据含义等。
- [technical](./technical/README.md)：模块职责、数据结构、关键算法、错误处理、测试要点、与 `api/` 的契约等。

## 约定

- 与 `requirements/` 中的需求条目可追溯（可引用需求 ID）。
- 接口对外契约可与 `api/` 联合维护，避免重复时以一处为准并交叉链接。

## 推荐阅读

- [dual_db_implementation_spec.md](./technical/dual_db_implementation_spec.md)：MySQL + SQLite 双库实现规格（仓储抽象、迁移、测试矩阵、切换策略）。
