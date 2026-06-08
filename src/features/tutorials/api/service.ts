import { fakeTutorials } from '@/constants/mock-api-tutorials';
import type { Tutorial, TutorialLevel, TutorialCategory } from '@/constants/mock-api-tutorials';

export type { Tutorial, TutorialLevel, TutorialCategory };
export type CreateTutorialPayload = Omit<Tutorial, 'id'>;
export type UpdateTutorialPayload = Partial<CreateTutorialPayload>;

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

type TutorialQuery = { level?: string; category?: string; search?: string };

export type TutorialsPage = { items: Tutorial[]; total_items: number };

// 列表场景不需要 content（Markdown 正文，是最大字段）：排除后每行 payload 大幅减小
const TUTORIAL_LIST_COLUMNS =
  'id,slug,title,subtitle,summary,level,category,tags,estimated_minutes,related_tools,is_featured,published_at';

/**
 * 服务端直查 Supabase（与 sitemap.ts 同源）。
 * 关键：Server Component / ISR 渲染时不要再通过 HTTP 自调用 /api/tutorials —
 * 那条「函数内再请求另一个 serverless 函数」的链路在生产会偶发 upstream 超时，
 * 一旦失败就回退到只有 ~27 篇的 mock，导致真实教程详情页返回 404。
 * 直查 DB 后数据源与 sitemap 完全一致，彻底消除 404。
 * 返回 null 表示 DB 不可用（缺少 env 等），调用方再回退到 API/mock。
 */
async function fetchTutorialsFromDb(opts: TutorialQuery): Promise<Tutorial[] | null> {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase');
    let query = getSupabaseAdmin().from('tutorials').select(TUTORIAL_LIST_COLUMNS);
    if (opts.level && opts.level !== 'all') query = query.eq('level', opts.level);
    if (opts.category && opts.category !== 'all') query = query.eq('category', opts.category);
    if (opts.search) query = query.or(`title.ilike.%${opts.search}%,summary.ilike.%${opts.search}%`);
    const { data, error } = await query
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });
    if (error || !data) return null;
    // content 不在 SELECT 中，补空串以满足 Tutorial 类型（列表/相关教程都不渲染正文）
    return data.map((t) => ({ ...t, content: '' })) as Tutorial[];
  } catch {
    return null;
  }
}

export async function getTutorials(opts: TutorialQuery = {}): Promise<Tutorial[]> {
  // 服务端优先直查 DB，避免 SSR 期间 HTTP 自调用超时
  if (typeof window === 'undefined') {
    const direct = await fetchTutorialsFromDb(opts);
    if (direct) return direct;
  }

  const params = new URLSearchParams();
  if (opts.search) params.set('search', opts.search);
  if (opts.level && opts.level !== 'all') params.set('level', opts.level);
  if (opts.category && opts.category !== 'all') params.set('category', opts.category);

  const data = await safeFetch<Tutorial[]>(`${apiBase()}/tutorials?${params}`);
  if (!data) return fakeTutorials.getTutorials(opts);
  return data;
}

/**
 * 分页版列表查询：/tutorials 列表页只渲染当前页，避免一次性 SSR 全部 2008 篇
 * （此前 5.5MB HTML / ~5s）。服务端直查 + count；DB 不可用时回退到全量再切片。
 */
