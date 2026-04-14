---
name: create-frontend-module
description: 根据模块名称和模块代码创建 Vue 前端页面模块。包括列表查询、新增/编辑、详情弹窗，并在 router 与 defaultLayout 菜单中自动配置路由与入口。在用户说「新增一个模块」、「创建一个前端页面」或者给出「模块名和模块 code」时使用。
---

# 创建前端页面模块工作流

## 1. 确认前置依赖与参数

在执行任务前，确保已经知晓或向用户询问：

- **模块名称 (Module Name)**：左侧菜单与 `meta.title` 用的中文名，例如「算法管理」。
- **模块代码 (Module Code)**：用于目录名、路由 path、`import` 路径的**小驼峰**，例如 `algorithm`（对应 `views/algorithm/`）。

## 2. 检查后端接口与类型

1. **`packages/backend/index.d.ts`**（N-API 导出）：是否存在 `xxxGetPage`、`xxxGetById`、`xxxCreate`、`xxxUpdate`、`xxxDelete` 等。
2. **`packages/frontend/src/renderer/api/types.ts`**：是否已有对应 DTO 接口（如 `XxxDto`），与列表/表单字段一致。

若接口未就绪，提示用户先用 **`add-ipc-route`** 技能打通后端、主进程 IPC 与 preload，再生成前端模块。

> **说明**：数据库初始化 `initDb` 已在主进程 `main.ts` 启动时执行。渲染进程应通过 `api/*.ts` 封装访问 `window.ipcRenderer.invoke`，新模块不要自行初始化数据库。

## 3. 创建视图目录与文件

在 **`packages/frontend/src/renderer/views/[moduleCode]/`** 下创建三个文件，统一使用 **`<script setup>`** + **Naive UI**，样式配合 **Tailwind**（与现有 `algorithm` 模块保持一致）。

### 3.1 `index.vue`（列表页）

- 外层容器：`<div class="[moduleCode]-page h-full min-h-0 flex flex-col">`（便于滚动与表格撑满）。
- 顶部工具栏：`n-space` + `n-button`（如「刷新数据」「新增 xxx」）。
- 列表：优先复用 `components/crud/CrudPageLayout.vue`，与现有 `algorithm` 模块保持一致。
- 列定义：序号列可用 `render(_row, index) => index + 1`；**操作列**用 `h(NSpace, …)` 包裹多个 **`h(NButton, …)`**（详情 / 编辑 / 删除），`size: 'small'`，删除用 `type: 'error'`。
- 数据加载：`loading` 包裹 `try/finally`；**禁止** `message.error(e.toString())`，统一：

```ts
import { getErrorMessage } from '../../utils/error';

// 列表/刷新失败
message.error(getErrorMessage(e));

// 删除失败（可保留简短前缀，或仅用 getErrorMessage）
message.error(getErrorMessage(e));
```

- 状态：`showAddDialog`、`showDetailDialog`、`currentEditRow`、`currentDetailId`（或等价命名）；子组件使用 **`v-model:show`**（见第 6 节）。

### 3.2 `addDialog.vue`（新增/编辑）

- **显示状态**必须用 **`defineModel<boolean>('show', { required: true })`**，`n-modal` 使用 **`v-model:show="show"`**。
- `props`：`editData: XxxDto | null`；`emit('refresh')` 在保存成功后触发。
- `watch(() => show.value, …)`：打开时根据 `editData` 填充或重置表单（`reactive` / 逐字段赋值）。
- 保存：`isSaving` + 提交按钮 **`:loading="isSaving"`**；成功 `message.success('保存成功')`、`emit('refresh')`、关闭弹窗。
- **保存失败**：只展示业务文案，使用：

```ts
message.error(getErrorMessage(e));
```

不要拼接 `保存失败: ${e.toString()}`（Electron IPC 会把错误包成一长串；`getErrorMessage` 会剥离 `Custom Error:` 等外壳）。

- `import` 顺序：Vue → naive-ui → 类型 → 子组件 → **`../../utils/error`**，**不要**写在 `defineProps` / `defineModel` 中间。

### 3.3 `detailDialog.vue`（详情）

