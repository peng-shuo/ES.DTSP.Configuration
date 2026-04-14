# MVP 第一阶段可执行任务清单（文件级）

本文将 `mvp_phase1_implementation_spec.md` 拆成文件级任务，按“功能能力 + 数据结构”推进，不绑定具体图形/文本编辑器实现。

关联文档：

- 需求基线：`docs/requirements/mvp_phase1_scope.md`
- 路线图：`docs/roadmap/mvp_phase1_roadmap.md`
- 实现规格：`docs/specs/mvp_phase1_implementation_spec.md`
- 决策与待定项：`docs/adr/0002_mvp_scope_from_user_story.md`

---

## 1. 交付定义（DoD）

完成标准：

1. 主窗口可打开项目并进入控制组态流程。
2. 可完成位号创建/导入与有效性检查。
3. 可配置 Program 周期/相位/优先级并保存。
4. 可保存控制方案结构并返回检查结果。
5. 同一 `scheme_id + editor_kind` 重复打开仅复用一个窗口。
6. 默认 SQLite 可独立运行（不依赖 MySQL）。

---

## 2. 包级任务清单

## A. `packages/desktop`（主进程 + preload）

### A1. 多窗口注册与复用（M2）

- [ ] 修改 `src/main/main.ts`：引入窗口注册表 `Map<string, BrowserWindow>`。
- [ ] 在 `main.ts` 增加子窗口创建函数（按 `scheme_id + editor_kind` 生成 key）。
- [ ] 在 `main.ts` 实现窗口复用：命中 key 时 `focus/restore`，不新建窗口。
- [ ] 在 `main.ts` 绑定 `closed` 事件并移除注册表项。

### A2. IPC 路由扩展（M2）

- [ ] 修改 `src/main/api.ts`：新增 `editor:open`、`editor:load_doc`、`editor:save_doc`、`project:list_programs`、`tag:create_or_import`、`scheme:save_structure`。
- [ ] 修改 `src/preload/preload.mts`：暴露上述 IPC API 给渲染进程。
- [ ] 统一 IPC 返回结构：`{ ok, data?, error? }`。

### A3. 数据源默认切换到 SQLite（M1）

- [ ] 修改 `src/main/main.ts`：将默认 `database_url` 调整为 SQLite（例如 `sqlite://./data/dtsp.db`）。
- [ ] 保留 `DTSP_DATABASE_URL` 环境变量优先级。
- [ ] 启动时输出实际使用的数据库类型日志（mysql/sqlite）。

---

## B. `packages/backend`（Rust N-API + DB）

### B1. 数据模型最小集（M1）

- [ ] 新增/扩展 `src/models/project.rs`、`program.rs`、`tag.rs`、`control_scheme.rs`。
- [ ] 新增功能块实例与连接模型（如 `block_instance.rs`、`scheme_link.rs`）以及编辑文档模型。
- [ ] 更新 `src/models/mod.rs` 导出新模型。

### B2. 仓储与服务（M1/M3/M4）

- [ ] 新增 `project_repository.rs`、`program_repository.rs`、`tag_repository.rs`、`scheme_repository.rs`、`editor_doc_repository.rs`。
- [ ] 更新 `src/repositories/mod.rs` 导出。
- [ ] 新增 `project_service.rs`、`tag_service.rs`、`scheme_service.rs`、`editor_service.rs`。
- [ ] 更新 `src/services/mod.rs` 导出。

### B3. 控制器与 N-API 导出（M1/M2）

- [ ] 新增 `project_controller.rs`、`tag_controller.rs`、`scheme_controller.rs`、`editor_controller.rs`。
- [ ] 更新 `src/controllers/mod.rs`。
- [ ] 修改 `src/lib.rs`：导出 `listPrograms`、`createOrImportTags`、`loadEditorDoc`、`saveEditorDoc`、`saveSchemeStructure` 等 N-API 方法。
- [ ] 更新 `index.d.ts` 与 `index.js` 的接口声明与桥接（与 Rust 导出保持一致）。

### B4. DB 初始化与迁移（M1）

- [ ] 修改 `src/db/mod.rs`：确认 SQLite 连接串可用并稳定初始化。
- [ ] 增加最小建表 SQL/迁移执行入口（若当前尚未统一迁移框架，先实现 `initDb` 内幂等建表）。
- [ ] 约束保存语义：显式保存才写库，保存返回 `check_result`。

---

## C. `packages/frontend`（主窗口 + 子窗口渲染）

### C1. 路由与页面骨架（M2）

- [ ] 修改 `src/renderer/router/index.ts`：新增项目主页与子窗口编辑页路由。
- [ ] 新增 `src/renderer/views/project/index.vue`（项目、位号、Program 入口）。
- [ ] 新增 `src/renderer/views/editor/graph_program.vue`、`src/renderer/views/editor/text_program.vue`。

### C2. API 封装（M2/M3/M4）

- [ ] 新增 `src/renderer/api/project.ts`：项目与 Program 查询接口。
- [ ] 新增 `src/renderer/api/tag.ts`：位号创建/导入/校验接口。
- [ ] 新增 `src/renderer/api/editor.ts`：加载/保存编辑文档与方案保存接口。
- [ ] 更新 `src/renderer/api/index.ts` 导出。
- [ ] 更新 `src/renderer/api/types.ts` 增加 `EditorKind`、`ProgramSchedule`、`Tag`、`SchemePayload`、`CheckResult` 类型。

### C3. 图形程序编辑子窗口（M3）

- [ ] 在 `views/editor/graph_program.vue` 实现图形程序基础编辑能力。
- [ ] 支持：功能块实例创建、位号引用、连接关系维护。
- [ ] 增加“保存”按钮，调用 `editor:save_doc`。
- [ ] 页面加载时调用 `editor:load_doc` 回填。

### C4. 文本程序编辑子窗口（M4）

- [ ] 在 `views/editor/text_program.vue` 实现文本程序编辑与显式保存。
- [ ] 页面加载时回填历史文本。

### C5. 主窗口入口动作（M2）

- [ ] `views/project/index.vue` 增加“位号管理 / Program 配置 / 打开图形程序编辑 / 打开文本程序编辑”入口。
- [ ] 点击后调用 `editor:open`，处理 `reused_window` 反馈。

---

## 3. 验证任务（M5）

- [ ] 新增手工验收脚本文档：`docs/reviews/mvp_phase1_uat_checklist.md`（可选但建议）。
- [ ] 跑通演示链路：主窗 -> 位号 -> Program -> 控制方案 -> 保存检查 -> 重开验证。
- [ ] 验证单实例复用策略。
- [ ] 验证 SQLite 文件删除/损坏时的错误提示可读性。

---

## 4. 建议执行顺序（最短路径）

1. Desktop A3 + Backend B4（先确保 SQLite 启得来）
2. Backend B1/B2/B3（先打通数据结构与保存检查接口）
3. Desktop A1/A2（窗口机制 + IPC）
4. Frontend C1/C2（页面与接口壳）
5. Frontend C3/C4/C5（图形/文本程序能编辑保存并返回检查结果）
6. 验证任务（M5）

---

## 5. 任务估算（粗粒度）

- `packages/desktop`：2~3 人日
- `packages/backend`：5~7 人日（数据结构与校验接口增加）
- `packages/frontend`：5~8 人日（图形编辑能力复杂度波动最大）
- 联调与验收：2~3 人日

总计：约 14~21 人日（单人全职约 3~4 周）。
