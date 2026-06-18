/**
 * POST /api/revalidate
 *
 * 主动刷新由外部任务（GitHub Actions 日更/周更）写库后产生的 ISR 页面。
 * news 由 wechat-news-daily 直接写 Supabase，不触发 Vercel 重新部署，
 * 因此 sitemap.xml 这类低流量 ISR 页迟迟不再生成、收录滞后一两天。
 * 跑完写库后调用本路由 revalidatePath，确保新文章当天进 sitemap。
 *
 * 安全：通过 X-Revalidate-Secret 头验证请求来源（与 REVALIDATE_SECRET 对比）。
 *
 * 请求（可选）：
 *   body { paths?: string[] }  —— 自定义要刷新的路径；缺省则刷新下方 DEFAULT_PATHS
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// 默认刷新集合：sitemap + 中英 news 列表（新文章入口）。
// sitemap.xml 是滞后重灾区；news 列表虽有流量通常自更，一并刷新做兜底。
const DEFAULT_PATHS = ['/sitemap.xml', '/news', '/en/news'];

export async function POST(request: NextRequest) {
  // ── 鉴权 ────────────────────────────────────────────────────────────────────
  const secret = process.env.REVALIDATE_SECRET ?? '';
  const incoming = request.headers.get('X-Revalidate-Secret') ?? '';
  if (!secret || incoming !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── 解析可选请求体 ───────────────────────────────────────────────────────────
  let paths = DEFAULT_PATHS;
  try {
    const body = (await request.json()) as { paths?: unknown };
    if (Array.isArray(body.paths) && body.paths.length > 0) {
      const custom = body.paths.filter(
        (p): p is string => typeof p === 'string' && p.startsWith('/')
      );
      if (custom.length > 0) paths = custom;
    }
  } catch {
    // 无请求体或非 JSON：用默认路径
  }

  // ── 刷新 ────────────────────────────────────────────────────────────────────
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ revalidated: true, paths, now: Date.now() });
}
