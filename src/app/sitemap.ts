import type { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase';

// 声明为动态路由，避免 build 时尝试静态生成（会触发 Supabase 查询超时）
// sitemap 每次请求时动态生成，Googlebot 抓取时拿到最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 可选：CDN 级别 1h 缓存

const BASE_URL = 'https://aiskillnav.com';

/**
 * 动态生成 sitemap.xml — 静态入口页 + 从 Supabase 分页读取全量文章
 * 访问地址: /sitemap.xml
 *
 * 注意：仅收录规范的公开 URL（(main) 路由组下的 /news、/tutorials 等）。
 * 旧的 /dashboard/* 路径已 308 永久重定向到这些规范页面，因此不应出现在 sitemap 中。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 动态页面 — 从 Supabase 分页读取全量 tutorials 和 news
  // Supabase JS 客户端默认上限 1000 条，需分页循环取全量
  let dynamicPages: MetadataRoute.Sitemap = [];
  // 列表页的 lastModified 取最新文章发布时间，提示 Google 这些聚合页有更新、需要重抓
  let newestTutorialDate = now;
  let newestNewsDate = now;
  try {
    const supabase = getSupabaseAdmin();
    const PAGE = 1000;

    // 分页查询所有教程
    const allTutorials: { slug: string; published_at: string }[] = [];
    let tutOffset = 0;
    while (true) {
      const { data, error } = await supabase
        .from('tutorials')
        .select('slug, published_at')
        .order('published_at', { ascending: false })
        .range(tutOffset, tutOffset + PAGE - 1);
      if (error || !data || data.length === 0) break;
      allTutorials.push(...data);
      if (data.length < PAGE) break;
      tutOffset += PAGE;
    }

    // 分页查询所有已发布新闻
    const allNews: { slug: string; published_at: string }[] = [];
    let newsOffset = 0;
    while (true) {
      const { data, error } = await supabase
        .from('news')
        .select('slug, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(newsOffset, newsOffset + PAGE - 1);
      if (error || !data || data.length === 0) break;
      allNews.push(...data);
      if (data.length < PAGE) break;
      newsOffset += PAGE;
    }

    // 文章已按 published_at 降序，首条即最新
    if (allTutorials[0]?.published_at) newestTutorialDate = new Date(allTutorials[0].published_at);
    if (allNews[0]?.published_at) newestNewsDate = new Date(allNews[0].published_at);

    // 按 slug 去重，避免数据库中重复 slug 产生重复 URL
    const uniqTutorials = Array.from(new Map(allTutorials.map((t) => [t.slug, t])).values());
    const uniqNews = Array.from(new Map(allNews.map((n) => [n.slug, n])).values());

    const tutorialPages: MetadataRoute.Sitemap = uniqTutorials.map((t) => ({
      url: `${BASE_URL}/tutorials/${t.slug}`,
      lastModified: new Date(t.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.88
    }));

    const newsPages: MetadataRoute.Sitemap = uniqNews.map((n) => ({
      url: `${BASE_URL}/news/${n.slug}`,
      lastModified: new Date(n.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.87
    }));

    dynamicPages = [...tutorialPages, ...newsPages];
  } catch {
    // Supabase 不可用时静默降级，只返回静态页面
  }

  // 静态入口页面（仅保留核心列表页，详情页完全由 Supabase 动态生成）
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/skills`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/agents`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/mcp`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/models`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/tutorials`, lastModified: newestTutorialDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/usecases`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/news`, lastModified: newestNewsDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 }
  ];

  // 合并：静态入口页 + 动态文章页（去重）
  const staticUrls = new Set(staticPages.map((p) => p.url));
  const uniqueDynamic = dynamicPages.filter((p) => !staticUrls.has(p.url));

  return [...staticPages, ...uniqueDynamic];
}
