# 项目文档（docs）

本目录集中存放与 **需求、架构、规格、决策与协作** 相关的说明，与代码分离、按主题分文件夹管理。

## 目录一览

| 目录 | 说明 |
|------|------|
| [assets](./assets/README.md) | 图片、截图、导出图等静态资源 |
| [requirements](./requirements/README.md) | 需求说明、范围、用户故事、验收标准 |
| [flows](./flows/README.md) | 用例与业务流程（含与配图对应的文字说明） |
| [glossary](./glossary/README.md) | 术语表与领域名词对照 |
| [constraints](./constraints/README.md) | 非功能需求与约束（性能、安全、部署等） |
| [traceability](./traceability/README.md) | 需求与设计/测试的追溯关系 |
| [architecture](./architecture/README.md) | 系统与模块架构说明 |
| [specs](./specs/README.md) | 详细设计与模块规格 |
| [adr](./adr/README.md) | 架构决策记录（ADR） |
| [api](./api/README.md) | 对外/对内接口约定（HTTP、IPC 等） |
| [roadmap](./roadmap/README.md) | 版本规划与里程碑 |
| [reviews](./reviews/README.md) | 评审纪要、需求变更留痕 |

编写新文档时，请先确认主题归属；不确定时优先归入最接近的一类，并在文内交叉引用相关文档。

### 架构类延伸阅读

- [类 OpenPLC Editor 桌面组态工具 — 架构设想](./architecture/openplc_style_editor.md)（IEC 61131-3 对象关系、X6 / Monaco / 现有三包分工）
- [总体结构图说明（overall_structure）](./architecture/overall_structure_notes.md)（组态层/运行层/数据层协作与仓库映射）
- [C++ 运行层说明](./architecture/cpp_runtime_desc.md)（运行层模块、组态编译产物、与 Rust/Electron 分工、外部读取功能块数据）
- [ADR-0001：图形引擎与技术栈对比及双库策略](./adr/0001_tech_stack_and_dual_db_strategy.md)
- [ADR-0002：基于用户故事的 MVP 范围重梳理](./adr/0002_mvp_scope_from_user_story.md)
- [双库（MySQL + SQLite）技术规格草案](./specs/dual_db_implementation_spec.md)

### MVP 决策落地文档

- [MVP 第一阶段需求基线](./requirements/mvp_phase1_scope.md)
- [MVP 第一阶段路线图](./roadmap/mvp_phase1_roadmap.md)
- [MVP 第一阶段可执行任务清单](./roadmap/mvp_phase1_task_breakdown.md)
- [MVP 第一阶段实现规格](./specs/mvp_phase1_implementation_spec.md)
