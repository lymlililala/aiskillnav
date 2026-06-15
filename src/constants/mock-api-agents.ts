////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
import { delay } from './mock-api';

// Agent 类型分类（6大类）
export type AgentType =
  | 'general' // 通用自主 Agent（像 Manus 这种能干活的）
  | 'research' // 深度研究型 Agent
  | 'builder' // Agent 构建平台（低代码/开发者工具）
  | 'computer' // 计算机操控型 Agent（控制浏览器/桌面）
  | 'creative' // 垂直创意型 Agent
  | 'proactive'; // 新一代 Proactive Agent（主动感知型）

// 开源状态
export type AgentOpenSource = 'open' | 'closed' | 'partial';

// 收录状态
export type AgentStatus = 'published' | 'pending' | 'rejected' | 'draft';

export type Agent = {
  id: number;
  name: string;
  description: string;
  url: string;
  agent_type: AgentType;
  open_source: AgentOpenSource;
  region: 'global' | 'cn'; // 主要面向地区
  tags: string[];
  is_featured: boolean;
  status: AgentStatus;
  review_note?: string;
  created_at: string;
  updated_at: string;
  // 英文站字段（DB select('*') 运行时携带）
  name_en?: string | null;
  description_en?: string | null;
  tags_en?: string[] | null;
};

export type CreateAgentPayload = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAgentPayload = Partial<CreateAgentPayload>;

// ── 真实数据 ──────────────────────────────────────────────────────────────────

