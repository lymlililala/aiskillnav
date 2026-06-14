import { fakeMcpServers } from '@/constants/mock-api-mcp';
import type { McpServer, McpCategory } from '@/constants/mock-api-mcp';

export type { McpServer, McpCategory };
export type CreateMcpPayload = Omit<McpServer, 'id' | 'created_at'>;
export type UpdateMcpPayload = Partial<CreateMcpPayload>;

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

export async function getMcpServers(opts: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  is_official?: boolean;
}) {
  const params = new URLSearchParams();
  if (opts.page) params.set('page', String(opts.page));
  if (opts.limit) params.set('limit', String(opts.limit));
  if (opts.search) params.set('search', opts.search);
  if (opts.category && opts.category !== 'all') params.set('category', opts.category);
  if (opts.is_official !== undefined) params.set('is_official', String(opts.is_official));

  const data = await safeFetch<{ items: McpServer[]; total_items: number }>(
    `${apiBase()}/mcp?${params}`
  );
  if (!data) return fakeMcpServers.getMcpServers(opts);
  return data;
}

export async function getFeaturedMcpServers(): Promise<McpServer[]> {
  const data = await safeFetch<McpServer[]>(`${apiBase()}/mcp?action=featured`);
  if (!data) return fakeMcpServers.getFeatured();
  return data;
}

export async function getMcpStats() {
  const data = await safeFetch<{
    total: number;
    official: number;
    featured: number;
    byCategory: Record<string, number>;
  }>(`${apiBase()}/mcp?action=stats`);
  if (!data) return fakeMcpServers.getStats();
  return data;
}

export async function getMcpById(id: number): Promise<McpServer | null> {
  return safeFetch<McpServer>(`${apiBase()}/mcp/${id}`);
}

export async function getMcpBySlug(slug: string): Promise<McpServer | null> {
  // 服务端直查 DB（与 sitemap 同源），避免 SSR 期间 HTTP 自调用超时回退 mock 导致详情页 404
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('mcp_servers')
        .select('*')
        .eq('slug', slug)
        .limit(1);
      if (!error) return (data?.[0] as McpServer) ?? null;
    } catch {
      // 走下面的 API/mock 回退
    }
  }
  const data = await safeFetch<McpServer>(`${apiBase()}/mcp?slug=${encodeURIComponent(slug)}`);
  if (!data) return fakeMcpServers.getBySlug(slug);
  return data;
}

export async function getAllMcpServers(): Promise<McpServer[]> {
  const data = await safeFetch<{ items: McpServer[]; total_items: number }>(
    `${apiBase()}/mcp?limit=100`
  );
  if (!data) {
    const result = await fakeMcpServers.getMcpServers({ limit: 100 });
    return result.items;
  }
  return data.items;
}

/** 相关 MCP server（mcp 详情页此前无相关推荐）。tags 重叠 + 同 category 候选 + 打分。 */
export async function getRelatedMcp(
  current: { slug: string; category: string; tags: string[] },
  limit = 6
): Promise<McpServer[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const queries: Promise<{ data: unknown[] | null }>[] = [];
      if (current.tags?.length)
        queries.push(
          sb
            .from('mcp_servers')
            .select('*')
            .overlaps('tags', current.tags)
            .neq('slug', current.slug)
            .limit(30) as unknown as Promise<{ data: unknown[] | null }>
        );
      queries.push(
        sb
          .from('mcp_servers')
          .select('*')
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
            s: relatednessScore(
              { tags: current.tags, category: current.category },
              { tags: c.tags as string[], category: c.category as string }
            )
          }))
          .sort((x, y) => y.s - x.s)
          .slice(0, limit)
          .map((x) => x.c as unknown as McpServer);
      }
    } catch {
      // ignore
    }
  }
  return [];
}

/**
 * 返回 工具名/slug(均小写) → 真实 slug 的映射，用于把 tutorials.related_tools
 * 映射成 /mcp/{slug} 内链。直查 DB 分页取全量（mcp 已超 1000 条），替代 HTTP 自调用。
 */
export async function getMcpSlugSet(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const PAGE = 1000;
      let offset = 0;
      while (true) {
        const { data, error } = await sb
          .from('mcp_servers')
          .select('slug, name')
          .range(offset, offset + PAGE - 1);
        if (error || !data || data.length === 0) break;
        for (const r of data as { slug?: string; name?: string }[]) {
          if (r.slug) {
            map.set(r.slug.toLowerCase(), r.slug);
            if (r.name) map.set(r.name.toLowerCase(), r.slug);
          }
        }
        if (data.length < PAGE) break;
        offset += PAGE;
      }
    } catch {
      // ignore
    }
  }
  return map;
}

export async function createMcpServer(payload: CreateMcpPayload): Promise<McpServer> {
  const res = await fetch(`${apiBase()}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create MCP server: ${res.statusText}`);
  return res.json() as Promise<McpServer>;
}

export async function updateMcpServer(
  id: number,
  payload: UpdateMcpPayload
): Promise<McpServer | null> {
  return safeFetch<McpServer>(`${apiBase()}/mcp/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteMcpServer(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/mcp/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

/** 已发布英文 MCP servers（description_en 就绪），供 /en/mcp 列表。分页取全量。 */
export async function getPublishedEnglishMcp(): Promise<
  (McpServer & { description_en?: string | null })[]
> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const all: (McpServer & { description_en?: string | null })[] = [];
      const PAGE = 1000;
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await sb
          .from('mcp_servers')
          .select('*')
          .eq('en_status', 'published')
          .order('slug')
          .range(from, from + PAGE - 1);
        if (error || !data || data.length === 0) break;
        all.push(...(data as (McpServer & { description_en?: string | null })[]));
        if (data.length < PAGE) break;
      }
      return all;
    } catch {
      // ignore
    }
  }
  return [];
}
