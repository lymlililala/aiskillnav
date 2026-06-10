import { fakeAgents } from '@/constants/mock-api-agents';
import type {
  Agent,
  AgentFilters,
  AgentsResponse,
  AgentStats,
  CreateAgentPayload,
  UpdateAgentPayload
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

/** 服务端直查 Supabase 取列表（与 /api/agents 的 GET 逻辑一致），
 *  避免 SSR 自调 /api 超时回退 mock，导致与详情页（直查 DB）数据不一致。 */
async function getAgentsDirect(filters: AgentFilters): Promise<AgentsResponse | null> {
  const { getSupabaseAdmin } = await import('@/lib/supabase');
  const sb = getSupabaseAdmin();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const status = filters.status ?? 'published';

  let query = sb.from('agents').select('*', { count: 'exact' });
  if (status && status !== 'all') query = query.eq('status', status);
  if (filters.agent_type && filters.agent_type !== 'all')
    query = query.eq('agent_type', filters.agent_type);
  if (filters.open_source && filters.open_source !== 'all')
    query = query.eq('open_source', filters.open_source);
  if (filters.url_group) query = query.eq('url_group', Number(filters.url_group));
  if (filters.search)
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

  if (filters.sort) {
    try {
      const s = JSON.parse(filters.sort) as { id: string; desc: boolean }[];
      if (s.length > 0) query = query.order(s[0].id, { ascending: !s[0].desc });
    } catch {
      /* ignore */
    }
  } else {
    query = query
      .order('url_group', { ascending: true })
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);
  if (error) return null;
  const items = (data ?? []) as Agent[];

  let group_counts = {
    app: items.filter((a) => !a.url.includes('github.com') && a.url !== '#').length,
    github: items.filter((a) => a.url.includes('github.com')).length,
    inner: items.filter((a) => a.url === '#').length
  };
  if ((count ?? 0) > limit) {
    let cq = sb.from('agents').select('url', { count: 'exact', head: false });
    if (status && status !== 'all') cq = cq.eq('status', status);
    if (filters.agent_type && filters.agent_type !== 'all')
      cq = cq.eq('agent_type', filters.agent_type);
    if (filters.open_source && filters.open_source !== 'all')
      cq = cq.eq('open_source', filters.open_source);
    if (filters.search)
      cq = cq.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    const { data: allData } = await cq;
    if (allData) {
      const rows = allData as { url: string }[];
      group_counts = {
        app: rows.filter((a) => !a.url.includes('github.com') && a.url !== '#').length,
        github: rows.filter((a) => a.url.includes('github.com')).length,
        inner: rows.filter((a) => a.url === '#').length
      };
    }
  }
  return { items, total_items: count ?? 0, group_counts };
}

export async function getAgents(filters: AgentFilters): Promise<AgentsResponse> {
  if (typeof window === 'undefined') {
    try {
      const direct = await getAgentsDirect(filters);
      if (direct) return direct;
    } catch {
      // 走回退
    }
  }
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.agent_type && filters.agent_type !== 'all')
    params.set('agent_type', filters.agent_type);
  if (filters.open_source && filters.open_source !== 'all')
    params.set('open_source', filters.open_source);
  if (filters.url_group) params.set('url_group', filters.url_group);
  if (filters.status) params.set('status', filters.status);
  if (filters.sort) params.set('sort', filters.sort);

  const data = await safeFetch<AgentsResponse>(`${apiBase()}/agents?${params}`);
  if (!data) return fakeAgents.getAgents(filters);
  return data;
}

export async function getFeaturedAgents(): Promise<Agent[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('agents')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(8);
      if (!error && data) return data as Agent[];
    } catch {
      // 走回退
    }
  }
  const data = await safeFetch<Agent[]>(`${apiBase()}/agents?action=featured`);
  if (!data) return fakeAgents.getFeaturedAgents();
  return data;
}

export async function getAgentById(id: number): Promise<Agent | null> {
  return safeFetch<Agent>(`${apiBase()}/agents/${id}`);
}

export async function getAgentStats(): Promise<AgentStats> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin().from('agents').select('*');
      if (!error && data) {
        const all = data as Agent[];
        const published = all.filter((a) => a.status === 'published');
        const byType = published.reduce(
          (acc, a) => {
            acc[a.agent_type] = (acc[a.agent_type] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        return {
          total: published.length,
          featured: published.filter((a) => a.is_featured).length,
          pending: all.filter((a) => a.status === 'pending').length,
          rejected: all.filter((a) => a.status === 'rejected').length,
          openCount: published.filter((a) => a.open_source === 'open').length,
          byType
        };
      }
    } catch {
      // 走回退
    }
  }
  const data = await safeFetch<AgentStats>(`${apiBase()}/agents?action=stats`);
  if (!data) return fakeAgents.getStats();
  return data;
}

/** 按 slugify(name) 取 agent（过滤 published；表小，全量后匹配）。 */
export async function getAgentBySlug(rawSlug: string): Promise<Agent | null> {
  const { slugify } = await import('@/lib/slug');
  // 生产环境 params.slug 对非 ASCII（中文）可能是 percent-encoded，
  // 与已解码的 slugify(name) 直接比会全部 404；先解码再过一遍 slugify 对齐。
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {
    // rawSlug 含非法转义序列则保持原值
  }
  const slug = slugify(decoded);
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('agents')
        .select('*')
        .eq('status', 'published');
      if (!error && data) return (data as Agent[]).find((a) => slugify(a.name) === slug) ?? null;
    } catch {
      // 走回退
    }
  }
  const resp = await getAgents({ status: 'published', limit: 500 });
  return resp.items.find((a) => slugify(a.name) === slug) ?? null;
}

/** 相关 agent（同 agent_type，按 slug 去重避免重名）。 */
export async function getRelatedAgents(
  current: { id: number; agent_type: string },
  limit = 6
): Promise<Agent[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { slugify } = await import('@/lib/slug');
      const { data, error } = await getSupabaseAdmin()
        .from('agents')
        .select('*')
        .eq('status', 'published')
        .eq('agent_type', current.agent_type)
        .neq('id', current.id)
        .limit(limit + 8);
      if (!error && data) {
        const seen = new Set<string>();
        const out: Agent[] = [];
        for (const a of data as Agent[]) {
          const s = slugify(a.name);
          if (seen.has(s)) continue;
          seen.add(s);
          out.push(a);
          if (out.length >= limit) break;
        }
        return out;
      }
    } catch {
      // ignore
    }
  }
  return [];
}

/** name(小写) → slugify(name) 映射，供 usecases.tools 映射成 /agents/{slug} 内链。 */
export async function getAgentSlugSet(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { slugify } = await import('@/lib/slug');
      const { data, error } = await getSupabaseAdmin()
        .from('agents')
        .select('name')
        .eq('status', 'published');
      if (!error && data)
        for (const r of data as { name: string }[])
          if (r.name) map.set(r.name.toLowerCase(), slugify(r.name));
    } catch {
      // ignore
    }
  }
  return map;
}

export async function createAgent(payload: CreateAgentPayload): Promise<Agent> {
  const res = await fetch(`${apiBase()}/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create agent: ${res.statusText}`);
  return res.json() as Promise<Agent>;
}

export async function updateAgent(id: number, payload: UpdateAgentPayload): Promise<Agent | null> {
  return safeFetch<Agent>(`${apiBase()}/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteAgent(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/agents/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function reviewAgent(
  id: number,
  action: 'approve' | 'reject',
  note?: string
): Promise<Agent | null> {
  const status = action === 'approve' ? 'published' : 'rejected';
  return updateAgent(id, { status, review_note: note });
}
