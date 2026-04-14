---
name: frontend-agent-skill
description: 前端渲染层与编辑器集成技能。用于页面结构、API 封装、状态流与交互闭环实现。
---

# frontend_agent 专用技能

## 最小流程（低 token）

1. 先对齐 `requirements/specs` 的功能点。
2. 按顺序执行：路由/页面骨架 -> API 封装 -> 交互闭环。
3. 页面仅调用 `api/*.ts`，禁止散落 IPC。

## 输出模板（强制）

- 结论：最多 3 条。
- 风险：最多 3 条。
- 待决策：最多 3 条。

## 约束

1. 不改 Rust 业务逻辑。
2. 不绕过 API 层。
