import { BASE_URL } from '@/features/seo/sitemap-data';
import { renderSitemapIndex } from '@/features/seo/sitemap-xml';

export const revalidate = 3600;

/**
 * sitemap 索引（/sitemap.xml）—— 指向中文与英文两份子 sitemap。
 * GSC 提交此索引即覆盖全站；也可单独提交 /sitemap-en.xml 追踪英文收录率。
 */
export async function GET() {
  const lastmod = new Date().toISOString();
  const xml = renderSitemapIndex([
    { loc: `${BASE_URL}/sitemap-zh.xml`, lastmod },
    { loc: `${BASE_URL}/sitemap-en.xml`, lastmod }
  ]);
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
