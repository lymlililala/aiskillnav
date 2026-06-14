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
 * 列表/推荐类查询统一排除 published_at IS NULL 的行。
 * 约定：noindex 名单（模板垃圾，见 noindex-slugs.ts）的行会把 published_at 置空，
 * 使其从列表页、搜索、相关推荐、统计中消失，但详情页仍可渲染
 * （getTutorialBySlug 不加此过滤——Google 需要抓到页面上的 noindex meta）。
 */
function visibleOnly<T>(query: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (query as any).not('published_at', 'is', null) as T;
}

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
    let query = visibleOnly(getSupabaseAdmin().from('tutorials').select(TUTORIAL_LIST_COLUMNS));
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
      let query = visibleOnly(
        getSupabaseAdmin().from('tutorials').select(TUTORIAL_LIST_COLUMNS, { count: 'exact' })
      );
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

/** 英文教程字段（_en 列 + 复用中文行的元数据）。 */
export type EnglishTutorial = Tutorial & {
  title_en?: string | null;
  subtitle_en?: string | null;
  summary_en?: string | null;
  content_en?: string | null;
  en_status?: string | null;
};

/** 取已发布英文教程（en_status='published'），供 /en 列表与 sitemap。仅服务端。 */
export async function getPublishedEnglishTutorials(): Promise<EnglishTutorial[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('tutorials')
        .select('slug,title_en,summary_en,level,category,tags,estimated_minutes,en_status')
        .eq('en_status', 'published')
        .order('slug');
      if (!error && data) return data as EnglishTutorial[];
    } catch {
      // ignore
    }
  }
  return [];
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
        visibleOnly(sb.from('tutorials').select('*', { count: 'exact', head: true })),
        visibleOnly(sb.from('tutorials').select('*', { count: 'exact', head: true })).eq('is_featured', true),
        ...LEVELS.map((l) =>
          visibleOnly(sb.from('tutorials').select('*', { count: 'exact', head: true })).eq('level', l)
        ),
        ...CATS.map((c) =>
          visibleOnly(sb.from('tutorials').select('*', { count: 'exact', head: true })).eq('category', c)
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
      const { data, error } = await visibleOnly(
        getSupabaseAdmin().from('tutorials').select('*')
      )
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

/**
 * 按 slug 批量取教程，并保持传入 slug 的顺序返回（缺失的 slug 跳过）。
 * 用途：首页「热门指南」区块——人工策划一批 GSC 高曝光、排名 4-10 的页，
 * 从全站权重最高的首页直链它们，把排名往前 3 推。顺序即策划顺序。
 */
export async function getTutorialsBySlugs(slugs: string[]): Promise<Tutorial[]> {
  if (slugs.length === 0) return [];
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('tutorials')
        .select(TUTORIAL_LIST_COLUMNS)
        .in('slug', slugs);
      if (!error && data) {
        const bySlug = new Map((data as Tutorial[]).map((t) => [t.slug, t]));
        return slugs.map((s) => bySlug.get(s)).filter((t): t is Tutorial => Boolean(t));
      }
    } catch {
      // 失败则返回空，首页该区块自动不渲染
    }
  }
  return [];
}

/**
 * 相关教程（替换详情页此前"拉全量 2008 行再 slice 3"的做法）。
 * DB 端用 tags 重叠 + 同 category 取候选(各≤30)，应用层加权打分取 limit 篇。
 */
