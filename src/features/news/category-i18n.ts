// 新闻分类英文归一化：DB 中 category 字段历史上中英/slug 混存
// （如 行业 / 模型 / industry-news / Research / model-release），
// 英文站统一映射为干净的英文标签。
const CN_TO_EN: Record<string, string> = {
  行业: 'Industry',
  模型: 'Models',
  框架: 'Frameworks',
  工具: 'Tools',
  融资: 'Funding',
  研究: 'Research',
  综合: 'General',
  产品: 'Products',
  生产力工具: 'Productivity',
  'AI 协议': 'AI Protocol',
  'AI 编程工具': 'Coding Tools',
  'AI 硬件': 'AI Hardware',
  'AI 科学': 'AI Science',
  'AI 政策': 'AI Policy',
  '多媒体 AI': 'Multimodal AI'
};

const SLUG_TO_EN: Record<string, string> = {
  'industry-news': 'Industry',
  'policy-regulation': 'Policy',
  'model-release': 'Model Release',
  industry: 'Industry',
  research: 'Research',
  tools: 'Tools',
  models: 'Models',
  model: 'Models',
  policy: 'Policy',
  product: 'Products',
  technology: 'Technology'
};

/** 把任意历史分类值规整为英文标签。 */
export function enNewsCategory(raw?: string | null): string {
  if (!raw) return 'News';
  const s = raw.trim();
  if (CN_TO_EN[s]) return CN_TO_EN[s];
  const lower = s.toLowerCase();
  if (SLUG_TO_EN[lower]) return SLUG_TO_EN[lower];
  // 仍含中文却未命中映射 → 兜底
  if (/[一-鿿]/.test(s)) return 'Industry';
  // 英文 slug/短语：分隔符转空格 + 标题式大小写
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
