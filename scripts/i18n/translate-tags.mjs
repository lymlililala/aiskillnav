// 翻译目录类表的 tags → tags_en（中文标签译英文；纯英文标签直接复制）。
// 前置：先在 Supabase 执行 ALTER TABLE ... ADD COLUMN tags_en text[]。
// 用法：
//   node scripts/i18n/translate-tags.mjs --scan
//   node scripts/i18n/translate-tags.mjs --all [--limit N]
//   node scripts/i18n/translate-tags.mjs --table agents

import { DeepSeek } from '../wechat/deepseek.mjs'
import { requireEnv } from '../wechat/lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const SCAN = process.argv.includes('--scan')
const ALL = process.argv.includes('--all')
const ONE = arg('--table', null)
const LIMIT = arg('--limit', null) ? Number(arg('--limit', null)) : null

// 卡片会渲染 tags 的目录类表
const TABLES = {
  skill_tools: { idCol: 'id', visible: '' },
  agents: { idCol: 'id', visible: 'status=eq.published' },
  mcp_servers: { idCol: 'id', visible: '' },
  use_cases: { idCol: 'id', visible: 'published_at=not.is.null' }
}

const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }
const sleep = ms => new Promise(r => setTimeout(r, ms))
async function rfetch(url, opts, tries = 4) {
  let last
  for (let i = 0; i < tries; i++) { try { return await fetch(url, opts) } catch (e) { last = e; await sleep(1500 * (i + 1)) } }
  throw last
}
const cjk = s => ((String(s ?? '')).match(/[一-鿿]/g) || []).length
const tagsCjk = tags => (tags || []).reduce((n, t) => n + cjk(t), 0)

async function fetchRows(table, cfg) {
  const out = []
  let off = 0
  for (;;) {
    const filter = cfg.visible ? `&${cfg.visible}` : ''
    const r = await rfetch(`${base}/rest/v1/${table}?select=${cfg.idCol},tags,tags_en${filter}&order=${cfg.idCol}&offset=${off}&limit=1000`, { headers: H })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error(JSON.stringify(rows).slice(0, 160))
    out.push(...rows); if (rows.length < 1000) break; off += 1000
  }
  return out
}
async function patch(table, cfg, id, fields) {
  const r = await rfetch(`${base}/rest/v1/${table}?${cfg.idCol}=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(fields)
  })
  if (!r.ok) throw new Error(`PATCH ${r.status}: ${(await r.text()).slice(0, 150)}`)
}

const ds = new DeepSeek({ timeoutMs: 60000 })

// 收集一批唯一中文 tag，一次请求翻译，返回 {中文tag: English}
async function translateTagSet(tags) {
  const sys = `You translate short UI TAG/label words from Chinese to natural concise English for an English website.
Rules:
1. Each tag is a short category/skill label (e.g. 简历 → Resume, 关键词匹配 → Keyword Matching, 世界观 → Worldbuilding, 人物设定 → Character Design).
2. Keep it short (1-3 words), Title Case, no quotes, no trailing punctuation.
3. Keep brand/product names as-is (Coze, Dify, GitHub...).
4. Output MUST be 100% English — no Chinese characters.
Return ONLY a JSON object mapping each input tag to its English: {"中文":"English", ...}.`
  return ds.chatJSON(
    [{ role: 'system', content: sys }, { role: 'user', content: JSON.stringify(tags) }],
    { maxTokens: 3000, temperature: 0.2 }
  )
}

async function run(table) {
  const cfg = TABLES[table]
  const rows = await fetchRows(table, cfg)
  // 需处理：tags_en 为空，或 tags_en 仍含中文
  const need = rows.filter(r => {
    const tags = r.tags || []
    if (tags.length === 0) return false
    return !r.tags_en || r.tags_en.length !== tags.length || tagsCjk(r.tags_en) >= 1
  })
  console.log(`[${table}] 共 ${rows.length}，待补 tags_en ${need.length}`)
  if (SCAN) return { table, total: rows.length, need: need.length }

  // 全局唯一中文 tag → 英文 的缓存（跨行复用，省调用）
  const cnTagSet = new Set()
  for (const r of need) for (const t of (r.tags || [])) if (cjk(t) >= 1) cnTagSet.add(t)
  const allCn = [...cnTagSet]
  const dict = {}
  for (let i = 0; i < allCn.length; i += 40) {
    const batch = allCn.slice(i, i + 40)
    try {
      const map = await translateTagSet(batch)
      for (const t of batch) { const en = map[t]; if (en && cjk(en) < 1) dict[t] = en }
    } catch (e) { console.log(`✗ tag batch@${i}: ${e.message}`) }
  }
  console.log(`  中文 tag 词典：${Object.keys(dict).length}/${allCn.length} 译出`)

  let targets = need
  if (LIMIT) targets = targets.slice(0, LIMIT)
  let ok = 0, fail = 0
  for (const r of targets) {
    const tags_en = (r.tags || []).map(t => (cjk(t) >= 1 ? (dict[t] ?? t) : t))
    // 若仍有中文未译出，跳过（下次再试）
    if (tagsCjk(tags_en) >= 1) { fail++; continue }
    try { await patch(table, cfg, r[cfg.idCol], { tags_en }); ok++ } catch (e) { fail++; console.log(`✗ ${r[cfg.idCol]}: ${e.message}`) }
  }
  console.log(`[${table}] 完成：补 ${ok}，失败 ${fail}\n`)
  return { table, total: rows.length, fixed: ok, fail }
}

const list = (SCAN || ALL) ? Object.keys(TABLES) : (ONE ? [ONE] : null)
if (!list) { console.error('需 --scan | --all | --table <name>'); process.exit(1) }
if (ONE && !TABLES[ONE]) { console.error(`未知表 ${ONE}`); process.exit(1) }

const summary = []
for (const t of list) summary.push(await run(t))
console.log('\n=== 汇总 ===')
for (const s of summary) console.log(JSON.stringify(s))
if (!SCAN) console.log('用量:', ds.costEstimate())
