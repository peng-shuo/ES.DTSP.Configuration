# docs：废止用户故事 MVP 基线与目录分层落地

## 基本信息

- 时间：2026-04-16
- 关联会议纪要：[2026_04_15_docs_structure_review_meeting_514.md](./2026_04_15_docs_structure_review_meeting_514.md)（延续 4/15 会议方向，本次执行落地）

## 结论

1. **静态资源中的用户故事不完整**，不能作为需求参考基线；此前据此整理的 **MVP 第一阶段文档集** 予以废止并 **从仓库中删除**，不在原文件上叠加变更说明。
2. **`ADR-0002`**（基于用户故事的 MVP 范围）一并删除；公开索引以 `docs/adr/README.md` 为准，历史可通过版本控制查阅。
3. **`docs/architecture/`**、**`docs/specs/`** 采用二级目录 **`business/`**（业务）与 **`technical/`**（技术），约定 **先有业务、后整理技术**；各子目录含 `README.md` 说明职责。
4. **`glossary/`** 增加初稿 [common_and_domain_terms.md](../glossary/common_and_domain_terms.md)，后续随基线文档迭代扩充。

## 删除文件清单

| 路径 |
|------|
| `docs/requirements/mvp_phase1_scope.md` |
| `docs/roadmap/mvp_phase1_roadmap.md` |
| `docs/roadmap/mvp_phase1_task_breakdown.md` |
| `docs/specs/mvp_phase1_implementation_spec.md` |
| `docs/adr/0002_mvp_scope_from_user_story.md` |
| `docs/assets/user_story/function_block_user_story_v3.md` |
| `docs/assets/user_story/`（目录已空则移除） |

## 迁移与路径更新（摘要）

| 原路径 | 新路径 |
|--------|--------|
| `docs/architecture/openplc_style_editor.md` | `docs/architecture/technical/openplc_style_editor.md` |
| `docs/architecture/overall_structure_notes.md` | `docs/architecture/technical/overall_structure_notes.md` |
| `docs/architecture/cpp_runtime_desc.md` | `docs/architecture/technical/cpp_runtime_desc.md` |
| `docs/specs/dual_db_implementation_spec.md` | `docs/specs/technical/dual_db_implementation_spec.md` |

迁入 `technical/` 的文档中，对 `docs/assets/` 的相对引用已调整为自子目录出发的路径（如 `../../assets/...`）。

## 规则与索引同步

- `.cursor/rules/docs-directory-structure.mdc`：补充 `architecture/`、`specs/` 下 `business/`、`technical/` 二级目录说明。
- `docs/README.md`、`docs/architecture/README.md`、`docs/specs/README.md` 及各级 `README.md`：更新链接与推荐阅读，去除对已删 MVP 文档的引用。

## 待办

- 在 `requirements/`、`roadmap/` **重建**新的阶段范围与 MVP 基线**（具体范围另议）**。
- 在 `traceability/` 建立与新需求 ID 对应的追溯关系（可选，待基线确定后）。
