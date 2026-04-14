import { readFileSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const envContent = readFileSync(join(root, ".env"), "utf8")
const frontendPkg =
  (envContent.match(/^DTSP_FRONTEND_PACKAGE=(\S+)/m) || [])[1] || "frontend"

const steps = [
  `pnpm -F ${frontendPkg} build`,
  "vite build",
  "electron-builder --config electron-builder.config.js",
]

for (const cmd of steps) {
  console.log(`\n> ${cmd}\n`)
  execSync(cmd, { stdio: "inherit", cwd: root, shell: true })
}
