import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import backend from 'backend'
import { registerApiHandlers } from './api'
// import { startHttpApiServer } from './httpApi'

/** 数据库连接串：优先环境变量 DTSP_DATABASE_URL，与原先渲染进程默认值一致 */
const defaultDatabaseUrl = 'mysql://root:root@localhost/dtsp_graphic_manager'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const FRONTEND_DEV_SERVER_URL =
  process.env['FRONTEND_DEV_SERVER_URL'] ||
  (app.isPackaged ? undefined : process.env.DTSP_FRONTEND_DEV_URL)
// const HTTP_API_HOST = (process.env.DTSP_HTTP_API_HOST || '0.0.0.0').trim() || '0.0.0.0'
// const HTTP_API_PORT = Number(process.env.DTSP_HTTP_API_PORT || '18080')

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (FRONTEND_DEV_SERVER_URL) {
    win.loadURL(FRONTEND_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.whenReady().then(async () => {
  const fromEnv = process.env.DTSP_DATABASE_URL?.trim()
  const databaseUrl = fromEnv || defaultDatabaseUrl
  try {
    await backend.initDb(databaseUrl)
  } catch (e) {
    console.error('[main] 数据库初始化 initDb 失败:', e)
  }

  registerApiHandlers()
  // if (Number.isInteger(HTTP_API_PORT) && HTTP_API_PORT > 0) {
  //   startHttpApiServer(HTTP_API_HOST, HTTP_API_PORT)
  // } else {
  //   console.error('[main] DTSP_HTTP_API_PORT 非法，HTTP API 未启动:', process.env.DTSP_HTTP_API_PORT)
  // }
  createWindow()
})