// wx_sources 表读写 —— 采集的公众号原文持久化层（跨 CI 运行保留）。
// 日更只爬当天新文写入；周更直接读时间窗口，无需重爬。零依赖 PostgREST。

import { requireEnv } from './env.mjs'

function conn() {
  const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  return { base, headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` } }
}

/** 取库中已有的全部 sn（用于爬取前去重，避免重复拉正文花钱） */
export async function existingSns() {
  const { base, headers } = conn()
  const sns = new Set()
  let offset = 0
  for (;;) {
    const r = await fetch(`${base}/rest/v1/wx_sources?select=sn&order=sn&offset=${offset}&limit=1000`, { headers })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error('existingSns 失败: ' + JSON.stringify(rows).slice(0, 200))
    for (const row of rows) sns.add(row.sn)
    if (rows.length < 1000) break
    offset += 1000
  }
  return sns
}

/** 批量 upsert 源文（按 sn 主键去重，冲突则更新）。分批避免单请求过大。 */
export async function upsertSources(rows) {
  if (!rows.length) return 0
  const { base, headers } = conn()
  let n = 0
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100)
    const r = await fetch(`${base}/rest/v1/wx_sources?on_conflict=sn`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(batch)
    })
    if (!r.ok) throw new Error(`upsertSources 失败 ${r.status}: ${(await r.text()).slice(0, 200)}`)
    n += batch.length
  }
  return n
}

/**
 * 读取最近 N 天、含正文的源文（供 cluster/synthesize/news/usecases 使用）。
 * @param {object} [opts] { sinceDays=7, minBodyLen=150 }
 * @returns 形如旧 sources.json 的数组：{ sn, account, wxid, title, digest, content_url, published_at, body_text }
 */
export async function fetchSources({ sinceDays = 7, minBodyLen = 150 } = {}) {
  const { base, headers } = conn()
  const since = new Date(Date.now() - sinceDays * 86400 * 1000).toISOString()
  const out = []
  let offset = 0
  for (;;) {
    const url = `${base}/rest/v1/wx_sources?select=*&published_at=gte.${encodeURIComponent(since)}&order=published_at.desc&offset=${offset}&limit=1000`
    const r = await fetch(url, { headers })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error('fetchSources 失败: ' + JSON.stringify(rows).slice(0, 200))
    out.push(...rows)
    if (rows.length < 1000) break
    offset += 1000
  }
  return out.filter(s => s.body_text && s.body_text.length >= minBodyLen)
}
