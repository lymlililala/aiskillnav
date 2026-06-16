/**
 * GSC「未找到 (404)」修复：被 Google 抓取过、但在库里从不存在的模板化 slug，
 * 301（permanent，Next 实现为 308）跳转到语义最接近的已发布文章，
 * 既清掉 404、又把这些 URL 已积累的链接权重导流到真实页面。
 *
 * 数据依据：gsc/20260616 的 404 下钻表（共 34 条），逐条比对 Supabase：
 *  - 2 条（chatgpt-vs-claude-vs-gemini-2026 / slack-claude-api-…-ek1t8j）线上已 200，属过期抓取，未列入；
 *  - 其余 32 条库中确无对应行 → 下面逐条映射到「已发布」的最近主题文章（目标均已校验 published_at 非空）。
 *
 * 来源 slug 是历史模板批量产物（多频道/工具名后缀），不会再生成，故为静态名单。
 * 若日后这些 slug 被真正写入库，删除对应条目即可恢复直达详情页。
 */
type SeoRedirect = { from: string; to: string };

const TUTORIAL_REDIRECTS: SeoRedirect[] = [
  // 内容创作 / 营销 / 文案
  ['ai-content-repurposing-multi-channel', 'ai-content-creation-workflow-seo-2025'],
  ['ai-copywriting-conversion-optimization', 'ai-content-writing-seo-copywriting'],
  ['ai-seo-content-writing-optimization', 'ai-seo-content-strategy-keyword-research-2026'],
  ['ai-marketing-materials-design-automation', 'ai-seo-content-marketing-complete-guide-2026'],
  ['ai-writing-assistant-long-form-content', 'ai-content-writing-seo-copywriting'],
  ['ai-technical-writing-documentation-automation', 'documentation-agent-complete-tutorial-whb9vk'],
  ['ai-data-visualization-storytelling', 'ai-data-analysis-excel-python-workflow-2026'],
  // 设计 / 图像 / 照片
  ['ai-graphic-design-workflow-figma-canva', 'ai-graphic-design-tools-professional'],
  ['ai-brand-identity-design-automation', 'midjourney-v7-brand-design-workflow'],
  ['ai-photo-editing-lightroom-automation', 'adobe-firefly-generative-fill-photoshop-pro-tips'],
  ['ai-portrait-retouching-batch-processing', 'ai-photography-editing-workflow'],
  [
    'ai-thumbnail-generation-click-through-optimization',
    'ai-video-content-creation-scripts-editing-2026'
  ],
  // 视频 / 短视频 / YouTube
  ['ai-video-editing-automation-premiere-davinci', 'ai-video-editing-workflow-professionals'],
  ['ai-youtube-content-strategy-growth', 'ai-youtube-channel-growth-complete-guide'],
  ['ai-shorts-reels-tiktok-content-factory', 'ai-short-form-video-tiktok-reels-strategy'],
  // 播客
  ['ai-podcast-production-workflow-automation', 'ai-podcast-production-complete-guide'],
  ['ai-podcast-editing-noise-removal-enhancement', 'descript-ai-podcast-video-editing-workflow'],
  ['ai-podcast-show-notes-transcription-seo', 'ai-podcast-production-complete-guide'],
  ['ai-podcast-guest-research-interview-prep', 'ai-podcast-production-complete-guide'],
  [
    'ai-podcast-monetization-audience-growth',
    'ai-for-content-creators-youtube-podcast-newsletter-2026'
  ],
  // DevOps / 云 / 基础设施 / MLOps
  ['ai-devops-cicd-pipeline-optimization', 'ai-devops-cicd-pipeline-automation'],
  ['ai-cloud-cost-optimization-aws-azure', 'ai-cloud-cost-optimization-strategies'],
  ['ai-cloud-migration-strategy-planning', 'ai-cloud-cost-optimization-strategies'],
  ['ai-infrastructure-as-code-terraform-ansible', 'ai-infrastructure-as-code-automation'],
  ['ai-model-monitoring-mlops-drift-detection', 'machine-learning-model-monitoring-dashboard-2026'],
  ['ai-feature-engineering-ml-pipeline', 'ai-data-pipeline-etl-preprocessing-2025'],
  ['ai-log-analysis-observability-monitoring', 'ai-security-log-analysis-siem'],
  // 安全
  ['ai-cybersecurity-threat-detection-soc', 'ai-cybersecurity-threat-detection-2026'],
  ['ai-malware-analysis-reverse-engineering', 'ai-cybersecurity-threat-detection-2026'],
  // 求职
  ['ai-job-hunting-resume-interview-guide-2026', 'ai-resume-builder-guide-2026']
].map(([from, to]) => ({ from: `/tutorials/${from}`, to: `/tutorials/${to}` }));

const NEWS_REDIRECTS: SeoRedirect[] = [
  ['ai-agent-market-2026-mid-year-review', 'mcp-protocol-adoption-stats-2026'],
  [
    'llm-hallucination-mitigation-techniques-2026',
    'ai-hallucination-detection-tools-comparison-2026'
  ]
].map(([from, to]) => ({ from: `/news/${from}`, to: `/news/${to}` }));

/** next.config 的 redirects() 直接展开本数组（permanent=308）。 */
export const SEO_404_REDIRECTS: { source: string; destination: string; permanent: true }[] = [
  ...TUTORIAL_REDIRECTS,
  ...NEWS_REDIRECTS
].map(({ from, to }) => ({ source: from, destination: to, permanent: true }));
