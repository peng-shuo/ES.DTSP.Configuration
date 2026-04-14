---
name: add-module-sql
description: 在本项目约定的 MySQL 库（dtsp_graphic_manager）中新增业务表。当用户要求加表、改库表结构、与 docs SQL 对齐或初始化数据库时使用。
---

# 新增模块数据库表（SQL）

## 项目约定

- **数据库类型**：MySQL（与 `sea-orm` 的 `sqlx-mysql` 一致）。
- **逻辑库名**：`dtsp_graphic_manager`（见 `packages/desktop/src/main/main.ts` 中默认连接串；可通过环境变量 **`DTSP_DATABASE_URL`** 覆盖）。
- **结构脚本真源**：仓库内 **`docs/dtsp_graphic_manager.sql`**。新增/变更表结构应**先改此文件**，再在目标环境执行 SQL，避免文档与库不一致。
- **后端映射**：若存在对应 Rust 实体 `#[sea_orm(table_name = "...")]`，表名必须与实体一致（一般为 **snake_case** 英文表名）。

## 操作指令

### 1. 在 `docs/dtsp_graphic_manager.sql` 中追加表定义

1. 在合适位置增加分段注释（与现有 `algorithm`、`node_category`、`staff` 等风格一致）：

   ```text
   -- ----------------------------
   -- Table structure for <table_name>
   -- ----------------------------
   ```

2. 使用与现有表一致的写法：

   - 先 **`DROP TABLE IF EXISTS \`<table_name>\`;`**，再 **`CREATE TABLE`**，便于重复导入。
   - 主键：`id` **`int NOT NULL AUTO_INCREMENT`**，**`PRIMARY KEY`**。
   - 字符集：`utf8mb4`，排序规则与邻近表保持一致即可（如 `utf8mb4_unicode_ci` 或 `utf8mb4_0900_ai_ci`）。
   - 表：`ENGINE = InnoDB`，**`COMMENT = '...'`**（中文说明）。
   - 列：尽量带 **`COMMENT`**；业务唯一键用 **`UNIQUE INDEX`**（如 `code`）。
   - 若需备注长文本，避免使用保留字作列名；若用 `desc` 等需确认 MySQL 反引号与 ORM 列映射。

3. （可选）在同一文件内追加 **`INSERT`** 种子数据，并注明 `Records for <table_name>`。

4. 保持文件头部 **`SET NAMES utf8mb4`**、**`SET FOREIGN_KEY_CHECKS = 0`** 等现有约定；若新增外键，注意导入顺序与 **`FOREIGN_KEY_CHECKS`**。

### 2. 在目标 MySQL 中执行变更

任选其一：

- 用 Navicat / DBeaver 等对 **`dtsp_graphic_manager`** 执行**新增**的那段 `DROP` + `CREATE`（+ `INSERT`）。
- 或使用命令行（需本机已配置 `mysql` 客户端）：

  ```bash
  mysql -h localhost -u root -p dtsp_graphic_manager < docs/dtsp_graphic_manager.sql
  ```

  **注意**：整文件导入会 `DROP` 已有表，**仅适用于空库或明确可重建的环境**。生产环境应只执行**增量**语句，并做好备份。

### 3. 与后端代码对齐（若已有或即将新增 CRUD）

- 若已写 SeaORM `Model`，表名、列名、可空/唯一约束须与 SQL 一致。
- 若尚未接后端，完成表结构后，再按 **`add-ipc-route`** 技能打通 N-API 与前端。

## 检查清单

| 步骤 | 内容 |
|------|------|
| 1 | `docs/dtsp_graphic_manager.sql` 已更新，风格与现有表一致 |
| 2 | 表名与 Rust `table_name`（如有）一致 |
| 3 | 已在目标库执行并成功（无语法/权限错误） |
| 4 | Electron 使用 `DTSP_DATABASE_URL` 时能连上该库（连接失败时主进程会打 `initDb` 错误日志） |

## 示例

**用户**：「给人员模块加一张扩展表 `staff_profile`。」

**Agent 行为**：

1. 在 `docs/dtsp_graphic_manager.sql` 中追加 `staff_profile` 的 `DROP` + `CREATE`（+ 可选 `INSERT`）。
2. 说明在开发库执行增量 SQL；若需外键关联 `staff.id`，在注释中写清依赖与执行顺序。
3. 若用户还要接口：提示在 `packages/backend` 增加实体与仓储，并走 **`add-ipc-route`**。
