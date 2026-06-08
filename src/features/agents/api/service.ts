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

export async function getAgents(filters: AgentFilters): Promise<AgentsResponse> {
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
  const data = await safeFetch<Agent[]>(`${apiBase()}/agents?action=featured`);
  if (!data) return fakeAgents.getFeaturedAgents();
  return data;
}

export async function getAgentById(id: number): Promise<Agent | null> {
  return safeFetch<Agent>(`${apiBase()}/agents/${id}`);
}

export async function getAgentStats(): Promise<AgentStats> {
  const data = await safeFetch<AgentStats>(`${apiBase()}/agents?action=stats`);
  if (!data) return fakeAgents.getStats();
  return data;
}

/** 按 slugify(name) 取 agent（过滤 published；表小，全量后匹配）。 */
export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const { slugify } = await import('@/lib/slug');
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
