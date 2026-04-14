// import http, { type IncomingMessage, type ServerResponse } from 'node:http'
// import { URL } from 'node:url'
// import backend from 'backend'

// type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
// type JsonObject = { [key: string]: JsonValue }
// type PlatformNodeDto = Awaited<ReturnType<typeof backend.platformNodeGetPageByPlatform>>['list'][number]
// type PlatformDto = Awaited<ReturnType<typeof backend.platformGetAll>>[number]
// type NodeCategoryDto = Awaited<ReturnType<typeof backend.nodeCategoryGetAll>>[number]
// type AlgorithmDto = Awaited<ReturnType<typeof backend.algorithmGetAll>>[number]
// type NodeDto = Exclude<Awaited<ReturnType<typeof backend.nodeGetById>>, null>
// type ApiHandler = (context: RequestContext) => Promise<void>

// type RequestContext = {
//   req: IncomingMessage
//   res: ServerResponse
//   reqUrl: URL
//   pathname: string
// }

// const API_PREFIX_NODE = '/async_data/node/'
// const API_PREFIX_CATEGORY = '/async_data/category/'
// const API_PATH_HEALTH = '/api/health'

// function writeJson(res: ServerResponse, statusCode: number, body: unknown) {
//   res.statusCode = statusCode
//   res.setHeader('Content-Type', 'application/json; charset=utf-8')
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
//   res.end(JSON.stringify(body))
// }

// function writeOk(res: ServerResponse, data: unknown) {
//   writeJson(res, 200, { code: 0, data })
// }

// function writeError(res: ServerResponse, statusCode: number, message: string) {
//   writeJson(res, statusCode, { code: statusCode, message })
// }

// function getPathPlatformCode(pathname: string, prefix: string): string | null {
//   if (!pathname.startsWith(prefix)) {
//     return null
//   }
//   const platformCode = decodeURIComponent(pathname.slice(prefix.length)).trim()
//   return platformCode || null
// }

// async function handleRequest(req: IncomingMessage, res: ServerResponse) {
//   if (!req.url) {
//     writeError(res, 400, '缺少请求 URL')
//     return
//   }

//   const reqUrl = new URL(req.url, 'http://localhost')
//   const pathname = reqUrl.pathname
//   const method = req.method?.toUpperCase() ?? 'GET'

//   if (method === 'OPTIONS') {
//     writeOk(res, { status: 'ok' })
//     return
//   }

//   if (method !== 'GET') {
//     writeError(res, 405, '仅支持 GET 请求')
//     return
//   }

//   const context: RequestContext = { req, res, reqUrl, pathname }
//   const handler = findApiHandler(pathname)

//   try {
//     if (!handler) {
//       writeError(res, 404, '接口不存在')
//       return
//     }
//     await handler(context)
//   } catch (e: any) {
//     writeError(res, 500, e?.message || '服务内部错误')
//   }
// }

// async function getPlatformByCode(platformCode: string): Promise<PlatformDto | undefined> {
//   const platforms = await backend.platformGetAll()
//   return platforms.find((item) => item.code === platformCode)
// }

// async function getAllPlatformNodes(platformId: number): Promise<PlatformNodeDto[]> {
//   const pageSize = 200
//   let page = 1
//   const list: PlatformNodeDto[] = []

//   while (true) {
//     const result = await backend.platformNodeGetPageByPlatform(platformId, page, pageSize)
//     list.push(...result.list)
//     if (list.length >= result.total || result.list.length < pageSize) {
//       break
//     }
//     page += 1
//   }

//   return list
// }

// async function getPlatformOrWrite404(
//   res: ServerResponse,
//   platformCode: string,
// ): Promise<PlatformDto | null> {
//   const platform = await getPlatformByCode(platformCode)
//   if (!platform?.id) {
//     writeError(res, 404, `平台不存在: ${platformCode}`)
//     return null
//   }
//   return platform
// }

// function compactObject<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
//   const result: Record<string, unknown> = { ...obj }
//   for (const key of Object.keys(result)) {
//     if (result[key] === undefined || result[key] === null) {
//       delete result[key]
//     }
//   }
//   return result
// }

// async function composePlatformNodeExpose(platformCode: string, platformNodes: PlatformNodeDto[]) {
//   const enabledPlatformNodes = platformNodes.filter((item) => item.enable)
//   const nodeIds = Array.from(new Set(enabledPlatformNodes.map((item) => item.nodeId)))
//   const nodeList = await Promise.all(nodeIds.map((id) => backend.nodeGetById(id)))
//   const nodeMap = new Map<number, NodeDto>()
//   for (const node of nodeList) {
//     if (node?.id) {
//       nodeMap.set(node.id, node)
//     }
//   }

//   const categories = await backend.nodeCategoryGetAll()
//   const categoryCodeMap = new Map<number, string>()
//   for (const category of categories) {
//     if (category.id) {
//       categoryCodeMap.set(category.id, category.code)
//     }
//   }

