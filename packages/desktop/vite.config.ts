import { defineConfig, loadEnv } from 'vite'
import electron from 'vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultFrontendDevUrl = 'http://localhost:5174'
  const frontendDevUrl =
    (env.DTSP_FRONTEND_DEV_URL || '').trim() || defaultFrontendDevUrl

  return {
    plugins: [
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'src/main/main.ts',
          vite: {
            define: {
              // 主进程 bundle 内可读；空串时在 main.ts 中回退到代码内默认连接串
              'process.env.DTSP_DATABASE_URL': JSON.stringify(env.DTSP_DATABASE_URL ?? ''),
              'process.env.DTSP_HTTP_API_HOST': JSON.stringify(env.DTSP_HTTP_API_HOST ?? ''),
              'process.env.DTSP_HTTP_API_PORT': JSON.stringify(env.DTSP_HTTP_API_PORT ?? ''),
              'process.env.DTSP_FRONTEND_PACKAGE': JSON.stringify(env.DTSP_FRONTEND_PACKAGE ?? 'frontend'),
              'process.env.DTSP_FRONTEND_DEV_URL': JSON.stringify(frontendDevUrl),
            },
            build: {
              rollupOptions: {
                external: ['backend'],
              },
            },
          },
        },
        {
          entry: 'src/preload/preload.mts',
          onstart(options) {
            options.reload()
          },
          vite: {
            build: {
              rollupOptions: {
                external: ['electron', 'backend'],
                output: {
                  format: 'esm',
                  entryFileNames: '[name].mjs',
                },
              },
            },
          },
        },
      ]),
    ],
  }
})