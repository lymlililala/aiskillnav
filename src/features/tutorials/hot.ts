/**
 * 首页「热门指南」策划清单。
 *
 * 依据 GSC（2026-06-08 性能报告，近 3 个月）：这些页都是「高曝光 + 排名 4-10 名」，
 * 即已进入 Google 搜索结果第 1 页、就差一步进前 3。从全站权重最高的首页直链它们，
 * 是把排名推进前 3 最有效的内链动作，同时把首页访客导向已被验证有需求的内容（提 CTR）。
 *
 * 维护：拿到新的 GSC 数据后，把「排名 4-10、曝光高、尚未进前 3」的 slug 替换进来即可。
 * 顺序 = 展示顺序，按曝光 + 接近前 3 的程度排。
 */
export const HOT_TUTORIAL_SLUGS: string[] = [
  'dify-vs-coze-vs-fastgpt-2026-comparison', // 109 曝光, 排名 6.2
  'llamaindex-production-rag-applications-2026', // 29 曝光, 排名 4.5（最接近前 3）
  'pgvector-vector-search-postgresql-2026', // 21 曝光, 排名 5.0
  'claude-artifacts-vs-gpt-code-interpreter-side-by-side-comparison-5ree4y', // 21 曝光, 排名 6.2
  'zod-vs-pydantic-for-ai-validation-side-by-side-comparison-pi491i', // 28 曝光, 排名 9.7
  'cloudflare-ai-workers-ai-complete-guide-for-ai-applications-2026-i1vhkx', // 24 曝光, 排名 8.7
  'openai-function-calling-complete-guide-complete-developer-guide-2026-1bdya', // 19 曝光, 排名 7.0
  'langgraph-stateful-ai-agents-guide-2026' // 17 曝光, 排名 6.7
];
