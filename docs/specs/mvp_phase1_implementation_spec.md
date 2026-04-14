# MVP 第一阶段实现规格（功能与数据结构导向）

## 1. 实现目标

将 `mvp_phase1_scope.md` 转为可执行的技术骨架，覆盖：

1. 项目管理、位号管理、控制方案组态与保存检查
2. Program 调度属性与控制方案对象结构落库
3. 单实例窗口复用
4. SQLite 显式保存与重开恢复

---

## 2. 进程与模块边界

### 2.1 Electron 主进程

职责：

1. 创建主窗口与子窗口。
2. 维护窗口注册表：`Map<string, BrowserWindow>`，key 固定 `"{scheme_id}:{editor_kind}"`。
3. IPC 路由：打开编辑器、请求保存、窗口生命周期通知。

### 2.2 Frontend（Vue）

职责：

1. 主窗口页面：项目、位号、程序与控制方案入口。
2. 图形程序编辑子窗口（不绑定具体图形引擎）。
3. 文本程序编辑子窗口（不绑定具体编辑器实现）。
4. 显式保存按钮与脏状态提示（基础版）。

### 2.3 Backend（Rust N-API）

职责：

1. SQLite 初始化与连接管理。
2. 项目/位号/Program/功能块实例/连接关系 的 CRUD。
3. 统一错误映射（前端不感知数据库细节）。

---

## 3. 窗口策略规格

## 3.1 打开子窗口

输入：`scheme_id`, `editor_kind`（`graph_program` / `text_program`）

规则：

1. 先查窗口注册表。
2. 已存在：`focus + restore`。
3. 不存在：创建新窗口并注册。

## 3.2 关闭子窗口

规则：

1. 若存在未保存变更，弹出确认（保存/放弃/取消）。
2. 关闭后移除注册表项。

---

## 4. 数据模型（MVP 最小集）

建议最小表（功能导向）：

1. `projects`
   - `id` (text uuid)
   - `name`
   - `created_at`
   - `updated_at`
2. `programs`
   - `id`
   - `project_id`
   - `name`
   - `cycle_mode`（fast/1x/2x/5x/10x）
   - `start_phase`（0~9）
   - `priority`（low/medium/high）
   - `updated_at`
3. `tags`
   - `id`
   - `project_id`
   - `tag_code`（如 FT1010）
   - `tag_name`
   - `tag_category`（ai/ao/di/do/ref）
   - `source_type`（manual/import/model_tool/flow_tool）
   - `valid_status`（valid/warning/error）
   - `updated_at`
4. `control_schemes`
   - `id`
   - `project_id`
   - `program_id`
   - `scheme_type`（single_loop/cascade/split_range/general）
   - `updated_at`
5. `block_instances`
   - `id`
   - `scheme_id`
   - `block_type`（pid/split/logic/custom）
   - `instance_code`（如 FIC1010）
   - `config_json`（参数配置，含分程上下限与作用方向）
   - `updated_at`
6. `scheme_links`
   - `id`
   - `scheme_id`
   - `from_object_id`
   - `from_port`
   - `to_object_id`
   - `to_port`
   - `link_kind`（signal/cascade/feedback）
   - `updated_at`
7. `editor_documents`
   - `id`
   - `program_id`
   - `scheme_id`
   - `editor_kind`（graph_program/text_program）
   - `doc_payload`（编辑器原始文档快照，JSON/Text）
   - `check_result_json`
   - `updated_at`

说明：

1. 本期优先满足用户故事中的位号、Program 调度与控制方案数据闭环；
2. 存储采用混合策略：`editor_documents` 保存原始文档快照，`block_instances/scheme_links` 保存结构化数据；
3. 与运行层对接字段（如运行时实例映射）二期再补。
4. `cycle_mode` 固定枚举：`fast/1x/2x/5x/10x`。

---

## 5. IPC 接口（建议草案）

1. `editor:open`
   - 入参：`{ schemeId, editorKind }`
   - 返回：`{ ok, reusedWindow }`
2. `editor:load_doc`
   - 入参：`{ schemeId, editorKind }`
   - 返回：`{ doc, updatedAt }`
3. `editor:save_doc`
   - 入参：`{ schemeId, editorKind, payload }`
   - 返回：`{ ok, updatedAt, checkResult }`
4. `project:list_programs`
   - 入参：`{ projectId }`
   - 返回：`{ items[] }`
5. `tag:create_or_import`
   - 入参：`{ projectId, tags[], sourceType, conflictPolicy }`
   - 返回：`{ ok, created, updated, invalidItems[] }`
6. `scheme:save_structure`
   - 入参：`{ programId, schemePayload }`
   - 返回：`{ ok, checkResult }`

---

## 6. 保存语义

1. 仅显式保存触发写库。
2. 保存成功后返回新的 `updatedAt` 与结构化检查结果。
3. 检查结果策略：`warning` 允许保存，`error` 阻断保存。
4. 子窗口关闭时若脏数据未保存，必须二次确认。

---

## 7. 图形程序编辑规格（框架无关）

1. 基础操作：新增节点、删除节点、连接关系维护、属性配置。
2. 文档结构：以业务可迁移结构保存，不直接依赖具体图形引擎私有状态。
3. 分程控制参数模型：MVP 固定 2 段（0~50，50~100）。
4. 暂不包含：自动布局、高级规则校验、复杂吸附网格。

---

## 8. 文本程序编辑规格（框架无关）

1. 文本编辑与基础语法高亮能力。
2. 保存与重开恢复。
3. 暂不包含：语义补全、静态分析、LSP 诊断。

---

## 9. 测试清单（MVP）

1. 打开项目 -> 创建/导入位号 -> 执行有效性检查。
2. 创建 Program 并设置周期/相位/优先级。
3. 保存控制方案结构并获取检查结果。
4. 重复打开同一 `scheme_id + editor_kind` -> 仅复用已有窗口。
5. 未保存关闭拦截生效。
6. SQLite 文件损坏/不存在时错误提示可读。

---

## 10. 与后续阶段衔接

1. 增加 MySQL 驱动时，对接 `dual_db_implementation_spec.md`。
2. 增加 SFC/LD/IL 时复用窗口与保存框架。
3. 引入运行层联调与编译导出时，扩展 `api/` 与 `architecture/cpp_runtime_desc.md` 对应契约。
