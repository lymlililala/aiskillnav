////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
import { delay } from './mock-api';

export type McpCategory =
  | 'utility' // 通用工具
  | 'devtools' // 开发工具
  | 'productivity' // 效率工具
  | 'data' // 数据处理
  | 'database' // 数据库
  | 'cloud' // 云服务
  | 'automation' // 自动化
  | 'browser' // 浏览器/网页
  | 'monitoring' // 监控运维
  | 'location' // 地理位置
  | 'filesystem' // 文件系统
  | 'search' // 搜索
  | 'ai' // AI 模型
  | 'knowledge' // 知识管理
  | 'finance' // 金融
  | 'memory' // 记忆/存储
  | 'reasoning' // 推理
  | 'creative' // 创意内容生成（小说/简历/周报/漫画/视频）
  | 'media'; // 媒体/视频/音频处理

export type McpServer = {
  id: number;
  slug: string;
  name: string;
  description: string;
  url: string;
  category: McpCategory;
  is_official: boolean; // 是否 Anthropic 官方维护
  install_cmd?: string; // npm install / pip install 命令
  tags: string[];
  stars?: number; // GitHub stars (近似)
  is_featured: boolean;
  created_at: string;
};

const MCP_DATA: Omit<McpServer, 'id' | 'created_at'>[] = [
  // ── 文件系统 ──────────────────────────────────────────────────────────────
  {
    slug: 'filesystem',
    name: 'filesystem',
    description: '读写本地文件系统，支持文件创建、修改、删除、目录遍历，是最常用的 MCP Server 之一',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    category: 'filesystem',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-filesystem',
    tags: ['文件读写', '目录', '本地文件', '官方'],
    stars: 85000,
    is_featured: true
  },
  {
    slug: 'everything',
    name: 'everything',
    description: 'Windows 平台文件极速搜索，通过 Everything 引擎实现毫秒级文件定位',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/everything',
    category: 'filesystem',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-everything',
    tags: ['Windows', '文件搜索', 'Everything', '官方'],
    stars: 85000,
    is_featured: false
  },
  // ── 数据库 ────────────────────────────────────────────────────────────────
  {
    slug: 'sqlite',
    name: 'sqlite',
    description: '读写 SQLite 数据库，支持执行 SQL 查询、创建表、插入更新数据，适合本地开发调试',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'database',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-sqlite',
    tags: ['SQLite', '数据库', 'SQL', '官方'],
    stars: 85000,
    is_featured: true
  },
  {
    slug: 'postgres',
    name: 'postgres',
    description: '连接 PostgreSQL 数据库执行查询，支持完整的 SQL 操作，适合生产环境数据分析',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'database',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-postgres',
    tags: ['PostgreSQL', '数据库', 'SQL', '官方'],
    stars: 85000,
    is_featured: false
  },
  {
    slug: 'mysql',
    name: 'mysql',
    description: '连接 MySQL/MariaDB 数据库，支持查询、插入、更新等完整操作，社区维护',
    url: 'https://github.com/benborla29/mcp-server-mysql',
    category: 'database',
    is_official: false,
    install_cmd: 'npx mcp-server-mysql',
    tags: ['MySQL', 'MariaDB', '数据库', '社区'],
    stars: 800,
    is_featured: false
  },
  // ── 浏览器/网页 ───────────────────────────────────────────────────────────
  {
    slug: 'puppeteer',
    name: 'puppeteer',
    description:
      '通过 Puppeteer 控制 Chrome 浏览器，支持网页截图、表单填写、点击操作、JavaScript 执行',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'browser',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-puppeteer',
    tags: ['Puppeteer', '浏览器自动化', 'Chrome', '官方'],
    stars: 85000,
    is_featured: true
  },
  {
    slug: 'fetch',
    name: 'fetch',
    description: '抓取网页内容并转换为 Markdown 格式，AI 可直接阅读和分析任意网页',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    category: 'browser',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-fetch',
    tags: ['网页抓取', 'Markdown', 'HTTP', '官方'],
    stars: 85000,
    is_featured: true
  },
  {
    slug: 'browserbase',
    name: 'browserbase',
    description: '云端无头浏览器控制，无需本地安装 Chrome，通过 API 实现规模化浏览器自动化',
    url: 'https://github.com/browserbase/mcp-server-browserbase',
    category: 'browser',
    is_official: false,
    install_cmd: 'npx @browserbasehq/mcp',
    tags: ['云端浏览器', '无头', 'Browserbase'],
    stars: 1200,
    is_featured: false
  },
  // ── 开发工具 ──────────────────────────────────────────────────────────────
  {
    slug: 'github',
    name: 'github',
    description: '完整的 GitHub 操作：创建 PR、查看 Issues、提交代码、管理仓库，开发者必备',
    url: 'https://github.com/github/github-mcp-server',
    category: 'devtools',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-github',
    tags: ['GitHub', 'PR', 'Issues', '代码仓库', '官方'],
    stars: 12000,
    is_featured: true
  },
  {
    slug: 'gitlab',
    name: 'gitlab',
    description: '对接 GitLab 实例，支持仓库操作、Merge Request、Pipeline 状态查询',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'devtools',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-gitlab',
    tags: ['GitLab', 'MR', 'CI/CD', '官方'],
    stars: 85000,
    is_featured: false
  },
  {
    slug: 'git',
    name: 'git',
    description: '本地 Git 仓库操作：commit、diff、log、branch 管理，无需离开 AI 界面',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git',
    category: 'devtools',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-git',
    tags: ['Git', 'Commit', 'Diff', '版本控制', '官方'],
    stars: 85000,
    is_featured: false
  },
  // ── 效率工具 ──────────────────────────────────────────────────────────────
  {
    slug: 'slack',
    name: 'slack',
    description: '在 Slack 中收发消息、查询频道历史、管理通知，让 AI 融入团队沟通',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'productivity',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-slack',
    tags: ['Slack', '消息', '团队协作', '官方'],
    stars: 85000,
    is_featured: false
  },
  {
    slug: 'google-drive',
    name: 'google-drive',
    description: '读写 Google Drive 文件，支持 Docs、Sheets、Slides 的创建和编辑',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'productivity',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-gdrive',
    tags: ['Google Drive', 'Docs', 'Sheets', '云存储', '官方'],
    stars: 85000,
    is_featured: false
  },
  {
    slug: 'google-maps',
    name: 'google-maps',
    description: '地图搜索、地址解析、路线规划、周边 POI 查询，地理位置相关任务必备',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'productivity',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-google-maps',
    tags: ['Google Maps', '地图', '地址查询', '官方'],
    stars: 85000,
    is_featured: false
  },
  {
    slug: 'notion',
    name: 'notion',
    description: '操作 Notion 数据库和页面，支持创建、查询、更新 Block，知识管理利器',
    url: 'https://github.com/makenotion/notion-mcp-server',
    category: 'productivity',
    is_official: false,
    install_cmd: 'npx @notionhq/notion-mcp-server',
    tags: ['Notion', '知识库', '数据库', '笔记'],
    stars: 3500,
    is_featured: true
  },
  // ── 数据/搜索 ─────────────────────────────────────────────────────────────
  {
    slug: 'brave-search',
    name: 'brave-search',
    description: 'Brave 搜索引擎实时搜索，无追踪隐私保护，返回结构化搜索结果',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'search',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-brave-search',
    tags: ['Brave', '搜索', '实时', '隐私', '官方'],
    stars: 85000,
    is_featured: true
  },
  {
    slug: 'tavily',
    name: 'tavily',
    description: 'AI 优化的搜索 API，专为 Agent 设计，返回高质量摘要而非原始链接列表',
    url: 'https://github.com/tavily-ai/tavily-mcp',
    category: 'search',
    is_official: false,
    install_cmd: 'npx tavily-mcp',
    tags: ['Tavily', 'AI搜索', '摘要', 'Agent专用'],
    stars: 2100,
    is_featured: true
  },
  {
    slug: 'exa',
    name: 'exa',
    description: '语义搜索引擎，理解搜索意图而非关键词匹配，适合复杂研究任务',
    url: 'https://github.com/exa-labs/exa-mcp-server',
    category: 'search',
    is_official: false,
    install_cmd: 'npx exa-mcp-server',
    tags: ['Exa', '语义搜索', '研究', 'RAG'],
    stars: 1800,
    is_featured: false
  },
  // ── AI 模型 ───────────────────────────────────────────────────────────────
  {
    slug: 'openai',
    name: 'openai',
    description: '在 Claude 中调用 GPT 系列模型，实现多模型协作，适合需要图像生成或特定能力的场景',
    url: 'https://github.com/openai/openai-mcp-server',
    category: 'ai',
    is_official: false,
    install_cmd: 'npx openai-mcp',
    tags: ['OpenAI', 'GPT-4', '多模型', 'DALL-E'],
    stars: 4200,
    is_featured: false
  },
  {
    slug: 'sequential-thinking',
    name: 'sequential-thinking',
    description: '链式推理增强 Server，让 AI 在复杂问题上逐步思考，显著提升逻辑推理质量',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
    category: 'ai',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-sequential-thinking',
    tags: ['推理增强', '链式思考', 'CoT', '官方'],
    stars: 85000,
    is_featured: true
  },
  // ── 效率工具（扩展） ────────────────────────────────────────────────────────
  {
    slug: 'linear',
    name: 'linear',
    description: '连接 Linear 项目管理工具，AI 可查询/创建 Issues、管理 Sprint、追踪工作进度',
    url: 'https://github.com/linear/linear-mcp-server',
    category: 'productivity',
    is_official: false,
    install_cmd: 'npx @linear/mcp-server',
    tags: ['Linear', '项目管理', 'Issue追踪', 'Sprint'],
    stars: 2800,
    is_featured: false
  },
  {
    slug: 'jira',
    name: 'jira',
    description: '集成 Atlassian Jira，支持创建和查询 Tickets、管理 Sprint、读取项目看板状态',
    url: 'https://github.com/atlassian-labs/mcp-atlassian',
    category: 'productivity',
    is_official: false,
    install_cmd: 'npx @atlassian/mcp-server',
    tags: ['Jira', 'Atlassian', 'Ticket管理', '看板'],
    stars: 1900,
    is_featured: false
  },
  {
    slug: 'calendar',
    name: 'calendar',
    description: 'Google Calendar 读写，AI 可查询日程、创建会议、设置提醒，提升时间管理效率',
    url: 'https://github.com/modelcontextprotocol/servers-archived',
    category: 'productivity',
    is_official: true,
    install_cmd: 'npx @modelcontextprotocol/server-gcalendar',
    tags: ['Google Calendar', '日程管理', '会议创建', '官方'],
    stars: 85000,
    is_featured: false
  },
  {
    slug: 'discord',
    name: 'discord',
    description: '读取 Discord 频道消息、发送通知、管理服务器，适合构建自动化社区管理 Agent',
    url: 'https://github.com/v-3/discordmcp',
    category: 'productivity',
    is_official: false,
    install_cmd: 'npx discord-mcp',
    tags: ['Discord', '社区管理', '消息自动化', '通知'],
    stars: 950,
    is_featured: false
  },
  {
    slug: 'confluence',
    name: 'confluence',
    description: '读写 Atlassian Confluence Wiki，AI 可搜索文档、创建页面、更新知识库内容',
    url: 'https://github.com/atlassian-labs/mcp-atlassian',
    category: 'productivity',
    is_official: false,
    install_cmd: 'npx @atlassian/confluence-mcp',
    tags: ['Confluence', 'Wiki', '知识库', 'Atlassian'],
    stars: 1400,
    is_featured: false
  },
  // ── 开发工具（扩展） ────────────────────────────────────────────────────────
  {
    slug: 'docker',
    name: 'docker',
    description: '管理 Docker 容器和镜像，AI 可启动/停止容器、查看日志、管理 Docker Compose',
    url: 'https://github.com/ckreiling/mcp-server-docker',
    category: 'devtools',
    is_official: false,
    install_cmd: 'npx mcp-server-docker',
    tags: ['Docker', '容器管理', 'DevOps', '日志查看'],
    stars: 3200,
    is_featured: true
  },
  {
    slug: 'kubernetes',
    name: 'kubernetes',
    description: '管理 Kubernetes 集群，查询 Pod 状态、部署应用、查看事件日志，DevOps 必备',
    url: 'https://github.com/strowk/mcp-k8s-go',
    category: 'devtools',
    is_official: false,
    install_cmd: 'npx mcp-k8s',
    tags: ['Kubernetes', 'K8s', 'DevOps', '集群管理'],
    stars: 2100,
    is_featured: false
  },
  {
    slug: 'sentry',
    name: 'sentry',
    description: '连接 Sentry 错误追踪，AI 可查询错误详情、分析堆栈跟踪、关联代码问题',
    url: 'https://github.com/getsentry/sentry-mcp',
    category: 'devtools',
    is_official: false,
    install_cmd: 'npx sentry-mcp',
    tags: ['Sentry', '错误追踪', '堆栈分析', '监控'],
    stars: 1600,
    is_featured: false
  },
  {
    slug: 'aws',
    name: 'aws',
    description: '访问 AWS 云服务，查询 EC2/S3/Lambda 状态，管理云资源，适合 DevOps 自动化',
    url: 'https://github.com/awslabs/mcp',
    category: 'devtools',
    is_official: false,
    install_cmd: 'npx @aws/mcp-server',
    tags: ['AWS', 'S3', 'EC2', 'Lambda', '云服务'],
    stars: 4500,
    is_featured: true
  },
  // ── 数据库（扩展） ──────────────────────────────────────────────────────────
  {
    slug: 'redis',
    name: 'redis',
    description: '操作 Redis 缓存数据库，支持 GET/SET/查询 Key、分析内存使用、监控连接状态',
    url: 'https://github.com/redis/mcp-redis',
    category: 'database',
    is_official: false,
    install_cmd: 'npx redis-mcp',
    tags: ['Redis', '缓存', 'Key-Value', '内存数据库'],
    stars: 890,
    is_featured: false
  },
  {
    slug: 'mongodb',
    name: 'mongodb',
    description: '连接 MongoDB 文档数据库，AI 可执行查询、聚合管道分析，无需记忆 Query 语法',
    url: 'https://github.com/mongodb-js/mongodb-mcp-server',
    category: 'database',
    is_official: false,
    install_cmd: 'npx mongodb-mcp',
    tags: ['MongoDB', '文档数据库', '聚合查询', 'NoSQL'],
    stars: 1700,
    is_featured: false
  },
  {
    slug: 'supabase',
    name: 'supabase',
    description: '连接 Supabase 后端服务，支持数据库查询、文件存储、认证管理，开发者最爱',
    url: 'https://github.com/supabase-community/supabase-mcp',
    category: 'database',
    is_official: false,
    install_cmd: 'npx @supabase/mcp-server',
    tags: ['Supabase', 'PostgreSQL', '后端即服务', '开发者工具'],
    stars: 5200,
    is_featured: true
  },
  // ── AI 模型（扩展） ─────────────────────────────────────────────────────────
  {
    slug: 'huggingface',
    name: 'huggingface',
    description: 'Hugging Face 模型推理 MCP Server，让 AI 直接调用 HF 上的数万个开源模型',
    url: 'https://github.com/huggingface/huggingface-mcp-server',
    category: 'ai',
    is_official: false,
    install_cmd: 'npx huggingface-mcp',
    tags: ['HuggingFace', '开源模型', '模型推理', '模型库'],
    stars: 3800,
    is_featured: false
  },
  {
    slug: 'replicate',
    name: 'replicate',
    description: '调用 Replicate 上的 AI 模型（图像生成、语音合成等），一行命令运行任意 AI 模型',
    url: 'https://github.com/deepfates/mcp-replicate',
    category: 'ai',
    is_official: false,
    install_cmd: 'npx replicate-mcp',
    tags: ['Replicate', '图像生成', '语音合成', '多模态'],
    stars: 2300,
    is_featured: false
  },
  // ── 搜索（扩展） ─────────────────────────────────────────────────────────────
  {
    slug: 'perplexity-search',
    name: 'perplexity-search',
    description: 'Perplexity AI 搜索 MCP，带 AI 摘要的实时搜索，特别适合研究型 Agent 任务',
    url: 'https://github.com/ppl-ai/modelcontextprotocol',
    category: 'search',
    is_official: false,
    install_cmd: 'npx perplexity-mcp',
    tags: ['Perplexity', 'AI摘要', '实时搜索', '研究Agent'],
    stars: 1400,
    is_featured: false
  },
  {
    slug: 'arxiv',
    name: 'arxiv',
    description: '搜索 arXiv 学术论文数据库，获取最新研究成果，适合科研型 Agent',
    url: 'https://github.com/blazickjp/arxiv-mcp-server',
    category: 'search',
    is_official: false,
    install_cmd: 'npx arxiv-mcp-server',
    tags: ['arXiv', '论文搜索', '学术研究', '科研'],
    stars: 650,
    is_featured: false
  },

  // ── 创意内容生成（小说/简历/周报） ─────────────────────────────────────
  {
    slug: 'openai-image',
    name: 'openai-image',
    description: '调用 OpenAI DALL-E 3 生成图像，支持自然语言描述直接生成漫画插图、封面等创意图片',
    url: 'https://github.com/InSpatial-Labs/openai-image-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx openai-image-mcp',
    tags: ['DALL-E', '图像生成', '漫画插图', '创意图片', 'OpenAI'],
    stars: 2100,
    is_featured: true
  },
  {
    slug: 'stable-diffusion',
    name: 'stable-diffusion',
    description: '本地运行 Stable Diffusion，AI 可直接生成高质量图像用于漫剧插图、小说封面等创意内容',
    url: 'https://github.com/binarynoir/mcp-server-stable-diffusion',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx mcp-stable-diffusion',
    tags: ['Stable Diffusion', '本地图像', '漫画插图', '小说封面', '开源'],
    stars: 1800,
    is_featured: true
  },
  {
    slug: 'writesonic',
    name: 'writesonic',
    description: 'Writesonic AI 写作 MCP，支持博客文章、短视频脚本、简历文案等多场景内容生成，集成 SEO 优化',
    url: 'https://github.com/writesonic/writesonic-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx writesonic-mcp',
    tags: ['AI写作', '短视频脚本', '博客文章', '简历文案', 'SEO'],
    stars: 980,
    is_featured: false
  },
  {
    slug: 'resume-builder',
    name: 'resume-builder',
    description: '简历生成 MCP Server，输入工作经历和目标岗位，自动生成 ATS 优化的 Markdown/JSON 格式简历',
    url: 'https://github.com/mcp-community/resume-builder-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx resume-builder-mcp',
    tags: ['简历生成', 'ATS优化', '求职', 'Markdown', 'JSON简历'],
    stars: 1240,
    is_featured: true
  },
  {
    slug: 'weekly-report',
    name: 'weekly-report',
    description: '周报自动生成 MCP，读取 Git commits、任务系统、日历事件，自动汇总生成结构化工作周报',
    url: 'https://github.com/mcp-community/weekly-report-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx weekly-report-mcp',
    tags: ['周报生成', 'Git提交', '工作汇总', '自动化', '任务系统'],
    stars: 870,
    is_featured: true
  },
  {
    slug: 'story-writer',
    name: 'story-writer',
    description: '小说/故事写作辅助 MCP，维护人物设定、世界观、情节线索等上下文，支持长篇小说连续创作',
    url: 'https://github.com/mcp-community/story-writer-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx story-writer-mcp',
    tags: ['小说写作', '人物设定', '世界观', '情节', '长篇创作'],
    stars: 1560,
    is_featured: true
  },

  // ── 媒体/视频/音频 ──────────────────────────────────────────
  {
    slug: 'elevenlabs',
    name: 'elevenlabs',
    description: 'ElevenLabs 语音合成 MCP，AI 可直接调用生成逅真语音，适合短视频配音、有声小说、口播内容制作',
    url: 'https://github.com/elevenlabs/elevenlabs-mcp',
    category: 'media',
    is_official: false,
    install_cmd: 'npx elevenlabs-mcp',
    tags: ['语音合成', 'TTS', '短视频配音', '有声小说', 'ElevenLabs'],
    stars: 4200,
    is_featured: true
  },
  {
    slug: 'ffmpeg',
    name: 'ffmpeg',
    description: '通过 FFmpeg MCP 直接处理视频/音频文件，支持格式转换、剪辑、合并、加字幕等操作，短视频制作必备',
    url: 'https://github.com/mcp-community/ffmpeg-mcp',
    category: 'media',
    is_official: false,
    install_cmd: 'npx ffmpeg-mcp',
    tags: ['FFmpeg', '视频处理', '音频处理', '格式转换', '短视频制作'],
    stars: 3100,
    is_featured: true
  },
  {
    slug: 'youtube-transcript',
    name: 'youtube-transcript',
    description: '获取 YouTube 视频字幕/转录文本，适合提取第品视频内容、生成短视频脚本参考或学习材料',
    url: 'https://github.com/kimtaeyoon83/mcp-server-youtube-transcript',
    category: 'media',
    is_official: false,
    install_cmd: 'npx mcp-server-youtube-transcript',
    tags: ['YouTube', '视频字幕', '内容提取', '短视频脚本', '转录'],
    stars: 2800,
    is_featured: false
  },
  {
    slug: 'midjourney-mcp',
    name: 'midjourney-mcp',
    description: '通过 API 调用 Midjourney 生成艺术风格图像，适合漫剧配图、小说插图、短视频封面制作',
    url: 'https://github.com/mcp-community/midjourney-mcp',
    category: 'media',
    is_official: false,
    install_cmd: 'npx midjourney-mcp',
    tags: ['Midjourney', '艺术插图', '漫剧配图', '短视频封面', '图像生成'],
    stars: 2450,
    is_featured: false
  }
];

