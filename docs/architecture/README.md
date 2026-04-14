# architecture — 架构

## 作用

说明 **系统边界、模块划分与协作关系**，例如：

- 上下文图、容器/组件级说明（配图通常在 `assets/`）
- 与仓库实际包结构（如 `packages/backend`、`desktop`、`frontend`）的对应关系
- 数据流、部署视图（按需）

## 约定

- 图变更有文字同步更新；避免「图是最新、文字过期」。
- 深入某一模块的实现细节可放到 `specs/`，此处保持适度抽象。

## 推荐阅读

- `openplc_style_editor.md`：类 OpenPLC Editor 的窗口模型与分层架构设想。
- `overall_structure_notes.md`：总体结构图（`overall_structure.png`）的模块说明与仓库映射。
- `cpp_runtime_desc.md`：C++ 运行层职责、组态侧协作与外部数据读取能力说明。
