/**
 * MCP 详情页 SEO 标题用的展示名：把仓库式 name 清洗成产品名。
 * 例：'rchanllc/joltsms-mcp-server' → 'Joltsms'；'mobile-next/mobile-mcp' → 'Mobile'；'Firecrawl' → 'Firecrawl'。
 * 仅用于 metadata（页面 H1 仍展示原始 name，保留仓库路径信息）。
 */
export function mcpDisplayName(name: string): string {
  // 去掉 org/owner 前缀
  let n = name.includes('/') ? (name.split('/').pop() ?? name) : name;
  // 去掉冗余的 mcp 后缀（标题会统一补 ' MCP Server'）
  n = n.replace(/[-_]?mcp[-_]?server$/i, '').replace(/[-_]?mcp$/i, '');
  // 分词后首字母大写
  const pretty = n
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return pretty || name;
}
