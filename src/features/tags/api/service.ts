/**
 * 标签中枢页数据层：按 matchTokens 聚合教程 / MCP / Agent。
 * 服务端直查 Supabase（同 getTutorialsByTopic 的链路，Server Component 内使用，ISR 缓存）。
 * 可见性约定与全站一致：
 *  - 教程：published_at 非空（visibleOnly 约定，草稿/noindex 自然消失）
 *  - MCP/Agent 详情页：仅索引白名单内的做成内链（名单外的展示但不链接，见页面组件）
 */
import type { Tutorial } from '@/constants/mock-api-tutorials';
import type { McpServer } from '@/constants/mock-api-mcp';
import type { Agent } from '@/constants/mock-api-agents';

const TUTORIAL_COLUMNS =
  'id,slug,title,subtitle,summary,level,category,tags,estimated_minutes,is_featured,published_at,title_en,subtitle_en,summary_en,en_status';

/** 按标签 token 查教程：tags 重叠 + title 兜底（与 getTutorialsByTopic 同语义），published 可见 */
export async function getTutorialsByTagTokens(
  matchTokens: string[],
  limit = 60
): Promise<Tutorial[]> {
  if (!matchTokens?.length) return [];
  const { getSupabaseAdmin } = await import('@/lib/supabase');
  const sb = getSupabaseAdmin();
  const titleOr = matchTokens.map((t) => `title.ilike.*${t}*`).join(',');
  const base = () =>
    sb
      .from('tutorials')
      .select(TUTORIAL_COLUMNS)
      .not('published_at', 'is', null)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);
  const [byTags, byTitle] = await Promise.all([
    base().overlaps('tags', matchTokens),
    base().or(titleOr)
  ]);
  const map = new Map<string, Tutorial>();
  for (const r of [...(byTags.data ?? []), ...(byTitle.data ?? [])] as unknown as Tutorial[])
    map.set(r.slug, r);
  return Array.from(map.values()).slice(0, limit);
}

/** 按标签 token 查 MCP Server（stars 优先），标签页展示用 */
export async function getMcpByTagTokens(matchTokens: string[], limit = 24): Promise<McpServer[]> {
  if (!matchTokens?.length) return [];
  const { getSupabaseAdmin } = await import('@/lib/supabase');
  const { data } = await getSupabaseAdmin()
    .from('mcp_servers')
    .select(
      'id,slug,name,description,description_en,url,category,is_official,install_cmd,tags,stars,en_status'
    )
    .overlaps('tags', matchTokens)
    .order('stars', { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as McpServer[];
}

/** 按标签 token 查 Agent，标签页展示用 */
export async function getAgentsByTagTokens(matchTokens: string[], limit = 24): Promise<Agent[]> {
  if (!matchTokens?.length) return [];
  const { getSupabaseAdmin } = await import('@/lib/supabase');
  const { data } = await getSupabaseAdmin()
    .from('agents')
    .select(
      'id,name,description,description_en,url,agent_type,open_source,region,tags,is_featured,en_status'
    )
    .eq('status', 'published')
    .overlaps('tags', matchTokens)
    .order('is_featured', { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as Agent[];
}
