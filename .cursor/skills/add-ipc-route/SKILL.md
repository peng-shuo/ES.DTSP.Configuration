---
name: add-ipc-route
description: 添加跨越 Rust 后端、Electron 主进程和 Vue 渲染进程的新 IPC 通信路由。当用户要求添加一个新的 API 接口、数据库操作，或打通前后端桥梁时使用此技能。
---

# 添加新的 IPC 路由

## 操作指令

添加一个新的 IPC 路由需要更新项目中的三个层级。必须始终遵循以下检查清单：

### 1. 更新 Rust 后端 (packages/backend)

- 在 `services/` 或 `repositories/` 层添加需要的业务与数据库逻辑。
- 在控制器层（例如，`src/controllers/something_controller.rs`）通过 N-API 暴露出该方法。
- 使用 `#[napi]` 宏对方法进行标记。
- 使用 `pnpm build:debug` 编译后端，从而将新方法的类型声明自动生成并更新到 `index.d.ts` 中。

### 2. 更新 Electron 主进程 (packages/desktop/src/main/api.ts)

- 从 `backend` 包导入这个新方法。
- 使用 `ipcMain.handle` 注册一个 IPC 处理程序 (handler)。

  ```typescript
  ipcMain.handle('newMethodName', async (_, arg1) => backend.newMethodName(arg1))
  ```

### 3. 更新 Electron 预加载脚本 (packages/desktop/src/preload/preload.mts)

- 当前项目 preload 已暴露通用 `window.ipcRenderer`，通常**不需要**为每个接口单独扩展 preload。
- 如需新增安全能力，再在 preload 的 `contextBridge` 中扩展。

  ```typescript
  newMethodName: (arg1: any) => ipcRenderer.invoke('newMethodName', arg1)
  ```

### 4. 更新 Vue 类型与逻辑 (packages/frontend/src/renderer)

- 在 `api/types.ts` 中补充 DTO 导出或接口定义。
- 在 `api/<module>.ts` 中封装调用：`window.ipcRenderer.invoke('channel', ...args)`。
- 在 `api/index.ts` 导出 API，并在页面中通过 `xxxApi.xxx()` 调用，不直接在视图里散落 IPC 细节。

## 示例

**User:** "加一个能够获取服务器状态的 IPC 路由。"
**Agent 行为:**

1. 在 `backend` 中添加 `#[napi] pub async fn get_server_status() -> Result<String>` 并编译。
2. 在 `packages/desktop/src/main/api.ts` 中添加 `handle('getServerStatus', async () => backend.getServerStatus())`。
3. 在 `packages/frontend/src/renderer/api/server.ts` 封装 `getServerStatus`。
4. 在 Vue 页面中调用 `serverApi.getServerStatus()`。