export const fakeMcpServers = {
  records: [] as McpServer[],

  initialize() {
    this.records = MCP_DATA.map((item, i) => ({
      ...item,
      id: i + 1,
      created_at: new Date(Date.now() - (MCP_DATA.length - i) * 7 * 24 * 3600 * 1000).toISOString()
    }));
  },

  async getMcpServers({
    page = 1,
    limit = 12,
    search,
    category,
    is_official
  }: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_official?: boolean;
  }) {
    await delay(250);
    let items = [...this.records];
    if (category && category !== 'all') items = items.filter((m) => m.category === category);
    if (is_official !== undefined) items = items.filter((m) => m.is_official === is_official);
    if (search) items = matchSorter(items, search, { keys: ['name', 'description', 'tags'] });
    const total_items = items.length;
    return { items: items.slice((page - 1) * limit, page * limit), total_items };
  },

  async getFeatured(): Promise<McpServer[]> {
    await delay(150);
    return this.records.filter((m) => m.is_featured);
  },

  async getStats() {
    await delay(100);
    const total = this.records.length;
    const official = this.records.filter((m) => m.is_official).length;
    const byCategory = this.records.reduce(
      (acc, m) => {
        acc[m.category] = (acc[m.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return { total, official, community: total - official, byCategory };
  },

  async getById(id: number): Promise<McpServer | null> {
    await delay(150);
    return this.records.find((m) => m.id === id) ?? null;
  },

  async getBySlug(slug: string): Promise<McpServer | null> {
    await delay(150);
    return this.records.find((m) => m.slug === slug) ?? null;
  },

  async create(payload: Omit<McpServer, 'id' | 'created_at'>): Promise<McpServer> {
    await delay(400);
    const now = new Date().toISOString();
    const newItem: McpServer = { ...payload, id: this.records.length + 1, created_at: now };
    this.records.push(newItem);
    return newItem;
  },

  async update(
    id: number,
    payload: Partial<Omit<McpServer, 'id' | 'created_at'>>
  ): Promise<McpServer | null> {
    await delay(300);
    const idx = this.records.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.records[idx] = { ...this.records[idx], ...payload };
    return this.records[idx];
  },

  async delete(id: number): Promise<boolean> {
    await delay(200);
    const idx = this.records.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    this.records.splice(idx, 1);
    return true;
  }
};

fakeMcpServers.initialize();
