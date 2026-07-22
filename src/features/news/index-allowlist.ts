/**
 * news 可索引白名单：news 表没有正文字段，详情页只渲染摘要（中位 ~815 字符），属薄页，
 * 默认全部输出 robots noindex 并从 sitemap 排除，仅白名单内的 slug 恢复收录（与 MCP 白名单同模式）。
 *
 * 恢复路径：未来把某条资讯的摘要扩写为完整正文后，把它的 slug 逐个加入本名单即可恢复收录。
 * 2026-07-22 建立（AdSense「低价值内容」整改 P0b），初始为空 = 全量 noindex。
 */
export const INDEX_NEWS_SLUGS: ReadonlySet<string> = new Set<string>([
  // 扩写完成后按行加入，例如：
  // 'openai-gpt-5-release',
]);
