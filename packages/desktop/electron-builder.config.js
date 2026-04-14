"use strict"

const fs = require("fs")
const path = require("path")

const envContent = fs.readFileSync(path.join(__dirname, ".env"), "utf8")
const frontendPkg = (envContent.match(/^DTSP_FRONTEND_PACKAGE=(\S+)/m) || [])[1] || "frontend"

/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
    appId: "com.dtsp.graphicmanager",
    productName: "DTSP GraphicManager",
    asar: true,

    /**
     * 解包 native addon，避免 asar 内无法加载 .node 文件
     */
    asarUnpack: ["node_modules/backend/**/*"],

    directories: {
        output: "releaseApp/${version}",
        buildResources: "build",
    },

    /**
     * 打包内容：前端产物 + Electron 主进程产物 + package.json
     * 排除 native addon（通过 extraResources 单独处理）
     */
    files: [
        {
            from: `../${frontendPkg}/dist`,
            to: "dist",
            filter: ["**/*"],
        },
        "dist-electron/**",
        "package.json",
        "!node_modules/backend/**",
    ],

    /**
     * 将 native addon 作为 extraResources 放到应用资源目录
     */
    extraResources: [
        {
            from: "node_modules/backend",
            to: "node_modules/backend",
        },
    ],

    mac: {
        artifactName: "${productName}_${version}_${arch}.${ext}",
        target: [
            {
                target: "dir",
                arch: ["arm64"],
            },
        ],
    },

    win: {
        artifactName: "${productName}_${version}_${arch}.${ext}",
        target: [
            {
                target: "dir",
                arch: ["x64"],
            },
        ],
    },

    linux: {
        artifactName: "${productName}_${version}_${arch}.${ext}",
        target: [
            {
                target: "dir",
                arch: ["x64", "arm64"],
            },
        ],
    },

    publish: null,
}

module.exports = config