export async function getRelatedTutorials(
  current: { slug: string; category: string; tags: string[]; title: string },
  limit = 6
): Promise<Tutorial[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const queries: Promise<{ data: unknown[] | null }>[] = [];
      if (current.tags?.length)
        queries.push(
          visibleOnly(sb.from('tutorials').select(TUTORIAL_LIST_COLUMNS))
            .overlaps('tags', current.tags)
            .neq('slug', current.slug)
            .limit(30) as unknown as Promise<{ data: unknown[] | null }>
        );
      queries.push(
        visibleOnly(sb.from('tutorials').select(TUTORIAL_LIST_COLUMNS))
          .eq('category', current.category)
          .neq('slug', current.slug)
          .limit(30) as unknown as Promise<{ data: unknown[] | null }>
      );
      const results = await Promise.all(queries);
      const map = new Map<string, Record<string, unknown>>();
      for (const res of results)
        for (const r of (res.data ?? []) as Record<string, unknown>[])
          map.set(r.slug as string, r);
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
          .map((x) => ({ ...x.c, content: '' }) as unknown as Tutorial);
      }
    } catch {
      // 走下面的回退
    }
  }
  // 回退：取同类后切片
  const all = await getTutorials({ category: current.category });
  return all.filter((t) => t.slug !== current.slug).slice(0, limit);
}

/** 按 tags 重叠取教程（用于 news / mcp 等跨类型→教程的"延伸阅读"）。 */
export async function getTutorialsByTags(tags: string[], limit = 6): Promise<Tutorial[]> {
  if (!tags?.length) return [];
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await visibleOnly(
        getSupabaseAdmin().from('tutorials').select(TUTORIAL_LIST_COLUMNS)
      )
        .overlaps('tags', tags)
        .order('is_featured', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data) return data.map((t) => ({ ...t, content: '' }) as Tutorial);
    } catch {
      // ignore
    }
  }
  return [];
}

/** 查 related_tools 包含某工具(name 或 slug)的教程，用于 mcp 详情页"相关教程"。 */
export async function getTutorialsByTool(name: string, slug: string, limit = 4): Promise<Tutorial[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const [byName, bySlug] = await Promise.all([
        visibleOnly(sb.from('tutorials').select(TUTORIAL_LIST_COLUMNS)).contains('related_tools', [name]).limit(limit),
        visibleOnly(sb.from('tutorials').select(TUTORIAL_LIST_COLUMNS)).contains('related_tools', [slug]).limit(limit)
      ]);
      const map = new Map<string, Record<string, unknown>>();
      for (const r of [...(byName.data ?? []), ...(bySlug.data ?? [])] as Record<string, unknown>[])
        map.set(r.slug as string, r);
      return Array.from(map.values())
        .slice(0, limit)
        .map((t) => ({ ...t, content: '' }) as unknown as Tutorial);
    } catch {
      // ignore
    }
  }
  return [];
}

/**
 * 主题集群聚合：取命中某主题（tags 重叠 或 title 含关键词）的教程，用于 pillar 中心页。
 * tags 重叠用 .overlaps；标题用 .or(title.ilike.*token*)。合并去重后取 limit 篇。
 */
export async function getTutorialsByTopic(matchTokens: string[], limit = 100): Promise<Tutorial[]> {
  if (!matchTokens?.length) return [];
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const titleOr = matchTokens.map((t) => `title.ilike.*${t}*`).join(',');
      const [byTags, byTitle] = await Promise.all([
        visibleOnly(sb.from('tutorials').select(TUTORIAL_LIST_COLUMNS))
          .overlaps('tags', matchTokens)
          .order('is_featured', { ascending: false })
          .order('published_at', { ascending: false })
          .limit(limit),
        visibleOnly(sb.from('tutorials').select(TUTORIAL_LIST_COLUMNS))
          .or(titleOr)
          .order('is_featured', { ascending: false })
          .order('published_at', { ascending: false })
          .limit(limit)
      ]);
      const map = new Map<string, Record<string, unknown>>();
      for (const r of [...(byTags.data ?? []), ...(byTitle.data ?? [])] as Record<
        string,
        unknown
      >[])
        map.set(r.slug as string, r);
      return Array.from(map.values())
        .slice(0, limit)
        .map((t) => ({ ...t, content: '' }) as unknown as Tutorial);
    } catch {
      // ignore
    }
  }
  return [];
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