//   const algorithms = await backend.algorithmGetAll()
//   const algorithmCodeMap = new Map<number, string>()
//   for (const algorithm of algorithms as AlgorithmDto[]) {
//     if (algorithm.id) {
//       algorithmCodeMap.set(algorithm.id, algorithm.code)
//     }
//   }

//   return enabledPlatformNodes
//     .map((platformNode) => {
//       const node = nodeMap.get(platformNode.nodeId)
//       if (!node) {
//         return null
//       }

//       return compactObject({
//         platformCode,
//         name: node.name,
//         desc: node.desc,
//         shape: node.shape,
//         width: node.width,
//         height: node.height,
//         ports: node.ports,
//         svg: node.svg,
//         windowWidth: node.windowWidth,
//         windowHeight: node.windowHeight,
//         baseType: platformNode.baseType,
//         nodeSort: node.sort,
//         sort: platformNode.sort,
//         enable: platformNode.enable,
//         isCommonUse: platformNode.isCommonUse,
//         commonUseSort: platformNode.commonUseSort,
//         categoryCode: categoryCodeMap.get(platformNode.nodeCategoryId),
//         algorithmCode: platformNode.algorithmId ? algorithmCodeMap.get(platformNode.algorithmId) : undefined,
//       })
//     })
//     .filter((item) => item !== null)
// }

// async function filterCategoriesByPlatform(
//   platformNodes: PlatformNodeDto[],
// ): Promise<Array<Pick<NodeCategoryDto, 'name' | 'code' | 'sort'>>> {
//   const categoryIds = new Set(
//     platformNodes.filter((item) => item.enable).map((item) => item.nodeCategoryId),
//   )
//   const categories = await backend.nodeCategoryGetAll()
//   return categories
//     .filter((category) => category.id && categoryIds.has(category.id))
//     .map((category) => ({
//       name: category.name,
//       code: category.code,
//       sort: category.sort,
//     }))
// }

// /**
//  * 健康检查接口。
//  *
//  * 对外接口:
//  * - GET /api/health
//  *
//  * 返回:
//  * - { code: 0, data: { status: "ok" } }
//  */
// const healthHandler: ApiHandler = async ({ res }) => {
//   writeOk(res, { status: 'ok' })
// }

// /**
//  * 获取指定平台的图元暴露数据。
//  *
//  * 对外接口:
//  * - GET /async_data/node/{platformCode}
//  *
//  * 参数:
//  * - platformCode: 平台 code（路径参数）
//  *
//  * 返回:
//  * - { code: 0, data: PlatformNodeExpose[] }
//  * - 平台不存在时返回 404
//  */
// const platformNodeExposeHandler: ApiHandler = async ({ pathname, res }) => {
//   const platformCode = getPathPlatformCode(pathname, API_PREFIX_NODE)
//   if (!platformCode) return

//   const platform = await getPlatformOrWrite404(res, platformCode)
//   if (!platform?.id) return

//   const platformNodes = await getAllPlatformNodes(platform.id)
//   const data = await composePlatformNodeExpose(platformCode, platformNodes)
//   writeOk(res, data)
// }

// /**
//  * 获取指定平台关联的分类列表。
//  *
//  * 对外接口:
//  * - GET /async_data/category/{platformCode}
//  *
//  * 参数:
//  * - platformCode: 平台 code（路径参数）
//  *
//  * 返回:
//  * - { code: 0, data: Array<{ name, code, sort }> }
//  * - 平台不存在时返回 404
//  */
// const platformCategoryHandler: ApiHandler = async ({ pathname, res }) => {
//   const platformCode = getPathPlatformCode(pathname, API_PREFIX_CATEGORY)
//   if (!platformCode) return

//   const platform = await getPlatformOrWrite404(res, platformCode)
//   if (!platform?.id) return

//   const platformNodes = await getAllPlatformNodes(platform.id)
//   const data = await filterCategoriesByPlatform(platformNodes)
//   writeOk(res, data)
// }

// function findApiHandler(pathname: string): ApiHandler | null {
//   if (pathname === API_PATH_HEALTH) return healthHandler
//   if (pathname.startsWith(API_PREFIX_NODE)) return platformNodeExposeHandler
//   if (pathname.startsWith(API_PREFIX_CATEGORY)) return platformCategoryHandler
//   return null
// }

// /**
//  * 启动 HTTP API 服务。
//  *
//  * 对外暴露接口:
//  * - GET /api/health
//  * - GET /async_data/node/{platformCode}
//  * - GET /async_data/category/{platformCode}
//  *
//  * @param host 监听地址
//  * @param port 监听端口
//  */
// export function startHttpApiServer(host: string, port: number) {
//   const server = http.createServer((req, res) => {
//     void handleRequest(req, res)
//   })

//   server.listen(port, host, () => {
//     console.log(`[HTTP API] listening on http://${host}:${port}`)
//   })

//   server.on('error', (err) => {
//     console.error('[HTTP API] 启动失败:', err)
//   })
// }
