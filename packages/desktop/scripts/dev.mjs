import { readFileSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const envContent = readFileSync(join(root, ".env"), "utf8")
const frontendPkg =
  (envContent.match(/^DTSP_FRONTEND_PACKAGE=(\S+)/m) || [])[1] || "frontend"
const devUrlOverride = (envContent.match(/^DTSP_FRONTEND_DEV_URL=(\S+)/m) || [])[1]
const defaultDevUrl =
  frontendPkg === "http://localhost:5174"
const electronDevUrl = devUrlOverride || defaultDevUrl
console.log(
  `[dev:desktop] 并行启动 ${frontendPkg} + desktop；Electron 将加载 ${electronDevUrl}（由 desktop Vite 注入）`,
)

const cmd = `pnpm --parallel --filter ${frontendPkg} --filter desktop dev`
console.log(`\n> ${cmd}\n`)
execSync(cmd, { stdio: "inherit", cwd: join(root, "..", ".."), shell: true })
