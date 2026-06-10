import { fakeModels } from '@/constants/mock-api-models';
import type { AiModel, Benchmark } from '@/constants/mock-api-models';

export type { AiModel, Benchmark };
export type CreateModelPayload = Omit<AiModel, 'id'>;
export type UpdateModelPayload = Partial<CreateModelPayload>;

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

export async function getModels(
  opts: {
    search?: string;
    vendor?: string;
    is_open_source?: boolean;
  } = {}
): Promise<AiModel[]> {
  // 服务端直查 DB：确保列表显示最新模型 + 按能力排序（reasoning→code→release_date），
  // 不受 HTTP 自调用超时/回退 mock 影响。
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      let q = getSupabaseAdmin().from('ai_models').select('*');
      if (opts.vendor && opts.vendor !== 'all') q = q.eq('vendor', opts.vendor);
      if (opts.is_open_source !== undefined) q = q.eq('is_open_source', opts.is_open_source);
      if (opts.search)
        q = q.or(
          `name.ilike.%${opts.search}%,description.ilike.%${opts.search}%,vendor.ilike.%${opts.search}%`
        );
      const { data, error } = await q
        .order('reasoning_score', { ascending: false })
        .order('code_score', { ascending: false })
        .order('release_date', { ascending: false, nullsFirst: false });
      if (!error && data) return data as AiModel[];
    } catch {
      // 走下面的回退
    }
  }

  const params = new URLSearchParams();
  if (opts.search) params.set('search', opts.search);
  if (opts.vendor && opts.vendor !== 'all') params.set('vendor', opts.vendor);
  if (opts.is_open_source !== undefined) params.set('is_open_source', String(opts.is_open_source));

  const data = await safeFetch<AiModel[]>(`${apiBase()}/models?${params}`);
  if (!data) return fakeModels.getModels(opts);
  return data;
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  const data = await safeFetch<Benchmark[]>(`${apiBase()}/models?action=benchmarks`);
  if (!data) return fakeModels.getBenchmarks();
  return data;
}

export async function getModelStats() {
  const data = await safeFetch<{
    total: number;
    openSource: number;
    multimodal: number;
    vendors: number;
  }>(`${apiBase()}/models?action=stats`);
  if (!data) return fakeModels.getStats();
  return data;
}

/** 向后兼容的同步方法 */
export function getAllBenchmarks(): Benchmark[] {
  return [];
}

export async function getModelById(id: number): Promise<AiModel | null> {
  return safeFetch<AiModel>(`${apiBase()}/models/${id}`);
}

/** 按 slugify(name) 取模型（表小，全量拉取后匹配）。 */
export async function getModelBySlug(rawSlug: string): Promise<AiModel | null> {
  const { slugify } = await import('@/lib/slug');
  // params.slug 对非 ASCII（中文）在生产可能是 percent-encoded，先解码再 slugify 对齐
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {
    // 含非法转义序列则保持原值
  }
  const slug = slugify(decoded);
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin().from('ai_models').select('*');
      if (!error && data) return (data as AiModel[]).find((m) => slugify(m.name) === slug) ?? null;
    } catch {
      // 走回退
    }
  }
  const all = await getModels();
  return all.find((m) => slugify(m.name) === slug) ?? null;
}

/** 相关模型：同 vendor 或 model_type 重叠。 */
export async function getRelatedModels(
  current: { id: number; vendor: string; model_type: string[] },
  limit = 6
): Promise<AiModel[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const sb = getSupabaseAdmin();
      const queries: Promise<{ data: unknown[] | null }>[] = [
        sb
          .from('ai_models')
          .select('*')
          .eq('vendor', current.vendor)
          .neq('id', current.id)
          .limit(30) as unknown as Promise<{ data: unknown[] | null }>
      ];
      if (current.model_type?.length)
        queries.push(
          sb
            .from('ai_models')
            .select('*')
            .overlaps('model_type', current.model_type)
            .neq('id', current.id)
            .limit(30) as unknown as Promise<{ data: unknown[] | null }>
        );
      const results = await Promise.all(queries);
      const map = new Map<number, AiModel>();
      for (const res of results)
        for (const r of (res.data ?? []) as AiModel[]) map.set(r.id, r);
      return Array.from(map.values()).slice(0, limit);
    } catch {
      // 走回退
    }
  }
  const all = await getModels({ vendor: current.vendor });
  return all.filter((m) => m.id !== current.id).slice(0, limit);
}

/** 取某系列的全部版本（用于系列对比页）。复用 getModels（已直查 + 按能力排序），应用层按系列正则过滤。 */
export async function getModelsBySeries(slug: string): Promise<AiModel[]> {
  const { getModelSeriesBySlug } = await import('@/features/models/series');
  const series = getModelSeriesBySlug(slug);
  if (!series) return [];
  const all = await getModels();
  return all.filter((m) => series.match.test(m.name));
}

export async function createModel(payload: CreateModelPayload): Promise<AiModel> {
  const res = await fetch(`${apiBase()}/models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create model: ${res.statusText}`);
  return res.json() as Promise<AiModel>;
}

export async function updateModel(
  id: number,
  payload: UpdateModelPayload
): Promise<AiModel | null> {
  return safeFetch<AiModel>(`${apiBase()}/models/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteModel(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/models/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