const AGENT_DATA: Omit<Agent, 'id' | 'created_at' | 'updated_at'>[] = [
  // ── 通用自主 Agent ──────────────────────────────────────────────────────────
  {
    name: 'Manus',
    url: 'https://manus.im',
    description:
      '全球首款通用 AI Agent，已被 Meta 收购，自主任务分解+执行闭环，能独立完成复杂工作任务',
    agent_type: 'general',
    open_source: 'closed',
    region: 'global',
    tags: ['通用 Agent', 'Meta', '任务自动化', '闭环执行'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'OpenClaw',
    url: 'https://openclaw.ai',
    description: '开源通用 Agent，GitHub 2026 年爆火，社区生态强，支持自托管部署',
    agent_type: 'general',
    open_source: 'open',
    region: 'global',
    tags: ['开源', 'GitHub', '社区生态', '自托管'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'AutoGPT',
    url: 'https://agpt.co',
    description: '最早期自主 Agent，开源鼻祖，GPT-4 驱动的自主任务执行框架',
    agent_type: 'general',
    open_source: 'open',
    region: 'global',
    tags: ['开源鼻祖', 'GPT-4', '自主任务', '早期项目'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'OpenHands',
    url: 'https://github.com/All-Hands-AI/OpenHands',
    description: '前身 OpenDevin，专注软件开发 Agent，可自动化完成编程任务、代码审查和部署',
    agent_type: 'general',
    open_source: 'open',
    region: 'global',
    tags: ['软件开发', 'OpenDevin', 'GitHub', '代码自动化'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Devin',
    url: 'https://cognition.ai',
    description: '自主 AI 软件工程师，全流程写代码：从需求到调试到部署，估值超过 10 亿美元',
    agent_type: 'general',
    open_source: 'closed',
    region: 'global',
    tags: ['AI 工程师', '写代码', 'Cognition', '全流程'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'SWE-agent',
    url: 'https://swe-agent.com',
    description: '专注代码 bug 修复的 Agent，SWE-bench 评测领先，学术界和工程界均认可',
    agent_type: 'general',
    open_source: 'open',
    region: 'global',
    tags: ['Bug 修复', 'SWE-bench', '代码修复', '学术'],
    is_featured: false,
    status: 'published'
  },

  // ── 深度研究型 Agent ────────────────────────────────────────────────────────
  {
    name: 'OpenAI Deep Research',
    url: 'https://openai.com',
    description: '一键生成专业研究报告，自动搜索、整合、分析多维度信息，输出结构化报告',
    agent_type: 'research',
    open_source: 'closed',
    region: 'global',
    tags: ['OpenAI', '研究报告', '信息整合', '专业分析'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    description: '实时联网问答+引用来源，搜索引擎的 AI 替代品，答案透明可溯源',
    agent_type: 'research',
    open_source: 'closed',
    region: 'global',
    tags: ['实时联网', '引用来源', '搜索替代', '透明答案'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'DeepSearcher',
    url: 'https://github.com/zilliztech/deep-searcher',
    description: '开源，结合私有知识库，企业级 RAG 方案，支持 Milvus 向量数据库',
    agent_type: 'research',
    open_source: 'open',
    region: 'global',
    tags: ['开源', 'RAG', '私有知识库', 'Milvus', '企业级'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Genspark',
    url: 'https://genspark.ai',
    description: '搜索+Agent 一体化，中国团队出品，生成 Sparkpages 沉浸式阅读体验',
    agent_type: 'research',
    open_source: 'closed',
    region: 'cn',
    tags: ['中国团队', '搜索一体化', 'Sparkpages', '沉浸式'],
    is_featured: true,
    status: 'published'
  },

  // ── Agent 构建平台 ──────────────────────────────────────────────────────────
  {
    name: 'Dify',
    url: 'https://dify.ai',
    description: '开源 Agent 构建平台，支持工作流编排、RAG、工具调用，一站式 LLM 应用开发',
    agent_type: 'builder',
    open_source: 'open',
    region: 'cn',
    tags: ['开源', '工作流编排', 'RAG', 'LLM 应用', '中国团队'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Coze（扣子）',
    url: 'https://coze.com',
    description: '字节跳动出品，国际版，Plugins 生态丰富，无代码搭建 AI Bot 和 Agent',
    agent_type: 'builder',
    open_source: 'closed',
    region: 'cn',
    tags: ['字节跳动', 'Plugins', '无代码', 'Bot', '扣子'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'n8n',
    url: 'https://n8n.io',
    description: '开源自动化工作流平台，支持 AI Agent 流水线，400+ 集成节点，可自托管',
    agent_type: 'builder',
    open_source: 'open',
    region: 'global',
    tags: ['开源', '自动化工作流', '400+ 集成', '自托管'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'LangChain',
    url: 'https://langchain.com',
    description: 'Agent 开发框架，生态最大，Python/JS 双端支持，LangGraph 支持多 Agent 编排',
    agent_type: 'builder',
    open_source: 'open',
    region: 'global',
    tags: ['开发框架', '生态最大', 'LangGraph', 'Python', 'JavaScript'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'CrewAI',
    url: 'https://crewai.com',
    description: '多 Agent 协作框架，通过角色分工实现 Agent 团队协作，生产就绪',
    agent_type: 'builder',
    open_source: 'open',
    region: 'global',
    tags: ['多 Agent', '角色协作', '开源框架', '生产就绪'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'AgentGPT',
    url: 'https://agentgpt.reworkd.ai',
    description: '网页端直接部署自主 Agent，无需代码，设定目标后自动分解和执行任务',
    agent_type: 'builder',
    open_source: 'open',
    region: 'global',
    tags: ['网页端', '无代码', '自主 Agent', '目标分解'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Flowise',
    url: 'https://flowiseai.com',
    description: '可视化 LLM 流程构建，低代码拖拽搭建 Agent，支持 LangChain 和 LlamaIndex',
    agent_type: 'builder',
    open_source: 'open',
    region: 'global',
    tags: ['低代码', '可视化', 'LangChain', 'LlamaIndex', '拖拽'],
    is_featured: false,
    status: 'published'
  },

  // ── 计算机操控型 Agent ──────────────────────────────────────────────────────
  {
    name: 'Claude Computer Use',
    url: 'https://www.anthropic.com',
    description: 'Anthropic 出品，直接操控电脑屏幕，执行点击/输入/浏览等操作，开创计算机使用新范式',
    agent_type: 'computer',
    open_source: 'closed',
    region: 'global',
    tags: ['Anthropic', '操控电脑', '屏幕交互', '计算机使用'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'browser-use',
    url: 'https://github.com/browser-use/browser-use',
    description: '开源浏览器自动化 Agent，LLM 直接控制浏览器，GitHub 爆火项目',
    agent_type: 'computer',
    open_source: 'open',
    region: 'global',
    tags: ['开源', '浏览器自动化', 'GitHub 热门', 'Playwright'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Multion',
    url: 'https://multion.ai',
    description: '浏览器 Agent，帮你完成网页任务，支持复杂多步骤网页操作自动化',
    agent_type: 'computer',
    open_source: 'closed',
    region: 'global',
    tags: ['浏览器 Agent', '网页任务', '多步骤操作'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Skyvern',
    url: 'https://skyvern.com',
    description: '视觉 + LLM 驱动的浏览器自动化，无需 CSS 选择器，直接理解网页视觉结构',
    agent_type: 'computer',
    open_source: 'open',
    region: 'global',
    tags: ['视觉驱动', '浏览器自动化', '无选择器', '开源'],
    is_featured: false,
    status: 'published'
  },

  // ── 垂直创意型 Agent ────────────────────────────────────────────────────────
  {
    name: 'Lovart',
    url: 'https://lovart.ai',
    description: '设计师 AI Agent，自动出图/排版/品牌设计，理解设计意图并输出专业视觉作品',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['设计 Agent', '出图', '排版', '品牌设计', '创意'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Gamma',
    url: 'https://gamma.app',
    description: '自动生成 PPT/文档/网页的 Agent，输入主题即可产出精美演示文稿',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['PPT 生成', '文档 Agent', '演示文稿', '一键生成'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Cursor',
    url: 'https://cursor.com',
    description: '代码 Agent IDE，估值 500 亿美金，AI 原生代码编辑器，重新定义编程工作流',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['代码 Agent', 'IDE', '500 亿估值', 'AI 编程', '代码补全'],
    is_featured: true,
    status: 'published'
  },

  // ── Proactive Agent ─────────────────────────────────────────────────────────
  {
    name: 'ColaOS',
    url: '#',
    description: '"Soul-First" AI OS，主动感知用户上下文，下一代 Proactive Agent 操作系统，内测中',
    agent_type: 'proactive',
    open_source: 'closed',
    region: 'global',
    tags: ['AI OS', 'Soul-First', '主动感知', '内测', '下一代'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Paperboy',
    url: '#',
    description: '主动整合邮件/日历/文档上下文，提前感知用户需求并主动推送，内测中',
    agent_type: 'proactive',
    open_source: 'closed',
    region: 'global',
    tags: ['邮件整合', '日历', '主动推送', '上下文感知', '内测'],
    is_featured: false,
    status: 'published'
  },

  // ── 新增：深度研究型 ────────────────────────────────────────────────────────
  {
    name: 'Genspark',
    url: 'https://www.genspark.ai',
    description:
      '专注深度调研的搜索型 Agent，自动整合多源信息生成 Sparkpage，比 Perplexity 更深入，支持多轮对话追问',
    agent_type: 'research',
    open_source: 'closed',
    region: 'global',
    tags: ['深度调研', 'Sparkpage', '信息整合', '多轮对话'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    description: 'AI 驱动的实时搜索引擎，每个回答附带可溯源的引用链接，Pro 版支持深度研究模式',
    agent_type: 'research',
    open_source: 'closed',
    region: 'global',
    tags: ['AI搜索', '引用来源', '实时检索', 'Pro研究模式'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'You.com Research',
    url: 'https://you.com',
    description: '带 AI 助手的搜索引擎，可在同一界面完成搜索+分析+写作，支持代码执行和文件上传',
    agent_type: 'research',
    open_source: 'closed',
    region: 'global',
    tags: ['AI搜索', '代码执行', '文件上传', '一体化'],
    is_featured: false,
    status: 'published'
  },
  // ── 新增：构建平台 ──────────────────────────────────────────────────────────
  {
    name: 'Coze（扣子）',
    url: 'https://www.coze.cn',
    description:
      '字节跳动低代码 Agent 构建平台，支持插件市场、工作流编排，可一键发布到飞书/微信/抖音',
    agent_type: 'builder',
    open_source: 'closed',
    region: 'cn',
    tags: ['字节跳动', '低代码', '插件市场', '多渠道发布'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Flowise',
    url: 'https://flowiseai.com',
    description:
      '开源低代码 LLM 应用构建工具，拖拽式界面搭建 Agent 工作流，支持自托管，对标 LangChain',
    agent_type: 'builder',
    open_source: 'open',
    region: 'global',
    tags: ['开源', '低代码', '拖拽式', '自托管'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Botpress',
    url: 'https://botpress.com',
    description: '企业级对话 Agent 平台，支持知识库接入、多渠道部署、A/B测试，已有数千企业客户',
    agent_type: 'builder',
    open_source: 'partial',
    region: 'global',
    tags: ['企业级', '知识库', '多渠道', '对话Bot'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Stack AI',
    url: 'https://www.stack-ai.com',
    description: '企业 AI 工作流构建平台，无代码搭建 RAG 应用和 Agent，内置数十种数据连接器',
    agent_type: 'builder',
    open_source: 'closed',
    region: 'global',
    tags: ['企业AI', 'RAG', '无代码', '数据连接器'],
    is_featured: false,
    status: 'published'
  },
  // ── 新增：计算机操控型 ──────────────────────────────────────────────────────
  {
    name: 'Browser Use',
    url: 'https://github.com/browser-use/browser-use',
    description:
      '开源浏览器自动化 Agent 库，让 AI 像人一样操控 Chrome，GitHub 10k+ Star，Python 生态友好',
    agent_type: 'computer',
    open_source: 'open',
    region: 'global',
    tags: ['浏览器自动化', '开源', 'Python', 'Chrome'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Playwright MCP',
    url: 'https://github.com/microsoft/playwright-mcp',
    description:
      'Microsoft 官方 Playwright MCP Server，让 Claude 等 AI 直接控制浏览器进行自动化测试和信息抓取',
    agent_type: 'computer',
    open_source: 'open',
    region: 'global',
    tags: ['Microsoft', 'Playwright', 'MCP', '浏览器控制'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Skyvern',
    url: 'https://github.com/Skyvern-AI/skyvern',
    description: '视觉驱动的浏览器自动化 Agent，无需写 CSS 选择器，AI 直接看屏幕理解页面结构',
    agent_type: 'computer',
    open_source: 'open',
    region: 'global',
    tags: ['视觉驱动', '浏览器自动化', '无代码', 'UI理解'],
    is_featured: false,
    status: 'published'
  },
  // ── 新增：垂直创意型 ────────────────────────────────────────────────────────
  {
    name: 'Jasper',
    url: 'https://www.jasper.ai',
    description: '面向企业的 AI 营销内容创作平台，支持品牌语调训练、多语言创作，月活百万级',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['营销文案', '品牌语调', '多语言', '企业级'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Gamma',
    url: 'https://gamma.app',
    description: 'AI 演示文稿生成器，输入主题即可生成专业 PPT/文档/网页，设计感强，一键分享',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['PPT生成', '演示文稿', 'AI设计', '一键分享'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Midjourney',
    url: 'https://midjourney.com',
    description: '最具艺术感的 AI 图像生成工具，Discord 驱动，用户超 1600 万，专业设计师首选',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['图像生成', 'Discord', '艺术风格', '专业设计'],
    is_featured: false,
    status: 'published'
  },

  // ── 小说生成 ────────────────────────────────────────────────────────────────
  {
    name: 'Sudowrite',
    url: 'https://sudowrite.com',
    description: '专为小说创作设计的 AI 写作助手，支持故事拓展、人物对白润色、章节续写，被纽约时报报道的专业写作工具',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['小说写作', '故事生成', '人物对白', '创意写作', '章节续写'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'NovelAI',
    url: 'https://novelai.net',
    description: 'AI 小说创作+图像生成一体化平台，支持多种写作风格模式，深受轻小说/奇幻小说作者喜爱，也可生成配套插图',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['小说生成', '轻小说', '图像生成', '风格模式', '日式奇幻'],
    is_featured: true,
    status: 'published'
  },
  {
    name: '彩云小梦',
    url: 'https://if.caiyunai.com',
    description: '中国领先的 AI 小说续写平台，理解中文语境和网文风格，支持仙侠、都市、言情等多种类型，月活用户超百万',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['中文小说', '网文续写', '仙侠', '言情', '都市'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Fictive AI',
    url: 'https://fictive.ai',
    description: '多 Agent 协作的互动小说创作平台，编辑 Agent、风格 Agent、情节 Agent 分工协作，生成连贯长篇故事',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['互动小说', '多Agent', '长篇故事', '情节设计', '角色扮演'],
    is_featured: false,
    status: 'published'
  },

  // ── 简历生成 ────────────────────────────────────────────────────────────────
  {
    name: 'Teal',
    url: 'https://tealhq.com',
    description: 'AI 求职全流程平台：简历一键生成 + ATS 优化 + 岗位匹配打分，帮助用户提升面试通过率，已服务超 100 万求职者',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['简历生成', 'ATS优化', '求职', '岗位匹配', '职场'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Kickresume',
    url: 'https://kickresume.com',
    description: 'AI 驱动的简历+求职信生成器，提供 20+ 专业模板，GPT-4 优化内容表达，支持导出 PDF/Word',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['简历模板', '求职信', 'GPT-4', 'PDF导出', '求职辅助'],
    is_featured: false,
    status: 'published'
  },
  {
    name: '超级简历',
    url: 'https://www.wondercv.com',
    description: '中国主流 AI 简历制作平台，一键 AI 优化措辞、智能填充工作经历、适配国内主流招聘平台格式',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['中文简历', 'AI优化', '招聘平台', '求职', '职场中国'],
    is_featured: true,
    status: 'published'
  },

  // ── 周报生成 ────────────────────────────────────────────────────────────────
  {
    name: 'Notion AI',
    url: 'https://notion.so/product/ai',
    description: 'Notion 内置 AI 写作助手，可基于工作记录自动汇总生成周报/月报，支持中文，与 Notion 数据库深度集成',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['周报生成', '工作汇总', 'Notion', '写作助手', '效率工具'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'WorkWeek',
    url: 'https://workweek.ai',
    description: '专为职场人设计的 AI 周报助手，连接日历/邮件/任务系统，自动提炼本周工作亮点，生成老板最爱看的汇报格式',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['周报自动生成', '工作汇报', '日历集成', '邮件分析', '职场效率'],
    is_featured: false,
    status: 'published'
  },
  {
    name: '飞书妙记',
    url: 'https://www.feishu.cn/product/minutes',
    description: '字节跳动飞书出品，AI 会议记录+总结工具，自动将会议内容提炼成结构化周报/会议纪要，国内企业广泛使用',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['会议纪要', '周报', '飞书', '字节跳动', '企业协作'],
    is_featured: true,
    status: 'published'
  },

  // ── 漫剧生成 ────────────────────────────────────────────────────────────────
  {
    name: 'Webtoon Originals AI',
    url: 'https://webtoons.com',
    description: 'Webtoon 官方 AI 辅助创作工具，帮助漫画作者快速生成背景、分镜和对话气泡，降低漫剧制作门槛',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['漫画生成', 'Webtoon', '分镜', '漫剧', '背景生成'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'ComicsMaker.ai',
    url: 'https://comicsmaker.ai',
    description: 'AI 漫画/漫剧一站式生成平台，文字描述即可生成多格漫画，支持角色一致性保持和对话框自动排版',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['漫画AI', '多格漫画', '角色一致性', '对话框', '漫剧生成'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Clip Studio Paint AI',
    url: 'https://clipstudio.net',
    description: '专业漫画创作软件内置 AI 功能，支持 AI 着色、背景生成、线稿修复，是全球漫画师最常用的创作工具之一',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['漫画软件', 'AI着色', '线稿', '背景生成', '专业漫画'],
    is_featured: false,
    status: 'published'
  },
  {
    name: '触站 AI 漫画',
    url: 'https://www.chuzhang.com',
    description: '国内领先的 AI 漫剧制作平台，支持国风/日漫/写实多种风格，内置分镜脚本生成和角色一致性控制',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['AI漫画', '国风漫画', '分镜脚本', '角色一致性', '中文漫剧'],
    is_featured: true,
    status: 'published'
  },

  // ── 短视频生成 ──────────────────────────────────────────────────────────────
  {
    name: 'Kling AI',
    url: 'https://klingai.com',
    description: '快手旗下 AI 视频生成平台，文字/图片转视频质量领先，支持 5s/10s 视频，在国际市场赢得大量用户',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['短视频生成', '快手', '文生视频', '图生视频', 'AI视频'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Runway Gen-3',
    url: 'https://runwayml.com',
    description: 'Hollywood 级 AI 视频生成工具，Gen-3 Alpha 版本画质大幅提升，已被多个商业广告和电影项目采用',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['AI视频', 'Gen-3', '商业广告', '电影制作', '短视频'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Pika Labs',
    url: 'https://pika.art',
    description: 'AI 短视频生成平台，以动态效果和物体变形见长，Discord 社区超 50 万创作者，适合创意短片制作',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['短视频', '动态效果', 'Discord', '创意短片', 'AI动画'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'HeyGen',
    url: 'https://heygen.com',
    description: 'AI 数字人短视频生成平台，上传照片即可生成会说话的数字人，支持 40+ 语言配音，企业营销视频首选',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['数字人', '短视频', '多语言配音', '企业营销', 'AI主播'],
    is_featured: true,
    status: 'published'
  },
  {
    name: '即梦 AI',
    url: 'https://jimeng.jianying.com',
    description: '字节跳动剪映旗下 AI 视频生成工具，深度集成抖音生态，支持文生视频/图生视频/口播视频，国内短视频创作者必备',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['短视频', '抖音', '剪映', '文生视频', '口播视频', '字节跳动'],
    is_featured: true,
    status: 'published'
  }
];

let _nextId = AGENT_DATA.length + 1;

export const fakeAgents = {
  records: [] as Agent[],

  initialize() {
    this.records = AGENT_DATA.map((a, i) => ({
      ...a,
      id: i + 1,
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 7 * 24 * 3600 * 1000).toISOString()
    }));
    _nextId = this.records.length + 1;
  },

  async getAgents({
    page = 1,
    limit = 12,
    search,
    agent_type,
    open_source,
    status,
    sort
  }: {
    page?: number;
    limit?: number;
    search?: string;
    agent_type?: string;
    open_source?: string;
    status?: string;
    sort?: string;
  }) {
    await delay(300);
    let items = [...this.records];

    if (agent_type && agent_type !== 'all') {
      items = items.filter((a) => a.agent_type === agent_type);
    }
    if (open_source && open_source !== 'all') {
      items = items.filter((a) => a.open_source === open_source);
    }
    if (status && status !== 'all') {
      items = items.filter((a) => a.status === status);
    }
    if (search) {
      items = matchSorter(items, search, {
        keys: ['name', 'description', 'tags', 'url']
      });
    }
    if (sort) {
      try {
        const sortItems = JSON.parse(sort) as { id: string; desc: boolean }[];
        if (sortItems.length > 0) {
          const { id, desc } = sortItems[0];
          items.sort((a, b) => {
            const aStr = String((a as Record<string, unknown>)[id] ?? '').toLowerCase();
            const bStr = String((b as Record<string, unknown>)[id] ?? '').toLowerCase();
            return desc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
          });
        }
      } catch {
        /* ignore */
      }
    }

    const total_items = items.length;
    return { items: items.slice((page - 1) * limit, page * limit), total_items };
  },

  async getFeaturedAgents(): Promise<Agent[]> {
    await delay(200);
    return this.records.filter((a) => a.is_featured && a.status === 'published');
  },

  async getAgentById(id: number): Promise<Agent | null> {
    await delay(200);
    return this.records.find((a) => a.id === id) ?? null;
  },

  async getStats() {
    await delay(150);
    const published = this.records.filter((a) => a.status === 'published');
    const total = published.length;
    const featured = published.filter((a) => a.is_featured).length;
    const pending = this.records.filter((a) => a.status === 'pending').length;
    const rejected = this.records.filter((a) => a.status === 'rejected').length;
    const openCount = published.filter((a) => a.open_source === 'open').length;
    const byType = published.reduce(
      (acc, a) => {
        acc[a.agent_type] = (acc[a.agent_type] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return { total, featured, pending, rejected, openCount, byType };
  },

  async createAgent(payload: CreateAgentPayload): Promise<Agent> {
    await delay(400);
    const now = new Date().toISOString();
    const agent: Agent = { ...payload, id: _nextId++, created_at: now, updated_at: now };
    this.records.push(agent);
    return agent;
  },

  async updateAgent(id: number, payload: UpdateAgentPayload): Promise<Agent | null> {
    await delay(300);
    const idx = this.records.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.records[idx] = { ...this.records[idx], ...payload, updated_at: new Date().toISOString() };
    return this.records[idx];
  },

  async deleteAgent(id: number): Promise<boolean> {
    await delay(200);
    const idx = this.records.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.records.splice(idx, 1);
    return true;
  },

  async reviewAgent(
    id: number,
    action: 'approve' | 'reject',
    note?: string
  ): Promise<Agent | null> {
    await delay(300);
    const idx = this.records.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.records[idx] = {
      ...this.records[idx],
      status: action === 'approve' ? 'published' : 'rejected',
      review_note: note ?? '',
      updated_at: new Date().toISOString()
    };
    return this.records[idx];
  }
};

fakeAgents.initialize();
