// Supabase PostgREST 助手 —— 零依赖。service_role key 读 env，绕过 RLS。
// 写 tutorials 表：幂等 upsert（slug 已存在则 PATCH，否则 POST）。

import { requireEnv } from './env.mjs'

function conn() {
  const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  return {
    base,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  }
}

/** 拉取 tutorials 全部 slug（分页），用于合成阶段查重 */
export async function fetchAllSlugs() {
  const { base, headers } = conn()
  const slugs = new Set()
  let offset = 0
  for (;;) {
    const r = await fetch(`${base}/rest/v1/tutorials?select=slug&order=slug&offset=${offset}&limit=1000`, { headers })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error('fetchAllSlugs 失败: ' + JSON.stringify(rows).slice(0, 200))
    for (const row of rows) slugs.add(row.slug)
    if (rows.length < 1000) break
    offset += 1000
  }
  return slugs
}

/** 某 slug 是否已存在 */
export async function slugExists(slug) {
  const { base, headers } = conn()
  const r = await fetch(`${base}/rest/v1/tutorials?select=slug&slug=eq.${encodeURIComponent(slug)}&limit=1`, { headers })
  const rows = await r.json()
  return Array.isArray(rows) && rows.length > 0
}

/**
 * 幂等写入一篇教程。
 * @param {object} row  { slug, title, subtitle, summary, content, level, category, tags, estimated_minutes, is_featured, published_at }
 *   published_at 传 null = 草稿（站内不可见）；不传 = 用 DB 默认 now()（直接可见）。
 * @returns {'inserted'|'updated'}
 */
export async function upsertTutorial(row) {
  const { base, headers } = conn()
  const exists = await slugExists(row.slug)
  if (exists) {
    const r = await fetch(`${base}/rest/v1/tutorials?slug=eq.${encodeURIComponent(row.slug)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(row)
    })
    if (!r.ok) throw new Error(`PATCH 失败 ${r.status}: ${(await r.text()).slice(0, 200)}`)
    return 'updated'
  }
  const r = await fetch(`${base}/rest/v1/tutorials`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(row)
  })
  if (!r.ok) throw new Error(`POST 失败 ${r.status}: ${(await r.text()).slice(0, 200)}`)
  return 'inserted'
}
