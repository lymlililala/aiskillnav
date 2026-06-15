import { fakeUseCases } from '@/constants/mock-api-usecases';
import type { UseCase, UseCaseIndustry, UseCaseDifficulty } from '@/constants/mock-api-usecases';

export type { UseCase, UseCaseIndustry, UseCaseDifficulty };
export type CreateUseCasePayload = Omit<UseCase, 'id'>;
export type UpdateUseCasePayload = Partial<CreateUseCasePayload>;

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

export async function getUseCases(
  opts: {
    industry?: string;
    difficulty?: number;
    search?: string;
  } = {}
): Promise<UseCase[]> {
  const params = new URLSearchParams();
  if (opts.search) params.set('search', opts.search);
  if (opts.industry && opts.industry !== 'all') params.set('industry', opts.industry);
  if (opts.difficulty && opts.difficulty > 0) params.set('difficulty', String(opts.difficulty));

  const data = await safeFetch<UseCase[]>(`${apiBase()}/usecases?${params}`);
  if (!data) return fakeUseCases.getUseCases(opts);
  return data;
}

export async function getFeaturedUseCases(): Promise<UseCase[]> {
  const data = await safeFetch<UseCase[]>(`${apiBase()}/usecases?action=featured`);
  if (!data) return fakeUseCases.getFeatured();
  return data;
}

export async function getUseCaseStats() {
  const data = await safeFetch<{
    total: number;
    featured: number;
    byIndustry: Record<string, number>;
  }>(`${apiBase()}/usecases?action=stats`);
  if (!data) return fakeUseCases.getStats();
  return data;
}

/** 按 id 取单条用例（详情页用）。route 已支持，这里服务端直查 + 回退。 */
export async function getUseCaseById(id: number): Promise<UseCase | null> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('use_cases')
        .select('*')
        .eq('id', id)
        .limit(1);
      if (!error) return (data?.[0] as UseCase) ?? null;
    } catch {
      // 走回退
    }
  }
  const data = await safeFetch<UseCase>(`${apiBase()}/usecases/${id}`);
  if (data) return data;
  const all = await getUseCases();
  return all.find((u) => u.id === id) ?? null;
}

/** 相关用例（同 industry）。 */
export async function getRelatedUseCases(
  current: { id: number; industry: string },
  limit = 6
): Promise<UseCase[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('use_cases')
        .select('*')
        .eq('industry', current.industry)
        .neq('id', current.id)
        .not('published_at', 'is', null)
        .limit(limit);
      if (!error && data) return data as UseCase[];
    } catch {
      // 走回退
    }
  }
  const all = await getUseCases({ industry: current.industry });
  return all.filter((u) => u.id !== current.id).slice(0, limit);
}

/** 推荐了某工具的用例（tools 数组包含 tool），供 agents/models 详情页"关联用例"反查。 */
export async function getUseCasesByTool(tool: string, limit = 6): Promise<UseCase[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('use_cases')
        .select('*')
        .contains('tools', [tool])
        .not('published_at', 'is', null)
        .limit(limit);
      if (!error && data) return data as UseCase[];
    } catch {
      // ignore
    }
  }
  return [];
}

/** 英文 use_case 字段（_en 列） */
export type EnglishUseCase = UseCase & {
  title_en?: string | null;
  description_en?: string | null;
  steps_en?: string[] | null;
  tags_en?: string[] | null;
  en_status?: string | null;
};

/** 已发布英文 use_cases（en_status='published'），供 /en/usecases 列表与 sitemap。 */
export async function getPublishedEnglishUseCases(): Promise<EnglishUseCase[]> {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const { data, error } = await getSupabaseAdmin()
        .from('use_cases')
        .select(
          'id,title_en,description_en,steps_en,industry,difficulty,tools,tags,tags_en,estimated_time,en_status'
        )
        .eq('en_status', 'published')
        .not('published_at', 'is', null)
        .order('id');
      if (!error && data) return data as EnglishUseCase[];
    } catch {
      // ignore
    }
  }
  return [];
}

export async function createUseCase(payload: CreateUseCasePayload): Promise<UseCase> {
  const res = await fetch(`${apiBase()}/usecases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create use case: ${res.statusText}`);
  return res.json() as Promise<UseCase>;
}

export async function updateUseCase(
  id: number,
  payload: UpdateUseCasePayload
): Promise<UseCase | null> {
  return safeFetch<UseCase>(`${apiBase()}/usecases/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteUseCase(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/usecases/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