export async function getTutorialsPage(
  opts: TutorialQuery & { page?: number; limit?: number } = {}
): Promise<TutorialsPage> {
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit ?? 48;
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      let query = getSupabaseAdmin()
        .from('tutorials')
        .select(TUTORIAL_LIST_COLUMNS, { count: 'exact' });
      if (opts.level && opts.level !== 'all') query = query.eq('level', opts.level);
      if (opts.category && opts.category !== 'all') query = query.eq('category', opts.category);
      if (opts.search)
        query = query.or(`title.ilike.%${opts.search}%,summary.ilike.%${opts.search}%`);
      const { data, count, error } = await query
        .order('is_featured', { ascending: false })
        .order('published_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      if (!error && data)
        return {
          items: data.map((t) => ({ ...t, content: '' })) as Tutorial[],
          total_items: count ?? 0
        };
    } catch {
      // 走下面的回退
    }
  }
  // 回退：取全量再客户端切片（本地开发 / DB 不可用）
  const all = await getTutorials({
    level: opts.level,
    category: opts.category,
    search: opts.search
  });
  return { items: all.slice((page - 1) * limit, page * limit), total_items: all.length };
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  // 服务端直查 DB；用 limit(1) 取首条，避免 .single() 对缺失/重复 slug 抛错
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('tutorials')
        .select('*')
        .eq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(1);
      // 查询成功：有则返回该教程，无则 null（slug 确实不存在 → 正常 404）
      if (!error) return (data?.[0] as Tutorial) ?? null;
      // 仅当 DB 出错（缺 env 等）才落到下面的 API/mock 回退
    } catch {
      // ignore，走回退
    }
  }

  const data = await safeFetch<Tutorial>(`${apiBase()}/tutorials?slug=${encodeURIComponent(slug)}`);
  if (!data) return fakeTutorials.getTutorialBySlug(slug);
  return data;
}

export async function getTutorialStats() {
  // 服务端直查：用 head count 并发统计，避免 select('*') 拉全量 2008 行
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const LEVELS = ['beginner', 'intermediate', 'advanced'];
      const CATS = ['concept', 'hands-on', 'mcp', 'agent', 'workflow', 'creative', 'productivity'];
      const [totalRes, featuredRes, ...rest] = await Promise.all([
        sb.from('tutorials').select('*', { count: 'exact', head: true }),
        sb.from('tutorials').select('*', { count: 'exact', head: true }).eq('is_featured', true),
        ...LEVELS.map((l) =>
          sb.from('tutorials').select('*', { count: 'exact', head: true }).eq('level', l)
        ),
        ...CATS.map((c) =>
          sb.from('tutorials').select('*', { count: 'exact', head: true }).eq('category', c)
        )
      ]);
      if (!totalRes.error) {
        const byLevel = Object.fromEntries(LEVELS.map((l, i) => [l, rest[i].count ?? 0]));
        const byCategory = Object.fromEntries(
          CATS.map((c, i) => [c, rest[LEVELS.length + i].count ?? 0])
        );
        return { total: totalRes.count ?? 0, featured: featuredRes.count ?? 0, byLevel, byCategory };
      }
    } catch {
      // 走下面的 API/mock 回退
    }
  }

  const data = await safeFetch<{
    total: number;
    featured: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
  }>(`${apiBase()}/tutorials?action=stats`);
  if (!data) {
    const all = await getTutorials();
    const total = all.length;
    const featured = all.filter((t) => t.is_featured).length;
    const byLevel = all.reduce((acc: Record<string, number>, t) => {
      acc[t.level] = (acc[t.level] ?? 0) + 1;
      return acc;
    }, {});
    const byCategory = all.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + 1;
      return acc;
    }, {});
    return { total, featured, byLevel, byCategory };
  }
  return data;
}

export async function getFeaturedTutorials(): Promise<Tutorial[]> {
  // 服务端直查 DB，避免 SSR 自调用超时拖慢 /tutorials 列表页
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('tutorials')
        .select('*')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(6);
      if (!error) return (data ?? []) as Tutorial[];
    } catch {
      // 走下面的 API/mock 回退
    }
  }
  const data = await safeFetch<Tutorial[]>(`${apiBase()}/tutorials?action=featured`);
  if (!data) return fakeTutorials.getFeatured();
  return data;
}

export async function createTutorial(payload: CreateTutorialPayload): Promise<Tutorial> {
  const res = await fetch(`${apiBase()}/tutorials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create tutorial: ${res.statusText}`);
  return res.json() as Promise<Tutorial>;
}

export async function updateTutorial(
  id: number,
  payload: UpdateTutorialPayload
): Promise<Tutorial | null> {
  return safeFetch<Tutorial>(`${apiBase()}/tutorials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteTutorial(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/tutorials/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
