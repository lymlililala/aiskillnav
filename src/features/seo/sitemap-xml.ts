import type { MetadataRoute } from 'next';

/** XML 文本转义（loc/href 里可能出现 & 等字符） */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** lastModified（Date | string | number）归一化为 W3C 日期字符串 */
function fmtDate(d: Date | string | number | undefined): string | null {
  if (d == null) return null;
  try {
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * 把 Next 的 MetadataRoute.Sitemap 渲染成标准 urlset XML，
 * 含 hreflang 互指（xhtml:link rel="alternate"）。
 */
export function renderUrlset(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((e) => {
      const parts = [`    <loc>${esc(e.url)}</loc>`];
      const lastmod = fmtDate(e.lastModified as Date | string | number | undefined);
      if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
      if (e.changeFrequency) parts.push(`    <changefreq>${e.changeFrequency}</changefreq>`);
      if (e.priority != null) parts.push(`    <priority>${e.priority}</priority>`);
      const langs = e.alternates?.languages as Record<string, string> | undefined;
      if (langs) {
        for (const [hreflang, href] of Object.entries(langs)) {
          parts.push(
            `    <xhtml:link rel="alternate" hreflang="${esc(hreflang)}" href="${esc(href)}"/>`
          );
        }
      }
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

/** 渲染 sitemap 索引（sitemapindex），指向各子 sitemap */
export function renderSitemapIndex(children: { loc: string; lastmod?: string }[]): string {
  const items = children
    .map((c) => {
      const parts = [`    <loc>${esc(c.loc)}</loc>`];
      if (c.lastmod) parts.push(`    <lastmod>${c.lastmod}</lastmod>`);
      return `  <sitemap>\n${parts.join('\n')}\n  </sitemap>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}
