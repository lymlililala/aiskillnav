import { AI_TIMELINE, AI_TIMELINE_EN, fakeNews } from '@/constants/mock-api-news';
import type {
  NewsItem,
  NewsFilters,
  NewsResponse,
  NewsStats,
  CreateNewsPayload,
  UpdateNewsPayload,
  TimelineEvent
} from './types';

function apiBase() {
  if (typeof window === 'undefined') {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return `${base}/api`;
  }
  return '/api';
}

async function safeFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) }
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

/**
 * 服务端直查 Supabase（与 sitemap / api 同源），复刻 /api/news 的分页与过滤逻辑。
 * 避免 SSR（列表页 + 详情页的「相关资讯」）走 HTTP 自调用 /api/news 而偶发 upstream 超时，
 * 拖慢响应 → Google 降低抓取速率 → 大量页面停留在「已发现 - 尚未编入索引」。
 * 返回 null 表示 DB 不可用，调用方再回退到 API/mock。
 */
async function fetchNewsFromDb(filters: NewsFilters): Promise<NewsResponse | null> {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase');
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    let query = getSupabaseAdmin().from('news').select('*', { count: 'exact' });
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.category && filters.category !== 'all')
      query = query.eq('category', filters.category);
    if (filters.search)
      query = query.or(
        `title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%,source_name.ilike.%${filters.search}%`
      );
    if (filters.sort) {
      try {
        const s = JSON.parse(filters.sort) as { id: string; desc: boolean }[];
        if (s.length > 0) query = query.order(s[0].id, { ascending: !s[0].desc });
        else query = query.order('published_at', { ascending: false });
      } catch {
        query = query.order('published_at', { ascending: false });
      }
    } else {
      query = query.order('published_at', { ascending: false });
    }
    const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);
    if (error) return null;
    return { items: (data ?? []) as NewsItem[], total_items: count ?? 0 };
  } catch {
    return null;
  }
}

export async function getNews(filters: NewsFilters): Promise<NewsResponse> {
  // 服务端优先直查 DB，避免 SSR 期间 HTTP 自调用超时
  if (typeof window === 'undefined') {
    const direct = await fetchNewsFromDb(filters);
    if (direct) return direct;
  }

  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.sort) params.set('sort', filters.sort);

  const data = await safeFetch<NewsResponse>(`${apiBase()}/news?${params}`);
  if (!data) return fakeNews.getNews(filters);
  return data;
}

export async function getPublishedNews(
  filters: Omit<NewsFilters, 'status'>
): Promise<NewsResponse> {
  return getNews({ ...filters, status: 'published' });
}

/** 英文 news 字段（_en 列） */
export type EnglishNews = NewsItem & {
  title_en?: string | null;
  summary_en?: string | null;
  en_status?: string | null;
};

/** 已发布英文 news（en_status='published'），供 /en/news 列表与 sitemap。分页取全量。 */
export async function getPublishedEnglishNews(): Promise<EnglishNews[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const all: EnglishNews[] = [];
      const PAGE = 1000;
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await sb
          .from('news')
          .select(
            'slug,title_en,summary_en,category,tags,source_url,source_name,published_at,en_status'
          )
          .eq('en_status', 'published')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .range(from, from + PAGE - 1);
        if (error || !data || data.length === 0) break;
        all.push(...(data as EnglishNews[]));
        if (data.length < PAGE) break;
      }
      return all;
    } catch {
      // ignore
    }
  }
  return [];
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  // 服务端直查 DB（与 sitemap 同源），避免 SSR 期间 HTTP 自调用超时回退 mock 导致详情页 404
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('news')
        .select('*')
        .eq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(1);
      if (!error) return (data?.[0] as NewsItem) ?? null;
    } catch {
      // 走下面的 API/mock 回退
    }
  }
  const data = await safeFetch<NewsItem>(`${apiBase()}/news/${encodeURIComponent(slug)}`);
  if (!data) return fakeNews.getNewsBySlug(slug);
  return data;
}

