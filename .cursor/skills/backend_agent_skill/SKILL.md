---
name: backend-agent-skill
description: 后端与桌面主进程协同技能。用于 Rust N-API、IPC、DB 模型与服务链路实现。
---

# backend_agent 专用技能

## 最小流程（低 token）

1. 先对齐 `specs` 字段与接口契约。
2. 仅按层输出变更点：`model/repo/service/controller/ipc`。
3. 仅报告关键验证：构建、类型、事务、错误映射。

## 输出模板（强制）

- 结论：最多 3 条（已改什么）。
- 风险：最多 3 条（阻塞/兼容性）。
- 待决策：最多 3 条（字段或策略争议）。

## 约束

1. 不处理 UI 细节。
2. 接口字段变更必须回写 docs/specs。
