/**
 * 标签中枢页注册表：/tags/{slug}（中英镜像 /en/tags/{slug}）。
 *
 * 定位：与 /tutorials/topic/{topic}（14 个支柱主题，仅聚合教程）互补——
 * 标签页跨内容类型聚合（教程 + MCP + Agent），覆盖支柱主题之外的强搜索需求簇，
 * 作为独立流量入口承接 Google 长尾词。选词避开支柱 topic，防止自我蚕食。
 *
 * 数据依据：2026-07-22 实测 DB 标签分布（1066 个去重标签，仅 ≥8 条内容的建页）；
 * 其余标签维持列表页搜索参数链接（robots 屏蔽参数 URL，本就不该被索引）。
 *
 * 每个条目即一个可索引落地页：预渲染静态页 + ItemList/BreadcrumbList JSON-LD + hreflang。
 * 新增标签：在 TAG_PAGES 追加条目即可（页/站点地图/芯片分流全自动生效）。
 */

export type TagPage = {
  /** URL slug，也是芯片分流的主匹配值（大小写不敏感精确匹配） */
  slug: string;
  /** 中文 H1 / title 用 */
  title: string;
  /** 英文 H1 / title 用 */
  titleEn: string;
  /** 中文 SEO 描述（meta description + 页首段落，60-120 字） */
  description: string;
  /** 英文 SEO 描述 */
  descriptionEn: string;
  /** DB 查询 token（tags 数组精确匹配 + 教程 title ilike 兜底）；保持克制，避免泛词噪声 */
  matchTokens: string[];
};

