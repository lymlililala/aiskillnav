import { getSitemapEntries, isEnglishUrl } from '@/features/seo/sitemap-data';
import { renderUrlset } from '@/features/seo/sitemap-xml';

// 与原 sitemap 一致：首次请求生成、缓存 1 小时
export const revalidate = 3600;

/** 中文站 sitemap（/sitemap-zh.xml）—— 全部非 /en URL */
export async function GET() {
  const entries = await getSitemapEntries();
  const zh = entries.filter((e) => !isEnglishUrl(e.url));
  return new Response(renderUrlset(zh), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
