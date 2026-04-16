# 双库（MySQL + SQLite）技术规格草案

## 1. 文档目标

本规格定义在当前项目中同时支持 `MySQL` 与 `SQLite` 的实现方式，满足以下目标：

1. **同一套业务模型** 同时适配两类数据库。
2. 组态工具默认可离线运行（SQLite），也可切换团队/服务化部署（MySQL）。
3. `Rust N-API` 作为统一数据访问入口，`Vue` 与 `Electron` 无需感知方言差异。

关联背景：

- 当前桌面进程已通过 `DTSP_DATABASE_URL` 注入数据库连接串并调用 `backend.initDb`。
- `backend` 使用 `SeaORM`，天然可支持多方言连接。

```8:10:packages/desktop/src/main/main.ts
/** 数据库连接串：优先环境变量 DTSP_DATABASE_URL，与原先渲染进程默认值一致 */
const defaultDatabaseUrl = 'mysql://root:root@localhost/dtsp_graphic_manager'
```

```1:3:packages/backend/src/db/mod.rs
use once_cell::sync::OnceCell;
use sea_orm::{Database, DatabaseConnection, DbErr};
```

---

## 2. 范围与非范围

**范围（本期）**

- 工程管理域（工程、POU、位号、数据类型、全局变量、编辑内容）双库落地。
- 统一仓储接口 + 双驱动实现。
- 双库迁移脚本与最小一致性测试矩阵。

**非范围（后续）**

- 多主同步、跨地域容灾。
- 数据库级实时复制。
- 运行层历史趋势海量归档方案（可后续独立存储）。

---

## 3. 架构方案（One Domain, Two Drivers）

### 3.1 分层

1. **Domain 层**：实体与业务规则（不出现 SQL 方言分支）。
2. **Repository Trait 层**：统一接口（如 `ProjectRepo`、`PouRepo`、`TagRepo`）。
3. **Driver 层**：`MysqlStorage` 与 `SqliteStorage` 两个实现。
4. **Bootstrap 层**：按连接串解析方言，装配对应驱动与迁移。

### 3.2 连接串策略

- `mysql://...` => MySQL 驱动
- `sqlite://...` 或 `sqlite:...` => SQLite 驱动

默认建议：

- 开发单机：`sqlite://./data/dtsp.db`
- 团队环境：`mysql://user:pwd@host:3306/dtsp_graphic_manager`

---

## 4. 数据模型与兼容约束

### 4.1 主键策略

- 统一使用 `TEXT/CHAR(36)` UUID 作为业务主键（避免自增策略差异）。
- 所有外键以 UUID 建模，降低迁移复杂度。

### 4.2 时间字段策略

- 统一存 UTC（ISO8601 字符串或整数时间戳，二选一并全局统一）。
- 禁止依赖数据库本地时区函数计算业务语义。

### 4.3 JSON 字段策略

- 业务层定义 JSON Schema；
- MySQL 使用 `JSON` 类型；
- SQLite 使用 `TEXT`（存 JSON 字符串）+ 应用层校验。

### 4.4 软删除与审计

- `deleted_at`、`created_at`、`updated_at` 字段统一存在。
- SQLite 与 MySQL 均由应用层维护更新时间，避免方言触发器差异。

---

## 5. 迁移方案

迁移目录建议：

```text
packages/backend/migrations/
  common/
    0001_init_core.sql
    0002_add_pou_tables.sql
  mysql/
    1001_mysql_indexes.sql
  sqlite/
    2001_sqlite_indexes.sql
```

执行顺序：

1. 先跑 `common/*`
2. 再跑方言目录（`mysql/*` 或 `sqlite/*`）

版本记录：

- 使用统一迁移版本表（如 `schema_migrations`）；
- 每次启动 `initDb` 时仅执行未应用版本。

---

## 6. Rust 后端实现约束

### 6.1 接口形态

- 对前端暴露稳定 API（如 `initDb`, `createProject`, `savePou`）。
- API 不暴露数据库方言细节，错误映射到统一错误码。

### 6.2 仓储抽象

- 定义 trait：
  - `ProjectRepo`
  - `PouRepo`
  - `TagRepo`
  - `DatatypeRepo`
- 每个 trait 提供 MySQL/SQLite 两个实现。

### 6.3 事务一致性

- 关键写操作（工程保存、POU 批量保存）必须事务化。
- SQLite 使用 `BEGIN IMMEDIATE`（由 ORM 事务封装实现）防止写冲突扩散。

---

## 7. Electron / 前端侧约束

1. `desktop` 仅维护连接串来源（环境变量、配置文件、启动参数）。
2. `frontend` 不直接拼接 SQL，不判断数据库类型。
3. UI 可展示“当前工程数据库类型”（只读标签），用于运维可见性。

---

## 8. 双库测试矩阵

最低测试矩阵（每次 CI 均执行）：

1. 工程创建/重命名/删除
2. POU 保存/读取/复制
3. 位号、数据类型、全局变量增删改查
4. 事务回滚（故障注入）
5. 迁移升级（从旧版本到新版本）

执行策略：

- `TEST_DB=mysql` 跑一轮
- `TEST_DB=sqlite` 再跑一轮

---

## 9. 发布与切换策略

### 9.1 模式定义

- `local`：默认 SQLite（单机离线）
- `team`：MySQL（集中部署）

### 9.2 数据迁移工具（建议二期）

- 提供 `sqlite -> mysql` 导入工具：
  - 导出工程包（JSON + 资源）
  - 导入到目标库并做完整性校验

---

## 10. 风险与缓解

1. **方言差异导致线上 bug**  
   缓解：严格限制方言 SQL，仅在 dialect 目录维护差异。

2. **双库测试成本上升**  
   缓解：核心用例自动化，非核心回归按冒烟策略执行。

3. **团队误用本地库当中心库**  
   缓解：UI 显示当前模式，并在团队部署时禁用 SQLite 写入。

---

## 11. 里程碑建议

1. M1：完成仓储抽象与 SQLite 驱动（本地跑通）。
2. M2：补齐 MySQL 驱动与迁移体系。
3. M3：完成双库 CI 与性能基准。
4. M4：上线切换与导入导出工具。

---

## 12. 待确认

1. UUID 方案（v4 / v7）是否统一为 v7？
2. 时间字段采用毫秒时间戳还是 ISO8601 字符串？
3. MySQL 版本基线（5.7/8.0）与字符集规范是否固定为 `utf8mb4`？