export const TAG_PAGES: TagPage[] = [
  {
    slug: 'developer-tools',
    title: '开发者工具 MCP Server 合集',
    titleEn: 'Developer Tools MCP Servers',
    description:
      '聚合 320+ 个面向开发者的 MCP Server：代码检索、调试、API 调试、文档查询、构建与部署工具链，让 Claude、Cursor 等 AI 助手直接操作你的开发环境。附安装命令与真实使用场景。',
    descriptionEn:
      '320+ developer-focused MCP servers: code search, debugging, API testing, docs lookup, and build/deploy tooling — let Claude, Cursor, and other AI assistants operate your dev environment directly. Install commands and real use cases included.',
    matchTokens: ['developer-tools']
  },
  {
    slug: 'browser-automation',
    title: '浏览器自动化 MCP Server 合集',
    titleEn: 'Browser Automation MCP Servers',
    description:
      '让 AI Agent 打开真实浏览器完成操作：点击、填表、截图、抓取与端到端测试。收录 Playwright、Puppeteer 等主流浏览器自动化 MCP Server，附配置方法与场景教程。',
    descriptionEn:
      'Let AI agents drive real browsers: click, fill forms, screenshot, scrape, and run end-to-end tests. Curated Playwright, Puppeteer, and other browser-automation MCP servers with setup guides.',
    matchTokens: ['browser-automation']
  },
  {
    slug: 'databases',
    title: '数据库 MCP Server 合集',
    titleEn: 'Database MCP Servers',
    description:
      '用自然语言查询数据库：收录 PostgreSQL、MySQL、SQLite、MongoDB 等数据库的 MCP Server，让 AI 助手安全地读库、分析数据、生成报表。含只读配置与安全实践。',
    descriptionEn:
      'Query databases in natural language: curated MCP servers for PostgreSQL, MySQL, SQLite, MongoDB, and more — let AI assistants read, analyze, and report safely. Read-only configs and safety practices included.',
    matchTokens: ['databases']
  },
  {
    slug: 'finance-fintech',
    title: '金融与金融科技 MCP Server 合集',
    titleEn: 'Finance & Fintech MCP Servers',
    description:
      '270+ 个金融数据与支付类 MCP Server：行情数据、财报检索、加密货币、支付接口与风控工具，为投研与财务场景下的 AI Agent 提供实时数据接入。',
    descriptionEn:
      '270+ finance data and payment MCP servers: market data, filings search, crypto, payment APIs, and risk tooling — real-time data access for AI agents in investment research and finance workflows.',
    matchTokens: ['finance-fintech']
  },
  {
    slug: 'knowledge-memory',
    title: '知识与记忆 MCP Server 合集',
    titleEn: 'Knowledge & Memory MCP Servers',
    description:
      '让 AI 助手拥有长期记忆：收录知识库、向量检索、笔记与上下文管理类 MCP Server，覆盖 Obsidian、Notion 等主流知识工具，配合站内 RAG 教程搭建持久化记忆。',
    descriptionEn:
      'Give AI assistants long-term memory: curated knowledge-base, vector-search, note-taking, and context-management MCP servers — covers Obsidian, Notion, and more, and pairs with our RAG tutorials.',
    matchTokens: ['knowledge-memory']
  },
  {
    slug: 'coding-agents',
    title: '编码智能体 MCP Server 合集',
    titleEn: 'Coding Agent MCP Servers',
    description:
      '面向编码智能体的 MCP Server：任务拆解、代码执行、仓库操作与多文件编辑能力扩展，帮助你搭建能独立完成开发任务的 AI 编程工作流。',
    descriptionEn:
      'MCP servers for coding agents: task decomposition, code execution, repo operations, and multi-file editing — build AI coding workflows that complete dev tasks end to end.',
    matchTokens: ['coding-agents']
  },
  {
    slug: 'cloud-platforms',
    title: '云平台 MCP Server 合集',
    titleEn: 'Cloud Platform MCP Servers',
    description:
      '用 AI 助手管理云资源：收录 AWS、Azure、GCP、Cloudflare 等云平台的 MCP Server，覆盖资源查询、日志分析、成本查看与运维自动化场景。',
    descriptionEn:
      'Manage cloud resources with AI assistants: curated MCP servers for AWS, Azure, GCP, Cloudflare, and more — resource queries, log analysis, cost inspection, and ops automation.',
    matchTokens: ['cloud-platforms']
  },
  {
    slug: 'communication',
    title: '通讯与协作 MCP Server 合集',
    titleEn: 'Communication & Collaboration MCP Servers',
    description:
      '让 AI Agent 接入消息与协作工具：收录 Slack、Telegram、邮件、日历类 MCP Server，实现自动通知、消息汇总、会议安排等团队协作自动化。',
    descriptionEn:
      'Connect AI agents to messaging and collaboration tools: curated Slack, Telegram, email, and calendar MCP servers — automated notifications, message digests, and meeting scheduling.',
    matchTokens: ['communication']
  },
  {
    slug: 'file-systems',
    title: '文件系统 MCP Server 合集',
    titleEn: 'File System MCP Servers',
    description:
      '让 AI 安全地读写本地文件：收录文件系统类 MCP Server，覆盖代码库浏览、批量重命名、文档生成等场景，含目录白名单等权限配置实践。',
    descriptionEn:
      'Let AI safely read and write local files: curated filesystem MCP servers for repo browsing, batch renames, and doc generation — with directory allowlisting and permission best practices.',
    matchTokens: ['file-systems']
  },
  {
    slug: 'data-platforms',
    title: '数据平台 MCP Server 合集',
    titleEn: 'Data Platform MCP Servers',
    description:
      '连接数据仓库与分析平台：收录 BigQuery、Snowflake、ClickHouse 等数据平台的 MCP Server，让 AI Agent 直接跑分析查询、生成数据洞察。',
    descriptionEn:
      'Connect AI to data warehouses and analytics platforms: curated MCP servers for BigQuery, Snowflake, ClickHouse, and more — run analytical queries and generate insights directly.',
    matchTokens: ['data-platforms']
  },
  {
    slug: 'aggregators',
    title: '聚合网关类 MCP Server 合集',
    titleEn: 'Aggregator & Gateway MCP Servers',
    description:
      '一个入口接入多个工具：聚合类 MCP Server 把数十个工具/API 统一成单一 MCP 端点，减少配置数量、统一鉴权，适合工具较多的团队。',
    descriptionEn:
      'One endpoint, many tools: aggregator MCP servers unify dozens of tools and APIs behind a single MCP endpoint — less config, centralized auth, ideal for teams with large toolchains.',
    matchTokens: ['aggregators']
  },
  {
    slug: 'biology-medicine-and-bioinformatics',
    title: '医疗与生物信息 MCP Server 合集',
    titleEn: 'Biomedical & Bioinformatics MCP Servers',
    description:
      '医疗与生命科学场景的 MCP Server：文献检索、基因数据库、临床术语与药物查询工具，配合站内 AI 临床文书教程，探索医疗 AI 的落地方式。',
    descriptionEn:
      'MCP servers for medicine and life sciences: literature search, gene databases, clinical terminology, and drug lookup — pairs with our AI clinical documentation tutorial.',
    matchTokens: ['biology-medicine-and-bioinformatics']
  },
  {
    slug: 'python',
    title: 'Python AI 开发教程与工具',
    titleEn: 'Python AI Development: Tutorials & Tools',
    description:
      'Python 是 AI 开发的第一语言：聚合站内 Python 相关的 LLM 实战教程（语音检测、RAG、Agent）、SDK 指南与工具资源，从入门到生产部署。',
    descriptionEn:
      'Python is the first language of AI development: our Python tutorials (voice activity detection, RAG, agents), SDK guides, and tool resources — from first steps to production.',
    matchTokens: ['python']
  },
  {
    slug: 'llm',
    title: 'LLM 大模型实战教程与资源',
    titleEn: 'LLM Guides & Resources',
    description:
      '大模型工程实战：成本优化、Fallback 降级、推理部署、幻觉治理等生产级主题教程合集，帮你把 LLM 应用从 Demo 打磨到可上线。',
    descriptionEn:
      'Production LLM engineering: cost optimization, fallback routing, inference deployment, hallucination control, and more — take your LLM app from demo to production.',
    matchTokens: ['llm']
  },
  {
    slug: 'comparison',
    title: 'AI 工具对比评测合集',
    titleEn: 'AI Tool Comparisons',
    description:
      '选型前先对比：Dify vs Coze、LangChain vs LlamaIndex、Notion AI vs Obsidian 等站内深度对比文章合集，用真实差异分析帮你做决定。',
    descriptionEn:
      'Compare before you choose: Dify vs Coze, LangChain vs LlamaIndex, Notion AI vs Obsidian, and more — in-depth comparisons based on real differences.',
    matchTokens: ['comparison']
  },
  {
    slug: 'ai-tools',
    title: 'AI 工具精选与使用指南',
    titleEn: 'AI Tools: Picks & Guides',
    description:
      '站内 AI 工具相关内容合集：工具测评、使用教程、场景化推荐，覆盖写作、编程、设计、效率等方向，帮你找到真正好用的 AI 工具。',
    descriptionEn:
      'Everything about AI tools on our site: reviews, how-tos, and scenario-based picks across writing, coding, design, and productivity — find tools that actually work.',
    matchTokens: ['ai-tools']
  }
];

const norm = (s: string) => s.trim().toLowerCase();

export function getTagPage(slug: string): TagPage | undefined {
  return TAG_PAGES.find((t) => t.slug === norm(slug));
}

/** 芯片分流：单个 tag 是否命中某个标签中枢页（slug 或 matchTokens 精确匹配）。 */
export function findTagPageForTag(tag: string): TagPage | undefined {
  const t = norm(tag);
  return TAG_PAGES.find((p) => p.slug === t || p.matchTokens.some((tok) => norm(tok) === t));
}
