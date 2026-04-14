import { ipcMain } from 'electron'
import backend from 'backend'

// 包装处理函数，捕获错误并通过 console.error 打印（避免底层C++直接打印UTF-8字节导致控制台乱码），然后原样抛出给前端
function handle<T extends any[], R>(
  channel: string,
  handler: (...args: T) => Promise<R> | R
) {
  ipcMain.handle(channel, async (_event, ...args) => {
    try {
      // @ts-ignore
      return await handler(...args)
    } catch (e: any) {
      console.error(`[IPC Error] ${channel}:`, e?.message || e)
      throw e
    }
  })
}

export function registerApiHandlers() {
  // Algorithm
  handle('algorithmGetById', async (id: number) => backend.algorithmGetById(id))
  handle('algorithmGetAll', async () => backend.algorithmGetAll())
  handle('algorithmGetPage', async (page: number, pageSize: number, keyword?: string) => backend.algorithmGetPage(page, pageSize, keyword))
  handle('algorithmCreate', async (dto: any) => backend.algorithmCreate(dto))
  handle('algorithmUpdate', async (dto: any) => backend.algorithmUpdate(dto))
  handle('algorithmDelete', async (id: number) => backend.algorithmDelete(id))
}
