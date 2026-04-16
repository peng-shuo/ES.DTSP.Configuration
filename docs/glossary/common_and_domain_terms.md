# 通用与领域术语（初稿）

> 与 [glossary/README](./README.md) 约定一致：中英文对照、简短定义；与行业标准一致处可注明出处。

## 通用

| 术语 | English | 定义或说明 |
|------|---------|------------|
| MVP | Minimum Viable Product | 最小可行产品：以最少功能交付可验证价值与反馈的版本切片。 |
| 组态 | Configuration (engineering) | 对控制系统进行工程配置（工程、资源、程序与连接关系等），以生成可部署或可运行的配置数据。 |
| 工程 / 项目 | Project | 组态侧承载一组相关配置与资源的顶层容器；与具体数据库中的 `project` 实体对应时再在规格中定义。 |
| 验收标准 | Acceptance Criteria (AC) | 判定需求是否完成的可验证条件，常为可执行检查项。 |
| 追溯 | Traceability | 需求标识与设计、实现、测试之间的对应关系，用于变更影响分析与验收对齐。 |

## 领域（IEC 61131-3 / 工控组态）

| 术语 | English | 定义或说明 |
|------|---------|------------|
| IEC 61131-3 | IEC 61131-3 | 可编程控制器编程语言国际标准；定义 POU、多种语言与模型。 |
| POU | Program Organization Unit | 程序组织单元，如程序、功能块、函数等。 |
| 功能块 | Function Block (FB) | 带实例数据的可复用 POU，用于封装控制算法或设备行为。 |
| FBD | Function Block Diagram | 功能块图：以图形节点与连线表达数据流与控制关系。 |
| ST | Structured Text | 结构化文本：类 Pascal 的文本编程语言。 |
| 位号 | Tag / Signal point | 与过程 I/O 或内部变量对应的命名点，用于组态中的引用与连接。 |
| 用户程序 / Program | User program / Program | 工程内可调度执行的程序单元；调度属性（周期、相位、优先级等）在业务/技术规格中定义。 |
