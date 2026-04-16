# ADR-0001：图形引擎与技术栈对比及双库策略

## 状态

已采纳（Proposed -> Accepted）

## 日期

2026-04-14

## 背景

项目目标是实现类 OpenPLC Editor 的桌面组态工具，当前主栈为 `Rust + Electron + Vue`。  
需要明确：

1. 图形引擎与前端/后端技术选型对比结论；
2. 数据库是否可同时支持 `MySQL + SQLite`，以及落地策略。

参考现状：

- `openplc-editor` 使用 `React` 与 `@xyflow/react`（React Flow）。
- 当前项目前端为 `Vue 3`，后端为 `Rust N-API`，桌面端通过 `DTSP_DATABASE_URL` 初始化数据库。

```56:58:D:/Work/Code/SourceCode/openplc-editor/package.json
"@tanstack/react-table": "^8.10.7",
"@xyflow/react": "^12.0.1",
"auto-zustand-selectors-hook": "^2.0.0",
```

```77:79:D:/Work/Code/SourceCode/openplc-editor/package.json
"react": "^18.2.0",
"react-apexcharts": "^1.4.1",
"react-dom": "^18.2.0",
```

```14:19:packages/frontend/package.json
"monaco-editor": "^0.55.1",
"naive-ui": "^2.44.1",
"svgedit": "^7.4.1",
"vfonts": "^0.0.3",
"vue": "^3.5.30",
"vue-router": "4"
```

## 备选方案对比

### 1) 图形引擎

| 方案 | 优点 | 风险/代价 | 结论 |
|------|------|-----------|------|
| React Flow（`@xyflow/react`） | React 生态成熟、节点编辑能力强 | 在 Vue 主项目中混用 React，维护复杂度高 | 不作为主线 |
| AntV X6 | 框架无关、工业图元扩展能力强、适配 FBD/LD/SFC 更灵活 | 初期需要自定义图元与序列化规范 | 主线采用 |
| 其他可选：Rete.js / LogicFlow / GoJS / JointJS | 各有优势（规则引擎、轻量或商用能力） | 迁移与学习成本 | 作为备选，不进入首版 |

### 2) 前端框架

| 方案 | 优点 | 风险/代价 | 结论 |
|------|------|-----------|------|
| Vue 3 | 与当前仓库一致、迁移成本低、可快速承载主/子窗口 | 复用 React 组件成本高 | 主线采用 |
| React | 与 React Flow 生态天然匹配 | 与当前代码割裂，需要整体重构 | 不作为当前主线 |

### 3) 后端运行形态

| 方案 | 优点 | 风险/代价 | 结论 |
|------|------|-----------|------|
| Node 主后端 | 开发快、JS 生态丰富 | 运行时性能与稳定性边界更早暴露 | 编排层可用，不作为核心计算层 |
| Rust 主后端（N-API） | 性能与稳定性高，适合编译/数据一致性 | 学习与调试门槛较高 | 核心层采用 |

### 4) 数据库

| 方案 | 优点 | 风险/代价 | 结论 |
|------|------|-----------|------|
| 仅 MySQL | 适合中心化协作与服务化部署 | 本地离线与零运维体验差 | 不建议单独采用 |
| 仅 SQLite | 部署简单、单机离线体验好 | 多人并发协作能力弱 | 不建议单独采用 |
| MySQL + SQLite 双库 | 同时覆盖离线与团队模式 | 需要双方言测试与迁移治理 | 主线采用 |

## 决策

1. **图形引擎采用 AntV X6**，不在主应用中混用 React Flow。
2. **前端保持 Vue 3**，Electron 多窗口架构不变（主窗口工程管理，子窗口编辑器）。
3. **后端核心保持 Rust N-API**，Node/Electron 负责编排与进程控制。
4. **数据库采用双库策略（MySQL + SQLite）**：
   - `local` 模式优先 SQLite；
   - `team` 模式优先 MySQL；
   - 业务层统一接口，方言差异收敛到驱动与迁移层。

## 结果影响

### 正向影响

- 与当前代码基线一致，改造阻力低。
- 支持单机离线与团队协作两类场景。
- 为后续 C++ 运行层对接保留稳定的数据与编排边界。

### 负向影响

- 需要维护双库迁移与双套回归测试。
- 需要更严格的数据模型约束（主键、时间、JSON、事务语义）。

## 落地文档

- 详细技术规格见：`docs/specs/technical/dual_db_implementation_spec.md`
- 运行层协作见：`docs/architecture/technical/cpp_runtime_desc.md`
- 总体架构见：`docs/architecture/technical/openplc_style_editor.md`

## 后续动作

1. 按规格实现 Repository Trait + 双驱动。
2. 建立 MySQL/SQLite 双矩阵 CI。
3. 增加 `sqlite -> mysql` 工程迁移工具（可二期）。
