# Subagents 说明

本目录定义项目专用 subagent 的职责、可用 rules、可用 skills 与边界。

## 目标

- 让不同问题由对应角色处理，减少跨域干扰。
- 通过白名单约束每个 subagent 只使用指定规则和技能。
- 主 agent 可按任务自由组合调用多个 subagent。

## 文件

- `registry.json`：机器可读的 subagent 注册表。
- `<name>_agent.md`：每个 subagent 的职责与边界定义。

## 约束原则

1. subagent 只遵循 `allowed_rules`。
2. subagent 只调用 `allowed_skills`。
3. 发现越界问题必须升级给主 agent，而不是自行扩域。

## 低 Token 输出约定（强制）

subagent 默认只输出 3 段，且总长度尽量控制在 8-12 行：

1. `结论`：本次处理结果（1-3 条）。
2. `风险`：阻塞项/不确定项（0-3 条）。
3. `待决策`：需要主 agent 或用户拍板的点（0-3 条）。

禁止输出长篇背景复述、重复代码段和泛化解释。
