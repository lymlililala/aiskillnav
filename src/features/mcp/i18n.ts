// MCP 栏目共享文案 i18n —— 中英两套，组件用 useIsEn() 选择。
// category 的「值」是固定 key（utility/devtools…），这里翻显示标签。

// 分类英文标签（plain，用于卡片 badge）
const CAT_EN: Record<string, string> = {
  utility: 'Utility', devtools: 'Dev tools', productivity: 'Productivity', data: 'Data',
  database: 'Database', cloud: 'Cloud', automation: 'Automation', browser: 'Browser',
  monitoring: 'Monitoring', location: 'Location', filesystem: 'Filesystem', search: 'Search',
  ai: 'AI models', knowledge: 'Knowledge', finance: 'Finance', memory: 'Memory',
  reasoning: 'Reasoning', creative: 'Creative', media: 'Media', other: 'Other'
};
const CAT_ZH: Record<string, string> = {
  utility: '通用工具', devtools: '开发工具', productivity: '效率工具', data: '数据处理',
  database: '数据库', cloud: '云服务', automation: '自动化', browser: '浏览器',
  monitoring: '监控运维', location: '地理位置', filesystem: '文件系统', search: '搜索',
  ai: 'AI 模型', knowledge: '知识管理', finance: '金融', memory: '记忆存储',
  reasoning: '推理', creative: '创意内容', media: '媒体/视频', other: '其他'
};

// 筛选 Tab（emoji + 标签）；value 为 DB 分类键
const TAB_DEFS = [
  { value: 'all', emoji: '' },
  { value: 'creative', emoji: '🎨' },
  { value: 'media', emoji: '🎬' },
  { value: 'utility', emoji: '🔧' },
  { value: 'devtools', emoji: '💻' },
  { value: 'productivity', emoji: '⚡' },
  { value: 'data', emoji: '📊' },
  { value: 'database', emoji: '🗄️' },
  { value: 'cloud', emoji: '☁️' },
  { value: 'automation', emoji: '🤖' },
  { value: 'browser', emoji: '🌐' },
  { value: 'monitoring', emoji: '📡' },
  { value: 'location', emoji: '📍' },
  { value: 'filesystem', emoji: '📁' },
  { value: 'search', emoji: '🔍' },
  { value: 'ai', emoji: '✨' }
];

export function mcpStrings(isEn: boolean) {
  const catMap = isEn ? CAT_EN : CAT_ZH;
  const catTabs = TAB_DEFS.map((d) => ({
    value: d.value,
    label:
      d.value === 'all'
        ? isEn
          ? 'All'
          : '全部'
        : `${d.emoji} ${catMap[d.value] ?? d.value}`.trim()
  }));
  return isEn
    ? {
        pageTitle: 'MCP Servers',
        pageDesc:
          'Model Context Protocol — the standard tool interface for AI Agents; a curated directory of the most useful MCP Servers',
        whatIsTitle: 'What is MCP?',
        whatIsBody:
          'MCP (Model Context Protocol) is an open protocol from Anthropic that lets AI models connect to external tools securely and in a standardized way.',
        analogy: 'Think of MCP as the USB port for AI Agents',
        analogyTail: ' — implement once, use everywhere.',
        learnMore: 'Learn more',
        learnMoreHref: '/en/tutorials/what-is-mcp',
        allListed: 'All MCP Servers',
        statTotal: 'Servers',
        statOfficial: 'Official',
        statCommunity: 'Community',
        searchPlaceholder: 'Search MCP Server name, description...',
        reset: 'Reset',
        recommended: 'Featured',
        official: 'Official',
        viewDetails: 'View details',
        noResults: 'No matching MCP Server',
        noResultsHint: 'Try adjusting your search or category',
        count: (n: number) => `${n} MCP Servers`,
        filtered: '(filtered)',
        cat: catMap,
        catTabs
      }
    : {
        pageTitle: 'MCP 专区',
        pageDesc: 'Model Context Protocol — AI Agent 的标准化工具接口，收录最实用的 MCP Server',
        whatIsTitle: '什么是 MCP？',
        whatIsBody:
          'MCP（Model Context Protocol）是 Anthropic 发布的开放协议，让 AI 模型能安全、标准化地连接外部工具。',
        analogy: '类比：MCP 是 AI Agent 的 USB 接口',
        analogyTail: ' — 一次实现，到处可用。',
        learnMore: '了解更多',
        learnMoreHref: '/tutorials/what-is-mcp',
        allListed: '全部收录 MCP Server',
        statTotal: '收录 Server',
        statOfficial: '官方维护',
        statCommunity: '社区贡献',
        searchPlaceholder: '搜索 MCP Server 名称、描述...',
        reset: '重置',
        recommended: '推荐',
        official: '官方',
        viewDetails: '查看详情',
        noResults: '未找到相关 MCP Server',
        noResultsHint: '尝试调整搜索词或分类筛选',
        count: (n: number) => `共 ${n} 个 MCP Server`,
        filtered: '（已过滤）',
        cat: catMap,
        catTabs
      };
}

export type McpStrings = ReturnType<typeof mcpStrings>;
