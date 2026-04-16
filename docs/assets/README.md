# assets — 静态资源

## 作用

存放文档引用的 **非 Markdown 正文** 资源，例如：

- 架构图、流程图、界面截图（PNG、SVG、WebP 等）
- 从工具导出的图示文件
- 必要时附带的 PDF 等只读附件

## 约定

- Markdown 正文放在对应主题目录（如 `architecture/technical/`、`flows/`），此处 **只放被引用的文件**。
- 文件命名建议：`主题-简述-YYYYMMDD.ext`，避免无意义名称。
- 大文件注意仓库体积；能矢量或压缩的优先。
