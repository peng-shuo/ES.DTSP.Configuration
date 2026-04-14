# ADR-0002：基于用户故事的 MVP 范围重梳理

## 状态

Accepted

## 日期

2026-04-14

## 背景

`docs/assets/user_story/function_block_user_story_v3.md` 提供了更完整的业务流程：项目启动、位号创建/导入、Program 调度配置、控制方案组态、保存检查、调试与运行。  
在保持既定总体架构不变的前提下，需要重定义 MVP：从“编辑器实现导向”调整为“功能能力与数据结构导向”。

## 已采纳调整

1. MVP 文档不再绑定具体图形/文本实现技术细节，仅定义功能能力。
2. MVP 核心闭环从“打开两个编辑器”升级为：
   - 项目管理；
   - 位号管理（创建/导入/校验）；
   - Program 调度配置（周期/相位/优先级）；
   - 控制方案结构保存与检查结果返回；
   - SQLite 落盘与重开恢复。
3. 运行层联调、编译导出仍不进入 MVP。

## 影响文档

- `docs/requirements/mvp_phase1_scope.md`
- `docs/specs/mvp_phase1_implementation_spec.md`
- `docs/roadmap/mvp_phase1_roadmap.md`
- `docs/roadmap/mvp_phase1_task_breakdown.md`

## 已确认决策（冻结）

本次按建议组合确认：`1B + 2C + 3B + 4A + 5C + 6A + 7B`。

1. **位号校验粒度 = B**
   - 启用：唯一性、必填项、命名规则、类型匹配。
   - 不启用：跨工具来源冲突的深度语义校验（留后续阶段）。
2. **导入策略 = C**
   - 冲突时提供交互选择（覆盖/跳过/重命名），保留导入日志。
3. **保存检查失败策略 = B**
   - 允许保存但标记警告（弱一致），错误级问题仍需阻断。
4. **Program 调度枚举 = A**
   - 固定 `fast/1x/2x/5x/10x`。
5. **控制方案结构存储粒度 = C**
   - A+B 混合：保存编辑器原始文档快照 + 结构化实例/连接/参数表。
6. **分程控制参数模型 = A**
   - MVP 仅支持 2 段（0~50，50~100）。
7. **窗口复用键 = B**
   - 采用 `scheme_id + editor_kind`。

## 后续动作

已据此冻结 `mvp_phase1_implementation_spec.md` 与相关需求/路线图文档字段。