export async function getNewsById(id: number): Promise<NewsItem | null> {
  const data = await safeFetch<NewsItem>(`${apiBase()}/news/${id}`);
  if (!data) return fakeNews.getNewsById(id);
  return data;
}

export async function getFeaturedNews(): Promise<NewsItem[]> {
  // 服务端直查 DB，避免 SSR 自调用超时
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('news')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);
      if (!error) return (data ?? []) as NewsItem[];
    } catch {
      // 走下面的 API/mock 回退
    }
  }
  const data = await safeFetch<NewsItem[]>(`${apiBase()}/news?action=featured`);
  if (!data) return fakeNews.getFeaturedNews();
  return data;
}

export async function getAllNewsCategories(): Promise<string[]> {
  // 服务端直查 DB，避免 SSR 自调用超时拖慢 /news 列表页
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('news')
        .select('category')
        .eq('status', 'published');
      if (!error)
        return Array.from(
          new Set((data ?? []).map((r: { category: string }) => r.category))
        ).sort();
    } catch {
      // 走下面的 API/mock 回退
    }
  }
  const data = await safeFetch<string[]>(`${apiBase()}/news?action=categories`);
  if (!data) return fakeNews.getAllCategories();
  return data;
}

export async function getNewsStats(): Promise<NewsStats> {
  const data = await safeFetch<NewsStats>(`${apiBase()}/news?action=stats`);
  if (!data) return fakeNews.getStats();
  return data;
}

/** 相关资讯（替换详情页"拉 50 条再排序"）。tags 重叠 + 同 category 候选 + 打分。 */
export async function getRelatedNews(
  current: { slug: string; category: string; tags: string[]; title: string },
  limit = 6
): Promise<NewsItem[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const queries: Promise<{ data: unknown[] | null }>[] = [];
      if (current.tags?.length)
        queries.push(
          sb
            .from('news')
            .select('*')
            .eq('status', 'published')
            .overlaps('tags', current.tags)
            .neq('slug', current.slug)
            .limit(30) as unknown as Promise<{ data: unknown[] | null }>
        );
      queries.push(
        sb
          .from('news')
          .select('*')
          .eq('status', 'published')
          .eq('category', current.category)
          .neq('slug', current.slug)
          .limit(30) as unknown as Promise<{ data: unknown[] | null }>
      );
      const results = await Promise.all(queries);
      const map = new Map<string, Record<string, unknown>>();
      for (const res of results)
        for (const r of (res.data ?? []) as Record<string, unknown>[]) map.set(r.slug as string, r);
      const candidates = Array.from(map.values());
      if (candidates.length) {
        const { relatednessScore } = await import('@/lib/topics');
        return candidates
          .map((c) => ({
            c,
            s: relatednessScore(current, {
              tags: c.tags as string[],
              title: c.title as string,
              category: c.category as string
            })
          }))
          .sort((x, y) => y.s - x.s)
          .slice(0, limit)
          .map((x) => x.c as unknown as NewsItem);
      }
    } catch {
      // 走下面的回退
    }
  }
  const resp = await getPublishedNews({ category: current.category, limit: 50 });
  return resp.items.filter((n) => n.slug !== current.slug).slice(0, limit);
}

export async function createNews(payload: CreateNewsPayload): Promise<NewsItem> {
  const res = await fetch(`${apiBase()}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create news: ${res.statusText}`);
  return res.json() as Promise<NewsItem>;
}

export async function updateNews(id: number, payload: UpdateNewsPayload): Promise<NewsItem | null> {
  return safeFetch<NewsItem>(`${apiBase()}/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteNews(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/news/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

/** 时间线数据保持静态（不存数据库） */
export function getTimeline(): TimelineEvent[] {
  return AI_TIMELINE;
}

/** 英文站时间线 */
export function getTimelineEn(): TimelineEvent[] {
  return AI_TIMELINE_EN;
}
