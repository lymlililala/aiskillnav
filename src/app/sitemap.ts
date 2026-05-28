import type { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase';

const BASE_URL = 'https://aiskillnav.com';

/**
 * 动态生成 sitemap.xml — 静态页面 + 从 Supabase 读取全量文章
 * 访问地址: /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 辅助函数：把日期字符串转 Date（容错）
  function d(dateStr: string): Date {
    try {
      return new Date(dateStr);
    } catch {
      return now;
    }
  }

  // 静态页面 — 高优先级（列表/入口页随时更新，用 now）
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${BASE_URL}/skills`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/agents`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/mcp`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/models`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/tutorials`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/usecases`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    },
    // 教程详情页 — 使用真实发布时间（让 Google 知道这是稳定内容）
    {
      url: `${BASE_URL}/tutorials/deepseek-r1-local-deployment`,
      lastModified: d('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/manus-vs-autogpt-vs-openclaw`,
      lastModified: d('2026-03-10'),
      changeFrequency: 'monthly',
      priority: 0.88
    },
    {
      url: `${BASE_URL}/tutorials/ai-agent-complete-guide-2026`,
      lastModified: d('2026-01-10'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/mcp-server-vs-function-calling`,
      lastModified: d('2026-02-01'),
      changeFrequency: 'monthly',
      priority: 0.88
    },
    {
      url: `${BASE_URL}/tutorials/what-is-mcp`,
      lastModified: d('2026-01-20'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/openclaw-personal-assistant`,
      lastModified: d('2026-02-15'),
      changeFrequency: 'monthly',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/tutorials/cursor-claude-opus-agent-setup-2026`,
      lastModified: d('2026-04-20'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/agent-reasoning-vs-streaming-tradeoff`,
      lastModified: d('2026-04-25'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // News 详情页 — 热点资讯，高价值
    {
      url: `${BASE_URL}/news/anthropic-claude-opus-4-1-2026-reasoning`,
      lastModified: d('2026-04-28'),
      changeFrequency: 'monthly',
      priority: 0.88
    },
    {
      url: `${BASE_URL}/news/best-mcp-servers-2026-100-ranked-categorized`,
      lastModified: d('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/top-10-new-mcp-servers-may-2026-releases`,
      lastModified: d('2026-05-05'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/best-mcp-servers-2026-ranked-comprehensive-guide`,
      lastModified: d('2026-05-02'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/tutorials/how-to-install-mcp-server-claude-code-complete-guide`,
      lastModified: d('2026-05-03'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/claude-code-vs-cursor-2026-complete-comparison`,
      lastModified: d('2026-05-04'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    // News 详情页 — 2026-05-12
    {
      url: `${BASE_URL}/news/2025-best-ai-tools-new-releases-roundup`,
      lastModified: d('2026-05-06'),
      changeFrequency: 'monthly',
      priority: 0.88
    },
    {
      url: `${BASE_URL}/news/openai-vs-anthropic-vs-google-2025-ai-battle`,
      lastModified: d('2026-05-07'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-agent-era-autonomous-ai-workflow-revolution-2025`,
      lastModified: d('2026-05-08'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/weekly-ai-tools-roundup-may-2026`,
      lastModified: d('2026-05-09'),
      changeFrequency: 'monthly',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/news/multimodal-ai-tools-explained-use-cases-2025`,
      lastModified: d('2026-05-10'),
      changeFrequency: 'monthly',
      priority: 0.88
    },
    // Tutorials 详情页 — 2026-05-13
    {
      url: `${BASE_URL}/tutorials/dify-vs-coze-vs-fastgpt-2026-comparison`,
      lastModified: d('2026-05-11'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-agent-prompt-engineering-guide-2026`,
      lastModified: d('2026-05-12'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/github-copilot-vs-cursor-vs-claude-code-2026`,
      lastModified: d('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News 详情页 — 2026-05-13
    {
      url: `${BASE_URL}/news/claude-4-opus-sonnet-2026-release-analysis`,
      lastModified: d('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/mcp-ecosystem-2026-100-servers-milestone`,
      lastModified: d('2026-05-12'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/cursor-200-million-users-ai-ide-market-2026`,
      lastModified: d('2026-05-11'),
      changeFrequency: 'monthly',
      priority: 0.87
    },
    // Tutorials 详情页 — 2026-05-14
    {
      url: `${BASE_URL}/tutorials/gemini-2-complete-guide-2026`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/perplexity-ai-complete-guide-tips-2026`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/china-ai-models-comparison-2026-kimi-doubao-qwen-deepseek`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/vector-database-comparison-pinecone-weaviate-chroma-2026`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // News 详情页 — 2026-05-14
    {
      url: `${BASE_URL}/news/gpt-5-release-date-features-2026-analysis`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/ai-agent-funding-landscape-2026-q2`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/openai-o3-o4-mini-benchmark-analysis-2026`,
      lastModified: d('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Tutorials 详情页 — 2026-05-15 SEO/GEO 优化
    {
      url: `${BASE_URL}/tutorials/n8n-mcp-server-integration-guide-2026`,
      lastModified: d('2026-05-15'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/dify-enterprise-knowledge-base`,
      lastModified: d('2026-05-15'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/rag-knowledge-base-best-practices`,
      lastModified: d('2026-05-15'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // News 详情页 — 2026-05-15 SEO/GEO 优化
    {
      url: `${BASE_URL}/news/mcp-ecosystem-architecture-evolution-2026`,
      lastModified: d('2026-05-15'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-agent-framework-comparison-langgraph-crewai-autogen-2026`,
      lastModified: d('2026-05-15'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials 详情页 — 2026-05-18 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/tutorials/claude-code-complete-tutorial-2026`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/windsurf-vs-cursor-vs-claude-code-2026`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-agent-workflow-automation-2026`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/openai-o3-practical-guide-2026`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/autogen-multi-agent-tutorial-2026`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // News 详情页 — 2026-05-18 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/news/ai-agent-security-risks-2026`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/best-ai-coding-tools-2026-comprehensive`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    // Tutorials — 2026-05-19 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/tutorials/gemini-2-5-pro-complete-guide-2026`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/llamaindex-practical-guide-2026`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/llm-api-cost-optimization-guide-2026`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/cursor-rules-best-practices-2026`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-agent-2026-mid-year-trends`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News — 2026-05-19 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/news/gpt-5-release-what-we-know-2026`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/news/anthropic-claude-4-opus-2026-analysis`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/ai-no-code-tools-2026-roundup`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials — 2026-05-20 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/tutorials/perplexity-ai-complete-guide-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/github-copilot-advanced-tips-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-agent-system-prompt-engineering-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/vercel-ai-sdk-nextjs-tutorial-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-writing-humanize-techniques-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // News — 2026-05-20 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/news/openai-o3-mini-release-price-performance-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/news/google-notebooklm-plus-enterprise-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-engineer-job-market-skills-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    // Tutorials — 2026-05-20 热门需求分类文章
    {
      url: `${BASE_URL}/tutorials/ai-novel-writing-complete-guide-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-resume-builder-guide-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-weekly-report-automation-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-comic-manga-creation-guide-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-short-video-production-pipeline-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    // News — 2026-05-20 热门需求分类文章
    {
      url: `${BASE_URL}/news/ai-creative-content-tools-roundup-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-video-generation-kling-runway-pika-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/mcp-creative-tools-novel-resume-video-2026`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials + News — 2026-05-21 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/tutorials/langgraph-vs-langchain-agent-framework-guide`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/gmail-ai-automation-n8n-complete-guide`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/openai-assistants-api-complete-guide-2026`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/mcp-server-security-best-practices-2026`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/ai-content-marketing-sop-2026`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-agent-market-2026-mid-year-review`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/best-ai-developer-tools-may-2026`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/llm-hallucination-mitigation-techniques-2026`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials + News — 2026-05-24 SEO/GEO 优化批次
    {
      url: `${BASE_URL}/tutorials/chatgpt-plus-vs-claude-pro-worth-it-2026`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/best-free-ai-tools-complete-guide-2026`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/tutorials/dify-build-knowledge-base-complete-tutorial-2026`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-search-revolution-perplexity-vs-google-sge-2026`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/cursor-free-vs-paid-is-it-worth-upgrading-2026`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/china-ai-market-h1-2026-report`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News — 2026-05-25 新发布批次
    {
      url: `${BASE_URL}/news/gemini-2-5-flash-release-analysis-2026`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/anthropic-claude-4-5-sonnet-release-2026`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/cursor-raises-series-c-500m-2026`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/openai-gpt5-enterprise-pricing-2026`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/mcp-protocol-adoption-stats-2026`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News — 2026-05-26 新发布批次
    {
      url: `${BASE_URL}/news/windsurf-ai-agent-mode-vs-cursor-agent-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/claude-code-max-plan-pricing-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/ai-video-generation-sora-vs-kling-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/china-ai-regulation-2026-new-rules`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/notion-ai-vs-obsidian-ai-knowledge-management-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-26 B1批次 LangChain/SEO/Python入门
    {
      url: `${BASE_URL}/tutorials/langchain-vs-langgraph-practical-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-seo-content-marketing-complete-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/python-ai-beginner-complete-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // Tutorials — 2026-05-26 B2批次 n8n高级/AI客服/AI教育
    {
      url: `${BASE_URL}/tutorials/n8n-advanced-workflow-automation-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-customer-service-bot-complete-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-tools-for-education-learning-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // News — 2026-05-26 B3批次 最新热点
    {
      url: `${BASE_URL}/news/claude-code-sdk-agentic-ai-developer-tools-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/openai-gpt5-mini-performance-benchmark-analysis-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/google-gemini-2-5-pro-coding-benchmark-tops-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/microsoft-copilot-studio-agent-marketplace-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/china-ai-startups-funding-wave-may-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-26 B5批次 RAG高级/Claude Sonnet/AI视频
    {
      url: `${BASE_URL}/tutorials/advanced-rag-techniques-production-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/tutorials/claude-sonnet-4-5-complete-guide-tips-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/ai-video-creation-complete-workflow-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News — 2026-05-26 B6批次 更多热点
    {
      url: `${BASE_URL}/news/perplexity-ai-pro-search-deep-research-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/apple-wwdc-2026-ai-features-preview`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/news/deepseek-v4-release-benchmark-china-ai-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/ai-code-generator-github-copilot-workspace-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-agent-regulation-eu-act-compliance-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-26 B7批次 本地LLM/Prompt安全/AI财务
    {
      url: `${BASE_URL}/tutorials/local-llm-deployment-guide-ollama-lmstudio-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/prompt-injection-security-defense-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/ai-financial-analysis-automation-guide-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // News — 2026-05-26 B8批次 更多热点
    {
      url: `${BASE_URL}/news/google-io-2026-ai-highlights-gemini-agent`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.96
    },
    {
      url: `${BASE_URL}/news/midjourney-v8-photorealism-video-update-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/nvidia-blackwell-ai-pc-consumer-gpu-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/openai-voice-mode-update-gpt5-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/salesforce-agentforce-enterprise-ai-deployment-2026`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-27 C1批次 工具对比类
    {
      url: `${BASE_URL}/tutorials/notion-ai-vs-obsidian-ai-knowledge-management-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/zapier-vs-make-vs-n8n-comparison-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/replit-vs-bolt-vs-lovable-vibe-coding-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // Tutorials — 2026-05-27 C2批次 AI平台高级用法
    {
      url: `${BASE_URL}/tutorials/chatgpt-advanced-features-complete-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/tutorials/claude-projects-advanced-workflow-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/gemini-deep-research-notebooklm-power-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // Tutorials — 2026-05-27 C3批次 微调/MVP/结构化输出
    {
      url: `${BASE_URL}/tutorials/llm-fine-tuning-practical-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-product-development-mvp-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/tutorials/openai-function-calling-structured-output-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News — 2026-05-27 C4批次 AI前沿动态
    {
      url: `${BASE_URL}/news/meta-llama-4-release-multimodal-open-source-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.96
    },
    {
      url: `${BASE_URL}/news/mistral-le-chat-pro-enterprise-launch-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-hallucination-detection-tools-comparison-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/ai-coding-agent-benchmark-swebench-2026-results`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-ethics-bias-detection-enterprise-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // News — 2026-05-27 C5批次 AI创意/办公/职场
    {
      url: `${BASE_URL}/news/suno-ai-music-udio-comparison-best-practices-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/canva-ai-magic-studio-design-2026-update`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/microsoft-365-copilot-wave-3-features-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-translation-deepl-google-chatgpt-comparison-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/ai-coding-junior-vs-senior-developer-impact-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials — 2026-05-27 D1批次 AI旅行/求职/投资
    {
      url: `${BASE_URL}/tutorials/ai-travel-planning-complete-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-job-hunting-resume-interview-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-investment-research-portfolio-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials — 2026-05-27 D2批次 AI电商/HR/社媒
    {
      url: `${BASE_URL}/tutorials/ai-ecommerce-operations-complete-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-hr-recruitment-automation-guide-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-social-media-content-strategy-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // News — 2026-05-27 D3批次 AI趋势/就业/中国大模型/AI监管
    {
      url: `${BASE_URL}/news/openai-gpt5-release-impact-analysis-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/ai-replaces-jobs-real-data-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/china-deepseek-v3-qwen3-competition-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-agent-autonomous-work-trend-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-regulation-eu-china-us-comparison-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // News — 2026-05-27 D4批次 RAG/AI安全/AI创业/AI医疗/AI教育
    {
      url: `${BASE_URL}/news/rag-advanced-techniques-enterprise-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-security-threats-jailbreak-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-startup-funding-landscape-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/ai-medical-diagnosis-clinical-trial-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-education-personalized-learning-2026`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-28 E1批次 Cursor进阶/AI法律/AI视频
    {
      url: `${BASE_URL}/tutorials/cursor-ai-advanced-development-workflow-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-legal-assistant-contract-review-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials — 2026-05-28 E2批次 AI学术写作/小红书/本地AI
    {
      url: `${BASE_URL}/tutorials/ai-academic-writing-research-paper-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/xiaohongshu-ai-operation-growth-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/local-ai-privacy-first-complete-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // News — 2026-05-28 E3批次 Claude4/Gemini2/NVIDIA/AI法律科技/OpenAI安全
    {
      url: `${BASE_URL}/news/anthropic-claude-4-opus-release-analysis-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/news/google-gemini-2-ultra-multimodal-breakthrough-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.94
    },
    {
      url: `${BASE_URL}/news/nvidia-blackwell-ultra-ai-chip-2026-analysis`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-legal-tech-contract-automation-growth-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/openai-safety-board-policy-update-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // 通用页面
    {
      url: `${BASE_URL}/about`,
      lastModified: d('2026-01-01'),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: d('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: d('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    // Tutorials — 2026-05-28 F1批次 AI数据分析/房产中介/老年人AI
    {
      url: `${BASE_URL}/tutorials/ai-data-analysis-excel-python-workflow-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/tutorials/ai-real-estate-agent-workflow-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-tools-for-seniors-elderly-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Tutorials — 2026-05-28 F2批次 AI翻译/节能/农业
    {
      url: `${BASE_URL}/tutorials/ai-translation-professional-workflow-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-energy-optimization-smart-home-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-agriculture-smart-farming-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // News — 2026-05-28 F3批次 Mistral/AI体育/AI化学/AI峰会/中国AI
    {
      url: `${BASE_URL}/news/mistral-le-chat-free-tier-unlimited-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-sports-performance-analysis-nba-soccer-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-chemistry-drug-discovery-2026-breakthrough`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/ai-world-summit-paris-2026-key-decisions`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/china-ai-application-manufacturing-industry-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    // Tutorials — 2026-05-28 G2批次 AI音乐/播客/绘画变现
    {
      url: `${BASE_URL}/tutorials/ai-music-creation-suno-udio-complete-guide-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-podcast-production-script-editing-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-illustration-midjourney-monetize-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // News — 2026-05-28 G3批次 Grok3/AI搜索/AI眼镜/AI手机/AI政务
    {
      url: `${BASE_URL}/news/xai-grok3-vs-chatgpt-gemini-comparison-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-search-engine-market-perplexity-you-searchgpt-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-smart-glasses-meta-ray-ban-google-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-smartphone-features-2026-snapdragon-apple-silicon`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-government-services-china-us-eu-2026`,
      lastModified: d('2026-05-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Tutorials — 2026-05-29 H1批次 AI心理健康/亲子教育/职场晋升
    {
      url: `${BASE_URL}/tutorials/ai-mental-health-support-tools-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-parenting-education-children-guide-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-career-advancement-promotion-strategy-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials — 2026-05-29 H2批次 AI编曲混音/游戏开发/3D建模
    {
      url: `${BASE_URL}/tutorials/ai-music-arrangement-mixing-daw-guide-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-game-development-unity-unreal-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-3d-modeling-blender-meshy-luma-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // News — 2026-05-29 H3批次 AI搜索市场/AI能源/EU AI Act/AI伦理/AI版权
    {
      url: `${BASE_URL}/news/perplexity-ai-search-market-share-100m-users-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-energy-data-center-power-consumption-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/eu-ai-act-enforcement-2026-companies-impact`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.93
    },
    {
      url: `${BASE_URL}/news/ai-ethics-bias-fairness-2026-report`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-copyright-lawsuit-nyt-openai-resolution-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Tutorials — 2026-05-29 I1批次 AI网络安全/量化交易/供应链
    {
      url: `${BASE_URL}/tutorials/ai-cybersecurity-threat-detection-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-quantitative-trading-strategy-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-supply-chain-optimization-demand-forecast-2026`,
      lastModified: d('2026-05-29'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    // Tutorials — 2026-05-27 J1批次 AI医疗
    {
      url: `${BASE_URL}/tutorials/ai-medical-imaging-diagnosis-guide`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-ehr-clinical-documentation-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-drug-discovery-accelerating-pharma-research`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-remote-patient-monitoring-chronic-disease`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-mental-health-apps-clinical-guide`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-27 J2批次 AI教育
    {
      url: `${BASE_URL}/tutorials/ai-personalized-learning-k12-guide`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-higher-education-research-tools-faculty`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-tutoring-systems-student-success`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-academic-integrity-plagiarism-detection`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-classroom-tools-teacher-productivity`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-27 J3批次 AI金融
    {
      url: `${BASE_URL}/tutorials/ai-algorithmic-trading-beginners-guide`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-fraud-detection-financial-services`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-personal-finance-tools-wealth-management`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-credit-risk-assessment-lending`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-financial-forecasting-business-planning`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-27 J4批次 AI零售
    {
      url: `${BASE_URL}/tutorials/ai-retail-personalization-product-recommendations`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-inventory-management-demand-forecasting-retail`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-customer-segmentation-retail-marketing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-visual-search-retail-commerce`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-dynamic-pricing-strategy-retail`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-27 J5批次 AI制造
    {
      url: `${BASE_URL}/tutorials/ai-predictive-maintenance-manufacturing-guide`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/ai-quality-control-computer-vision-manufacturing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-supply-chain-optimization-manufacturing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-generative-design-product-development`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-process-optimization-chemical-manufacturing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // Tutorials — 2026-05-27 K系列 视频创作/播客/设计/写作/摄影
    {
      url: `${BASE_URL}/tutorials/ai-youtube-content-strategy-growth`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-video-editing-automation-premiere-davinci`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-thumbnail-generation-click-through-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-script-writing-video-production`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-shorts-reels-tiktok-content-factory`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-podcast-production-workflow-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-podcast-show-notes-transcription-seo`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-podcast-guest-research-interview-prep`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-podcast-monetization-audience-growth`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-podcast-editing-noise-removal-enhancement`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-graphic-design-workflow-figma-canva`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-brand-identity-design-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-ui-ux-design-prototyping-tools`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-illustration-art-generation-midjourney`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-marketing-materials-design-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-writing-assistant-long-form-content`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-seo-content-writing-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-technical-writing-documentation-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-copywriting-conversion-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-content-repurposing-multi-channel`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-photo-editing-lightroom-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-product-photography-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-portrait-retouching-batch-processing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-real-estate-photography-enhancement`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-image-generation-stable-diffusion-workflow`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Tutorials — 2026-05-27 L系列 网络安全/DevOps/数据科学/云计算/区块链
    {
      url: `${BASE_URL}/tutorials/ai-cybersecurity-threat-detection-soc`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-penetration-testing-vulnerability-scanning`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-malware-analysis-reverse-engineering`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-phishing-detection-email-security`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-incident-response-automation-siem`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-devops-cicd-pipeline-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-infrastructure-as-code-terraform-ansible`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-kubernetes-cluster-management-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-log-analysis-observability-monitoring`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-code-review-quality-assurance-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-data-science-workflow-automation-python`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-feature-engineering-ml-pipeline`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-model-monitoring-mlops-drift-detection`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-data-visualization-storytelling`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-nlp-text-analytics-business-insights`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-cloud-cost-optimization-aws-azure`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-multi-cloud-architecture-design`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-serverless-architecture-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-database-query-optimization-performance`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-cloud-migration-strategy-planning`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-blockchain-smart-contract-auditing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-defi-trading-strategy-development`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-nft-market-analysis-valuation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-web3-user-onboarding-ux`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-blockchain-data-analytics-insights`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Tutorials — 2026-05-27 M系列 法律/HR/客服/销售/物流
    {
      url: `${BASE_URL}/tutorials/ai-contract-review-automation-lawyers`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-legal-research-westlaw-lexisnexis-alternatives`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-compliance-monitoring-financial-regulations`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-litigation-prediction-case-outcome-modeling`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-legal-document-drafting-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-resume-screening-recruitment-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-employee-performance-analytics`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-onboarding-training-personalization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-compensation-benchmarking-salary-analysis`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-workplace-wellbeing-sentiment-analysis`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-customer-service-chatbot-implementation-guide`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-support-ticket-routing-classification`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-customer-sentiment-analysis-cx-improvement`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-personalization-customer-journey`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-voice-assistants-ivr-customer-service`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-sales-forecasting-crm-integration`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-lead-scoring-qualification-automation`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-sales-call-analysis-coaching`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-outbound-sales-personalization-at-scale`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-sales-enablement-content-management`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-supply-chain-demand-forecasting`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-route-optimization-last-mile-delivery`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-warehouse-automation-picking-optimization`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-supplier-risk-management-procurement`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-predictive-maintenance-manufacturing`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // News — 2026-05-27 N系列 AI行业新闻
    {
      url: `${BASE_URL}/news/openai-gpt5-capabilities-analysis-2025`,
      lastModified: d('2025-05-20'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/anthropic-claude-enterprise-adoption-2025`,
      lastModified: d('2025-05-19'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/google-gemini-ultra-video-understanding-2025`,
      lastModified: d('2025-05-18'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/eu-ai-act-august-2025-deadline-enterprises`,
      lastModified: d('2025-05-17'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/open-source-llm-cost-revolution-2025`,
      lastModified: d('2025-05-16'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/microsoft-copilot-enterprise-expansion-2025`,
      lastModified: d('2025-05-15'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-agents-autonomous-work-enterprise-2025`,
      lastModified: d('2025-05-14'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/nvidia-h200-inference-cost-reduction-2025`,
      lastModified: d('2025-05-13'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-coding-assistants-github-copilot-market-2025`,
      lastModified: d('2025-05-12'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-video-generation-sora-competitors-2025`,
      lastModified: d('2025-05-11'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-startup-funding-q2-2025-analysis`,
      lastModified: d('2025-05-10'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/apple-intelligence-on-device-ai-strategy-2025`,
      lastModified: d('2025-05-09'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/china-ai-models-deepseek-qwen-global-competition`,
      lastModified: d('2025-05-08'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/sam-altman-world-ai-governance-vision-2025`,
      lastModified: d('2025-05-07'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/enterprise-ai-roi-survey-mckinsey-2025`,
      lastModified: d('2025-05-06'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-drug-discovery-breakthrough-isomorphic-2025`,
      lastModified: d('2025-05-05'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/ai-robotics-figure-openai-humanoid-2025`,
      lastModified: d('2025-05-04'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-science-accelerator-2025-weather-materials`,
      lastModified: d('2025-05-03'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-chips-competition-intel-amd-2025`,
      lastModified: d('2025-05-02'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-safety-interpretability-breakthrough-2025`,
      lastModified: d('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/notion-ai-canvas-workflow-automation-2025`,
      lastModified: d('2025-04-30'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/perplexity-ai-shopping-commerce-2025`,
      lastModified: d('2025-04-29'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-music-generation-suno-udio-comparison-2025`,
      lastModified: d('2025-04-28'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-search-google-overview-market-share-2025`,
      lastModified: d('2025-04-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-model-context-protocol-mcp-adoption-2025`,
      lastModified: d('2025-04-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // O系列 - AI设计/视频/写作/数据分析 (tutorials)
    {
      url: `${BASE_URL}/tutorials/ai-ui-ux-design-figma-workflow-2025`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/midjourney-v7-brand-design-workflow`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/canva-ai-magic-studio-social-media-content`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/stable-diffusion-comfyui-product-photography`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/adobe-firefly-generative-fill-photoshop-pro-tips`,
      lastModified: d('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/runway-ml-gen3-video-production-workflow`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/capcut-ai-features-youtube-tiktok-creators`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/heygen-ai-avatar-video-localization-enterprise`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/sora-openai-video-generation-creative-use-cases`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/descript-ai-podcast-video-editing-workflow`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/claude-long-context-document-analysis-workflow`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/jasper-ai-enterprise-content-marketing-scale`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/chatgpt-custom-gpts-business-productivity-guide`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/notion-ai-knowledge-management-team-workflow`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/perplexity-ai-research-workflow-professionals`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/chatgpt-advanced-data-analysis-excel-python`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/power-bi-copilot-ai-dashboards-business-users`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/tableau-ai-pulse-einstein-analytics-2025`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/google-looker-studio-gemini-ai-reporting`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-predictive-analytics-customer-churn-saas`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // O系列 - AI政策新闻
    {
      url: `${BASE_URL}/news/us-ai-executive-order-2025-implementation-status`,
      lastModified: d('2025-04-25'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/china-ai-governance-2025-regulations-update`,
      lastModified: d('2025-04-24'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-watermarking-c2pa-standard-adoption-2025`,
      lastModified: d('2025-04-23'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-copyright-training-data-court-rulings-2025`,
      lastModified: d('2025-04-22'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/oecd-ai-principles-2025-update-global-alignment`,
      lastModified: d('2025-04-21'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    // P系列 - AI工程/自动化/教育/金融
    {
      url: `${BASE_URL}/tutorials/github-copilot-enterprise-workflow-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/cursor-ai-ide-advanced-workflow-guide`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/langchain-production-rag-system-guide`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/llm-fine-tuning-guide-openai-lora-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-code-review-security-scanning-devsecops`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/n8n-ai-workflow-automation-self-hosted`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/make-zapier-ai-automation-comparison-2025`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/openai-assistants-api-production-guide`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-testing-evaluation-llm-applications`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/vector-database-comparison-2025-pinecone-weaviate`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/khanmigo-ai-tutoring-student-parent-guide`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-language-learning-2025-comparison`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-study-techniques-university-students-2025`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/corporate-ai-training-program-design`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/notebooklm-academic-research-guide`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-personal-finance-tools-2025-budgeting`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-financial-modeling-excel-python-cfo`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-fraud-detection-banking-fintech-2025`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-tax-preparation-software-comparison-2025`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-algorithmic-trading-retail-investors-guide`,
      lastModified: d('2026-05-20'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    // P系列 - AI产品新闻
    {
      url: `${BASE_URL}/news/openai-o3-reasoning-model-benchmark-2025`,
      lastModified: d('2025-04-20'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/google-veo-3-video-generation-commercial-launch`,
      lastModified: d('2025-04-19'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/anthropic-claude-4-enterprise-features-2025`,
      lastModified: d('2025-04-18'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/ai-agents-enterprise-adoption-survey-2025`,
      lastModified: d('2025-04-17'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-hardware-race-2025-nvidia-competitors`,
      lastModified: d('2025-04-16'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    // Q系列 - AI医疗/农业/游戏/法律/政府
    {
      url: `${BASE_URL}/tutorials/ai-medical-imaging-radiology-clinical-workflow`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-mental-health-apps-therapy-support-2025`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-drug-discovery-pharma-workflow-2025`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-electronic-health-records-clinical-notes`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-personalized-nutrition-fitness-2025`,
      lastModified: d('2026-05-19'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-precision-agriculture-crop-monitoring-2025`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-food-safety-quality-control-manufacturing`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-climate-change-environmental-monitoring`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-real-estate-valuation-property-analysis`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-supply-chain-optimization-2025`,
      lastModified: d('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-game-development-unity-unreal-2025`,
      lastModified: d('2026-05-17'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-music-production-daw-tools-2025`,
      lastModified: d('2026-05-17'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-sports-analytics-performance-coaching`,
      lastModified: d('2026-05-17'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-fashion-retail-personalization-2025`,
      lastModified: d('2026-05-17'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-news-q3-industry-updates-2025`,
      lastModified: d('2025-04-15'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-legal-research-westlaw-lexisnexis-2025`,
      lastModified: d('2026-05-16'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-government-public-services-2025`,
      lastModified: d('2026-05-16'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/prompt-engineering-advanced-techniques-2025`,
      lastModified: d('2026-05-16'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-accessibility-assistive-technology-2025`,
      lastModified: d('2026-05-16'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-cybersecurity-threat-hunting-2025`,
      lastModified: d('2026-05-16'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Q系列 - 模型新闻
    {
      url: `${BASE_URL}/news/meta-llama-4-scout-maverick-release-2025`,
      lastModified: d('2025-04-14'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/mistral-codestral-2-coding-benchmark-2025`,
      lastModified: d('2025-04-13'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ai-automation-jobs-future-of-work-2025`,
      lastModified: d('2025-04-12'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/ai-energy-consumption-data-centers-2025`,
      lastModified: d('2025-04-11'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/chinese-ai-global-competition-deepseek-baidu-2025`,
      lastModified: d('2025-04-10'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // R系列 - AI安全/隐私/云安全/DevSecOps
    {
      url: `${BASE_URL}/tutorials/ai-security-threat-detection-enterprise-2025`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-privacy-data-protection-gdpr-2025`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/zero-trust-architecture-ai-guide-2025`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-vulnerability-management-patching-2025`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-identity-access-management-2025`,
      lastModified: d('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/cloud-security-aws-azure-gcp-2025`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/kubernetes-security-hardening-guide-2025`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/devsecops-ci-cd-security-pipeline-2025`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-soc-automation-soar-playbooks-2025`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ransomware-defense-backup-recovery-2025`,
      lastModified: d('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/iot-security-enterprise-framework-2025`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/api-security-owasp-top10-testing-2025`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/security-compliance-automation-soc2-iso27001-2025`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-dlp-data-loss-prevention-2025`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/tutorials/ai-penetration-testing-red-team-2025`,
      lastModified: d('2026-05-24'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // R系列 - 安全新闻
    {
      url: `${BASE_URL}/news/crowdstrike-ai-threat-intelligence-2025`,
      lastModified: d('2025-02-20'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/microsoft-security-copilot-enterprise-2025`,
      lastModified: d('2025-03-10'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/change-healthcare-ransomware-aftermath-2025`,
      lastModified: d('2025-02-22'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/openai-safety-board-security-updates-2025`,
      lastModified: d('2025-03-05'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/eu-ai-act-enforcement-begins-2025`,
      lastModified: d('2025-02-02'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/google-deepmind-gemini-security-research-2025`,
      lastModified: d('2025-03-15'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/cloudflare-ai-ddos-protection-2025`,
      lastModified: d('2025-03-20'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/ivanti-zero-day-exploitation-espionage-2025`,
      lastModified: d('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/anthropic-constitutional-ai-safety-update-2025`,
      lastModified: d('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/salt-typhoon-telecom-espionage-2025`,
      lastModified: d('2025-01-20'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // S系列 - MLOps/AI工程/云基础设施
    {
      url: `${BASE_URL}/tutorials/mlops-production-deployment-guide-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/apache-kafka-real-time-ml-pipeline-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/vector-database-rag-production-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/llm-fine-tuning-production-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/data-pipeline-modern-stack-dbt-airflow-2025`,
      lastModified: d('2026-05-23'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/llm-inference-optimization-vllm-tensorrt-2025`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/multimodal-ai-vision-language-models-2025`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/ai-agent-frameworks-langchain-autogen-2025`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/tutorials/prompt-engineering-advanced-patterns-2025`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/responsible-ai-bias-fairness-2025`,
      lastModified: d('2026-05-22'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/serverless-ai-aws-lambda-edge-2025`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/gpu-computing-cuda-ai-training-2025`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/ai-observability-monitoring-production-2025`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/tutorials/terraform-ai-infrastructure-aws-2025`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/tutorials/snowflake-databricks-ai-analytics-2025`,
      lastModified: d('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    // S系列 - AI/ML新闻
    {
      url: `${BASE_URL}/news/nvidia-blackwell-b200-ai-chip-2025`,
      lastModified: d('2025-03-18'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/google-veo-2-video-generation-2025`,
      lastModified: d('2025-03-22'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/openai-gpt5-release-2025`,
      lastModified: d('2025-02-25'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/anthropic-claude-4-sonnet-release-2025`,
      lastModified: d('2025-03-25'),
      changeFrequency: 'monthly',
      priority: 0.92
    },
    {
      url: `${BASE_URL}/news/databricks-mosaic-ai-acquisition-2025`,
      lastModified: d('2025-01-30'),
      changeFrequency: 'monthly',
      priority: 0.89
    },
    {
      url: `${BASE_URL}/news/mistral-le-chat-enterprise-2025`,
      lastModified: d('2025-02-15'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/devin-ai-software-engineer-enterprise-2025`,
      lastModified: d('2025-03-08'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/ai-stack-overflow-developer-survey-2025`,
      lastModified: d('2025-03-12'),
      changeFrequency: 'monthly',
      priority: 0.91
    },
    {
      url: `${BASE_URL}/news/google-gemini-2-flash-thinking-2025`,
      lastModified: d('2025-01-28'),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/news/amd-instinct-mi325x-ai-server-2025`,
      lastModified: d('2025-02-10'),
      changeFrequency: 'monthly',
      priority: 0.89
    }
  ];

  // 动态页面 — 从 Supabase 读取全量 tutorials 和 news
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseAdmin();

    // 查询所有教程
    const { data: tutorials } = await supabase
      .from('tutorials')
      .select('slug, published_at')
      .order('published_at', { ascending: false });

    // 查询所有已发布新闻
    const { data: newsItems } = await supabase
      .from('news')
      .select('slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    const tutorialPages: MetadataRoute.Sitemap = (tutorials ?? []).map((t) => ({
      url: `${BASE_URL}/tutorials/${t.slug}`,
      lastModified: new Date(t.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.88
    }));

    const newsPages: MetadataRoute.Sitemap = (newsItems ?? []).map((n) => ({
      url: `${BASE_URL}/news/${n.slug}`,
      lastModified: new Date(n.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.87
    }));

    dynamicPages = [...tutorialPages, ...newsPages];
  } catch {
    // Supabase 不可用时静默降级，只返回静态页面
  }

  // 合并：静态页面优先，动态页面去重（静态中已有的 slug 不重复添加）
  const staticUrls = new Set(staticPages.map((p) => p.url));
  const uniqueDynamic = dynamicPages.filter((p) => !staticUrls.has(p.url));

  return [...staticPages, ...uniqueDynamic];
}
