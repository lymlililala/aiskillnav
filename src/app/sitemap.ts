import type { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase';
import { PILLAR_TOPICS } from '@/features/tutorials/topics';
import { slugify } from '@/lib/slug';
import { SKILL_CATEGORIES } from '@/features/skills/categories';
import { MODEL_SERIES } from '@/features/models/series';
import { NOINDEX_TUTORIAL_SLUGS } from '@/features/tutorials/noindex-slugs';
import { getPublishedEnglishTutorials } from '@/features/tutorials/api/service';
import { getPublishedEnglishNews } from '@/features/news/api/service';
import { getPublishedEnglishUseCases } from '@/features/usecases/api/service';

// ISR：build 时不预生成（首次请求时生成，避免构建期 Supabase 查询超时），
// 之后缓存 1 小时。此前用 force-dynamic 会覆盖 revalidate，导致每次请求
// 都全量分页查库（实测 ~15s），Googlebot 可能超时/降低抓取频率。
export const revalidate = 3600;

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

    // 分页查询所有 MCP server（详情页此前不在 sitemap，是抓取盲区）
    const allMcp: { slug: string; created_at?: string }[] = [];
    let mcpOffset = 0;
    while (true) {
      const { data, error } = await supabase
        .from('mcp_servers')
        .select('slug, created_at')
        .range(mcpOffset, mcpOffset + PAGE - 1);
      if (error || !data || data.length === 0) break;
      allMcp.push(...data);
      if (data.length < PAGE) break;
      mcpOffset += PAGE;
    }

    // 分页查询所有 usecases（详情页 /usecases/{id}）
    const allUseCases: { id: number }[] = [];
    let ucOffset = 0;
    while (true) {
      const { data, error } = await supabase
        .from('use_cases')
        .select('id')
        .not('published_at', 'is', null)
        .range(ucOffset, ucOffset + PAGE - 1);
      if (error || !data || data.length === 0) break;
      allUseCases.push(...data);
      if (data.length < PAGE) break;
      ucOffset += PAGE;
    }

    // 查询所有模型（详情页 /models/{slugify(name)}）
    const allModels: { name: string }[] = [];
    {
      const { data } = await supabase.from('ai_models').select('name');
      if (data) allModels.push(...data);
    }

    // 查询所有已发布 agents（详情页 /agents/{slugify(name)}）
    const allAgents: { name: string }[] = [];
    {
      const { data } = await supabase.from('agents').select('name').eq('status', 'published');
      if (data) allAgents.push(...data);
    }

    // 文章已按 published_at 降序，首条即最新
    if (allTutorials[0]?.published_at) newestTutorialDate = new Date(allTutorials[0].published_at);
    if (allNews[0]?.published_at) newestNewsDate = new Date(allNews[0].published_at);

    // 按 slug 去重，避免数据库中重复 slug 产生重复 URL
    const uniqTutorials = Array.from(new Map(allTutorials.map((t) => [t.slug, t])).values());
    const uniqNews = Array.from(new Map(allNews.map((n) => [n.slug, n])).values());

    // 已发布英文教程 slug 集（DB 驱动，en_status=published）
    const enSlugs = new Set<string>(
      (await getPublishedEnglishTutorials().catch(() => [])).map((t) => t.slug)
    );
    // 英文 news slug 集 / 英文 usecase id 集
    const enNewsSlugs = new Set<string>(
      (await getPublishedEnglishNews().catch(() => [])).map((n) => n.slug)
    );
    const enUcIds = new Set<number>(
      (await getPublishedEnglishUseCases().catch(() => [])).map((u) => u.id)
    );

    // 排除已 noindex 的损坏模板页：sitemap 与 robots meta 保持一致，不向 Google 提交它们
    const tutorialPages: MetadataRoute.Sitemap = uniqTutorials
      .filter((t) => !NOINDEX_TUTORIAL_SLUGS.has(t.slug))
      .map((t) => ({
        url: `${BASE_URL}/tutorials/${t.slug}`,
        lastModified: new Date(t.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.88,
        // 有英文版的教程：声明中英 hreflang 互指
        ...(enSlugs.has(t.slug)
          ? {
              alternates: {
                languages: {
                  'zh-CN': `${BASE_URL}/tutorials/${t.slug}`,
                  en: `${BASE_URL}/en/tutorials/${t.slug}`
                }
              }
            }
          : {})
      }));

    // 英文教程页（en_status=published，且不在 noindex 名单）
    const enTutorialPages: MetadataRoute.Sitemap = [...enSlugs]
      .filter((slug) => !NOINDEX_TUTORIAL_SLUGS.has(slug))
      .map((slug) => ({
        url: `${BASE_URL}/en/tutorials/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            'zh-CN': `${BASE_URL}/tutorials/${slug}`,
            en: `${BASE_URL}/en/tutorials/${slug}`
          }
        }
      }));

    const newsPages: MetadataRoute.Sitemap = uniqNews.map((n) => ({
      url: `${BASE_URL}/news/${n.slug}`,
      lastModified: new Date(n.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.87,
      ...(enNewsSlugs.has(n.slug)
        ? {
            alternates: {
              languages: {
                'zh-CN': `${BASE_URL}/news/${n.slug}`,
                en: `${BASE_URL}/en/news/${n.slug}`
              }
            }
          }
        : {})
    }));

    const enNewsPages: MetadataRoute.Sitemap = [...enNewsSlugs].map((slug) => ({
      url: `${BASE_URL}/en/news/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
      alternates: {
        languages: { 'zh-CN': `${BASE_URL}/news/${slug}`, en: `${BASE_URL}/en/news/${slug}` }
      }
    }));

    const uniqMcp = Array.from(new Map(allMcp.map((m) => [m.slug, m])).values());
    const mcpPages: MetadataRoute.Sitemap = uniqMcp.map((m) => ({
      url: `${BASE_URL}/mcp/${m.slug}`,
      lastModified: m.created_at ? new Date(m.created_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }));

    const usecasePages: MetadataRoute.Sitemap = allUseCases.map((u) => ({
      url: `${BASE_URL}/usecases/${u.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(enUcIds.has(u.id)
        ? {
            alternates: {
              languages: {
                'zh-CN': `${BASE_URL}/usecases/${u.id}`,
                en: `${BASE_URL}/en/usecases/${u.id}`
              }
            }
          }
        : {})
    }));

    const enUseCasePages: MetadataRoute.Sitemap = [...enUcIds].map((id) => ({
      url: `${BASE_URL}/en/usecases/${id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: { 'zh-CN': `${BASE_URL}/usecases/${id}`, en: `${BASE_URL}/en/usecases/${id}` }
      }
    }));

    const uniqModelSlugs = Array.from(
      new Set(allModels.map((m) => slugify(m.name)).filter(Boolean))
    );
    const modelPages: MetadataRoute.Sitemap = uniqModelSlugs.map((s) => ({
      url: `${BASE_URL}/models/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));

    const uniqAgentSlugs = Array.from(
      new Set(allAgents.map((a) => slugify(a.name)).filter(Boolean))
    );
    const agentPages: MetadataRoute.Sitemap = uniqAgentSlugs.map((s) => ({
      url: `${BASE_URL}/agents/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));

    dynamicPages = [
      ...tutorialPages,
      ...enTutorialPages,
      ...newsPages,
      ...enNewsPages,
      ...mcpPages,
      ...usecasePages,
      ...enUseCasePages,
      ...modelPages,
      ...agentPages
    ];
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
    {
      url: `${BASE_URL}/tutorials`,
      lastModified: newestTutorialDate,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    { url: `${BASE_URL}/usecases`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${BASE_URL}/news`,
      lastModified: newestNewsDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3
    },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    // 英文壳页（/en）
    {
      url: `${BASE_URL}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { 'zh-CN': BASE_URL, en: `${BASE_URL}/en`, 'x-default': BASE_URL } }
    },
    {
      url: `${BASE_URL}/en/tutorials`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    { url: `${BASE_URL}/en/news`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/en/usecases`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/en/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/en/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    {
      url: `${BASE_URL}/en/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2
    },
    { url: `${BASE_URL}/en/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    // 主题集群 pillar 枢纽页（高优先级，集中权重）
    ...PILLAR_TOPICS.map((t) => ({
      url: `${BASE_URL}/tutorials/topic/${t.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    })),
    // skills 分类聚合页
    ...SKILL_CATEGORIES.map((c) => ({
      url: `${BASE_URL}/skills/category/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    })),
    // 模型系列对比页
    ...MODEL_SERIES.map((s) => ({
      url: `${BASE_URL}/models/series/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  ];

  // 合并：静态入口页 + 动态文章页（去重）
  const staticUrls = new Set(staticPages.map((p) => p.url));
  const uniqueDynamic = dynamicPages.filter((p) => !staticUrls.has(p.url));

  return [...staticPages, ...uniqueDynamic];
}
