import { getSitemapEntries, isEnglishUrl } from '@/features/seo/sitemap-data';
import { renderUrlset } from '@/features/seo/sitemap-xml';

// 与原 sitemap 一致：首次请求生成、缓存 1 小时
export const revalidate = 3600;

/** 英文站 sitemap（/sitemap-en.xml）—— 仅 /en 壳页与 /en/* 子页，便于 GSC 单独提交+追踪英文收录 */
export async function GET() {
  const entries = await getSitemapEntries();
  const en = entries.filter((e) => isEnglishUrl(e.url));
  return new Response(renderUrlset(en), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
