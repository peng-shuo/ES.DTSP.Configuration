---
name: build-native
description: 编译 Rust N-API 后端成为 Node.js 原生扩展（Add-on）。当 packages/backend/**/*.rs 中的代码被修改，或者编译生成的 .node 文件丢失或被占用锁定时使用。
---

# 构建原生后端 (N-API)

## 操作指令

当用户要求构建后端或修复 Rust N-API 编译错误时：

1. **状态校验**: 检查当前是否有 Electron 进程正在运行。如果有，`.node` 文件很可能被系统（特别是 Windows）锁定了，这会导致在构建时引发 "Failed to copy artifact" 的错误。
2. **建议用户**: 如果进程正在运行并锁定了文件，必须明确地提示用户在终端使用 `Ctrl + C` 停止 `pnpm dev` 开发服务器，然后再继续操作。
3. **执行构建**:
   用于开发和调试环境构建后端：

   ```bash
   pnpm -F backend build:debug
   ```

4. **结果确认**: 确保在 `packages/backend` 目录下成功生成了形如 `backend.*.node` 的文件，并且 `index.js` 和 `index.d.ts` 都已被同步更新。
5. **联动校验**: 若本次构建引入了新导出，建议补跑：

   ```bash
   pnpm -F frontend exec vue-tsc --noEmit
   ```

## 示例

**示例场景 1：用户修改了 Rust 里的 Service 代码**

```sh
User: 我在 Rust 里加了一个新方法，请帮我编译一下。
Agent:  
1. 执行 `pnpm -F backend build:debug`。
2. 向用户汇报原生模块已成功编译，对应的 TypeScript 声明也已更新。
```
