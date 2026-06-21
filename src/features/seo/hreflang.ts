/**
 * 中英双向 hreflang —— 给定中文路径返回对称的 canonical + languages 簇。
 *
 * 用于中文页面 generateMetadata 的 alternates 字段，确保中↔英互指（reciprocal），
 * 避免单边 hreflang 导致搜索引擎把信号合并到 /en，削弱中文页权重。
 *
 * @param zhPath 中文路径，根用 '/'，其余形如 '/skills'、'/tutorials'
 *
 * @example
 *   alternates: hreflangFor('/skills')
 *   // → canonical: https://aiskillnav.com/skills
 *   //   languages: { 'zh-CN': .../skills, en: .../en/skills, 'x-default': .../skills }
 */
export function hreflangFor(zhPath: string) {
  const suffix = zhPath === '/' ? '' : zhPath;
  const zh = `https://aiskillnav.com${suffix}`;
  const en = `https://aiskillnav.com/en${suffix}`;
  return {
    canonical: zh,
    languages: { 'zh-CN': zh, en, 'x-default': zh }
  };
}