- 同样 **`defineModel<boolean>('show')`** + **`v-model:show`**。
- `props`：`recordId: number | null`；**`watch(show, …)`** 里用 **`props.recordId !== null`** 判断再请求（与 `category` / `platform` 一致），打开时 **`xxxGetById`**。
- 展示：**`n-descriptions`** 与算法/分类/平台详情**对齐**，避免单列「标签在上」：

```vue
<n-descriptions
  v-if="detailData"
  bordered
  :column="2"
  label-placement="left"
  class="mt-4"
>
  <!-- n-descriptions-item ... -->
</n-descriptions>
<n-empty v-else description="暂无数据" class="mt-4" />
```

- 无数据不要用裸 `div`，用 **`n-empty`**。
- 底部 **`n-button type="primary"`** 关闭（与其它详情一致）。
- 加载：**`n-spin :show="loading"`** 包裹内容。
- 请求失败：`message.error(getErrorMessage(e))`；若需前缀可用「获取详情失败」+ `getErrorMessage`，但避免 `e.toString()`。
- **字段多、标签易被折行时**（参考图元详情）：可为 `n-descriptions` 增加 `:label-style="{ whiteSpace: 'nowrap' }"`。

### 3.4 弹窗尺寸与表单（与现有一致）

- 常见新增/编辑卡片弹窗：`:style="{ width: '500px', minWidth: '500px', maxWidth: '500px' }"`，`preset="card"`。
- 详情弹窗：多使用 `600px` 同宽限制；字段多的业务（如图元）可用 `800px`。

## 4. 注册路由

编辑 **`packages/frontend/src/renderer/router/index.ts`**：

- 使用 **`createWebHashHistory()`**（项目现状），新增 `RouteRecordRaw`：

```ts
{
  path: '/moduleCode',
  name: 'moduleCode',
  component: () => import('../views/moduleCode/index.vue'),
  meta: { title: '模块名称' },
},
```

- **不要**改变首页 `redirect` 策略，除非用户明确要求（当前为 `redirect: '/algorithm'`）。

## 5. 默认布局菜单

编辑 **`packages/frontend/src/renderer/layouts/defaultLayout.vue`**：

- 在 **`menuOptions`**（`computed`）中增加一项：`key` 与路由 **`path` 一致**（如 `'/algorithm'`）。
- `label` 使用 **`h(RouterLink, { to: '/moduleCode' }, { default: () => '模块名称' })`**，`icon` 使用 **`renderIcon(某个 @vicons/ionicons5 图标)`**。
- 当前菜单为扁平结构，新增模块一般直接增加为顶层菜单项。

## 6. 父子组件弹窗绑定（强制）

父组件必须使用具名 **`v-model:show`**：

```vue
<AddDialog
  v-model:show="showAddDialog"
  :edit-data="currentEditRow"
  @refresh="fetchData"
/>
<DetailDialog
  v-model:show="showDetailDialog"
  :record-id="currentDetailId"
/>
```

不要使用 `:show` + `@update:show` 手动同步。

## 7. 错误处理与文案（强制摘要）

| 场景 | 做法 |
| ------ | ------ |
| 任意渲染进程 API 调用的 `catch` | 使用 **`getErrorMessage(e)`**，不用 **`e.toString()`** |
| 保存失败 | **`message.error(getErrorMessage(e))`** |
| 列表加载失败 | **`message.error(getErrorMessage(e))`** |
| 后端业务错误 | 文案在 Rust `DbErr::Custom`；前端靠 `getErrorMessage` 剥壳 |

工具位置：**`packages/frontend/src/renderer/utils/error.ts`**。若后端新增英文错误码，可在该文件的 **`ERROR_MESSAGE_MAP`** 中增加关键字 → 中文提示。

## 8. 其它规范引用

- 目录职责：**`vue-directory-structure`**（`api/`、`components/`、`views/`、`utils/` 等）。
- 命名与桌面端约定：**`desktop-naming-convention`**、**`vue-electron`**。
- 视图目录与文件命名：**小驼峰** `moduleCode`，与 `router` 中 `import('../views/moduleCode/index.vue')` 一致。

完成新增文件后，建议执行 **`pnpm -F frontend exec vue-tsc --noEmit`** 确认类型无误。
