/**
 * 「待收录精选」内链清单 —— 直接挂在首页（全站权重最高、抓取最频繁的页）。
 *
 * 来源：GSC 覆盖率报告「已抓取-尚未编入索引」(2026-06-16)。这些页本身技术上完全正常
 * （线上 200 + index,follow + 自指 canonical + 已在 sitemap），但抓取深度过深——只在
 * 分页列表 / 关联模块里出现，Google 抓了却迟迟不收录。从首页直链把它们的抓取深度降到 1，
 * 是促成收录最有效的纯前端内链动作（同 hot.ts 思路，但目标是「收录」而非「冲前 3」）。
 *
 * 维护：拿到新 GSC「已抓取-尚未编入索引」报告后，把已确认收录的条目移除、把新卡住的优质页
 * 换进来即可。已 noindex / 会重定向 / www / 静态资源的条目不要放进来。
 */
export type IndexBoostLink = { href: string; label: string };

export const INDEX_BOOST_LINKS: IndexBoostLink[] = [
  // 深度实战教程
  {
    href: '/tutorials/enterprise-rag-system-building-gtnf50',
    label: '企业级 RAG 2.0 系统构建：从文档解析到知识检索'
  },
  {
    href: '/tutorials/large-model-post-training-from-sft-to-rl-hd6yje',
    label: '大模型后训练实战：从 SFT 到 RL 的完整技术栈'
  },
  {
    href: '/tutorials/agent-harness-engineering-guide-j51hf0',
    label: '从 Demo 到产线：Agent Harness 工程化实战指南'
  },
  {
    href: '/tutorials/how-to-build-a-pdf-question-answering-system-complete-guide-for-develo-bts5v2',
    label: '如何构建 PDF 问答系统：开发者完整指南'
  },
  {
    href: '/tutorials/build-an-ai-legal-document-with-claude-pdf-processing-step-by-step-tut-n6fmuo',
    label: '用 Claude + PDF 处理构建 AI 法律文档系统'
  },
  {
    href: '/tutorials/build-an-ai-translation-with-deepl-gpt-4-step-by-step-tutorial-2026-z2j6ic',
    label: '用 DeepL + GPT-4 构建 AI 翻译系统：逐步教程'
  },
  {
    href: '/tutorials/perplexity-ai-complete-tutorial-2026-how-to-get-cited-accurate-answers-1oe4g',
    label: 'Perplexity AI 完整教程：获取带引用的准确答案'
  },
  {
    href: '/tutorials/openclaw-personal-assistant',
    label: '用 OpenClaw 5 分钟搭建你的私人 AI 助手'
  },
  {
    href: '/tutorials/ai-game-development-unity-unreal-2025',
    label: 'AI 游戏开发：Unity 与 Unreal 中的 AI 工具'
  },
  {
    href: '/tutorials/ai-live-streaming-production-guide',
    label: 'AI 驱动的直播：单人创作者的职业级制作'
  },
  {
    href: '/tutorials/ai-in-education-personalized-learning-2025',
    label: 'AI 在教育中的应用：个性化学习与教学变革'
  },
  {
    href: '/tutorials/ai-crop-disease-detection-ai-in-agriculture-iiqulb',
    label: 'AI 作物病害检测：农业中的 AI 应用'
  },
  // 主题枢纽 / 目录页
  {
    href: '/tutorials/topic/prompt-engineering',
    label: 'Prompt 工程教程合集'
  },
  {
    href: '/models/series/mistral',
    label: 'Mistral 全系列对比：参数、价格与能力'
  },
  {
    href: '/mcp/jae-jae-g-search-mcp',
    label: 'g-search-mcp：Google 搜索 MCP Server 安装与使用'
  },
  // 行业资讯
  {
    href: '/news/ai-drug-discovery-breakthrough-isomorphic-2025',
    label: 'AI 药物发现进入临床：Isomorphic 基于 AlphaFold 的管线'
  },
  {
    href: '/news/multimodal-ai-tools-explained-use-cases-2025',
    label: '多模态 AI 工具详解：落地场景与价值'
  },
  // ── 2026-07-22 GSC(0715-0722) 批次：高曝光深排名/新发布关键词页 ──
  {
    href: '/tutorials/groq-api-developer-guide-and-quick-start-2026-pv6asd',
    label: 'Groq API 开发者指南与快速入门'
  },
  {
    href: '/tutorials/voice-activity-detection-python-guide-2026',
    label: 'Voice Activity Detection (VAD) Python 实战'
  },
  {
    href: '/tutorials/enterprise-generative-ai-adoption-playbook-2026',
    label: '企业级生成式 AI 落地手册：从试点到规模化'
  },
  {
    href: '/tutorials/ai-clinical-documentation-ambient-scribes-2026',
    label: 'AI 临床文书自动化：Ambient Scribe 指南'
  },
  {
    href: '/tutorials/ai-credit-risk-management-guide-2026',
    label: 'AI 信用风险管理实战：智能评分与核保'
  },
  {
    href: '/tutorials/ai-data-loss-prevention-dlp-guide-2026',
    label: 'AI 数据防泄漏（DLP）实战指南'
  },
  {
    href: '/tutorials/llm-api-cost-optimization-guide-2026',
    label: 'LLM API 成本控制实战：12 个降本方法'
  },
  {
    href: '/tutorials/llm-fallback-strategy-production-2026',
    label: 'LLM Fallback 降级策略：生产级容错指南'
  },
  {
    href: '/tutorials/ai-cloud-cost-optimization-strategies',
    label: 'AI 驱动的云成本优化：削减 40% 云账单'
  },
  {
    href: '/mcp/firecrawl-mcp',
    label: 'Firecrawl MCP Server：网页抓取接入 Claude/Cursor'
  },
  {
    href: '/mcp/rchanllc-joltsms-mcp-server',
    label: 'JoltSMS MCP Server：Agent 自动接收短信验证码'
  },
  {
    href: '/mcp/mobile-next-mobile-mcp',
    label: 'Mobile MCP：自然语言驱动移动端 UI 自动化'
  },
  {
    href: '/news/fields-medal-leak-2026-wang-deng-n9masd',
    label: '菲尔兹奖名单提前泄露：两位中国数学家或同届获奖'
  },
  {
    href: '/news/ai-automation-jobs-future-of-work-2025',
    label: '世界经济论坛《未来就业报告2025》解读'
  }
];
