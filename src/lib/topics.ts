// 内链相关性工具（纯函数，无 I/O）——用于详情页"相关推荐"打分与主题集群匹配。
// 关键：剔除模板/套路词与品牌噪音词，否则"凑巧都叫 production-guide / complete-guide"
// 的不相关文章会被误判为相关（slug 词频分析已证实这些是高频噪音）。

const STOPWORDS = new Set([
  'ai', 'llm', 'llms', 'guide', 'complete', 'tutorial', 'tutorials', 'how', 'to', 'the',
  'for', 'and', 'with', 'your', 'a', 'an', 'of', 'in', 'on', 'best', 'practices', 'practice',
  'production', 'implementation', 'implementing', 'advanced', 'quick', 'setup', 'comparison',
  'reference', 'developer', 'developers', 'step', 'by', 'using', 'build', 'building', 'create',
  'creating', 'use', 'used', 'vs', 'is', 'what', 'why', 'when', 'intro', 'introduction',
  'beginner', 'beginners', 'tips', 'tip', 'patterns', 'pattern', 'system', 'systems',
  'application', 'applications', 'app', 'apps', 'hands', 'guide', 'overview', 'explained',
  '2023', '2024', '2025', '2026'
]);

/** 从标题/slug 提取主题词（小写、去停用词、去纯数字），用于相关性命中。 */
export function extractTopicTokens(text: string): string[] {
  if (!text) return [];
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9+]+/)
        .filter((t) => t.length >= 2 && !/^\d+$/.test(t) && !STOPWORDS.has(t))
    )
  );
}

type Scorable = { tags?: string[]; title?: string; category?: string };

/** 相关性加权：tags 交集×3 + 标题主题词命中×2 + 同 category×1。 */
export function relatednessScore(a: Scorable, b: Scorable): number {
  let score = 0;
  const aTags = new Set((a.tags ?? []).map((t) => t.toLowerCase()));
  for (const t of b.tags ?? []) if (aTags.has(t.toLowerCase())) score += 3;
  const aTokens = new Set(extractTopicTokens(a.title ?? ''));
  for (const tok of extractTopicTokens(b.title ?? '')) if (aTokens.has(tok)) score += 2;
  if (a.category && b.category && a.category === b.category) score += 1;
  return score;
}
