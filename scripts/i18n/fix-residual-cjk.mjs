// 扫描所有 _en 字段里残留中文的记录并从源中文列重新补译。
// 根因：migrate-content 的“已完成”判断只看 en_status+非空，不校验 _en 是否仍含中文，
// 导致 DeepSeek 偶发吐出中文/半中文的行被标记完成并跳过。
// 用法：
//   node scripts/i18n/fix-residual-cjk.mjs --scan                 # 全表只扫描报数
//   node scripts/i18n/fix-residual-cjk.mjs --table news           # 修单表
//   node scripts/i18n/fix-residual-cjk.mjs --all [--limit N]      # 修全表
//   --threshold N  判定残留中文的 CJK 字数阈值（默认 4）

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
const THRESH = arg('--threshold', null) ? Number(arg('--threshold', null)) : 4

// 表配置：idCol 主键、txt 文本字段对 [zh, en]、arr 数组字段对、visible 过滤
const CFG = {
  news: {
    idCol: 'slug',
    txt: [['title', 'title_en'], ['summary', 'summary_en']], arr: [],
    visible: 'status=eq.published',
    select: 'slug,title,summary,title_en,summary_en,en_status'
  },
  use_cases: {
    idCol: 'id',
    txt: [['title', 'title_en'], ['description', 'description_en']], arr: [['steps', 'steps_en']],
    visible: 'published_at=not.is.null',
    select: 'id,title,description,steps,title_en,description_en,steps_en,en_status'
  },
  tutorials: {
    idCol: 'slug',
    txt: [['title', 'title_en'], ['summary', 'summary_en'], ['content', 'content_en']], arr: [],
    visible: '',
    select: 'slug,title,summary,content,title_en,summary_en,content_en,en_status'
  },
  skills: { idCol: 'id', txt: [['description', 'description_en']], arr: [], visible: 'status=eq.published', select: 'id,description,description_en,en_status' },
  skill_tools: { idCol: 'id', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' },
  agents: { idCol: 'id', txt: [['description', 'description_en']], arr: [], visible: 'status=eq.published', select: 'id,description,description_en,en_status' },
  mcp_servers: { idCol: 'id', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' },
  ai_models: { idCol: 'id', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' },
  benchmarks: { idCol: 'id', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' }
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
// 数组字段的 CJK：拼接元素后计数
const cjkAny = v => Array.isArray(v) ? cjk(v.join(' ')) : cjk(v)

// 白名单：这些 tutorials 的 content_en 已是合格英文译文，残留中文是正文里
// 故意保留的示例（代码中文列名 / 翻译对照表 / 中文 prompt 示例 / 中英混说演示句），
// 翻译掉反而破坏教学内容，跳过不再误报。
const SKIP_SLUGS = new Set([
  'ai-quantitative-trading-strategy-2026',      // 代码示例含中文列名 df['日期']
  'ai-translation-professional-workflow-2026',  // 翻译对照表故意保留中文
  'midjourney-v7-complete-guide-2026',          // 中文 prompt 示例（穿汉服…）
  'multilingual-asr-speech-recognition-2026'    // 中英混说演示句
])

async function fetchRows(TABLE) {
  const c = CFG[TABLE]
  const out = []
  let off = 0
  for (;;) {
    const filter = c.visible ? `&${c.visible}` : ''
    const r = await rfetch(`${base}/rest/v1/${TABLE}?select=${c.select}${filter}&order=${c.idCol}&offset=${off}&limit=1000`, { headers: H })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error(JSON.stringify(rows).slice(0, 150))
    out.push(...rows); if (rows.length < 1000) break; off += 1000
  }
  return out
}
async function patch(TABLE, id, fields) {
  const c = CFG[TABLE]
  const r = await rfetch(`${base}/rest/v1/${TABLE}?${c.idCol}=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(fields)
  })
  if (!r.ok) throw new Error(`PATCH ${r.status}: ${(await r.text()).slice(0, 150)}`)
}

const ds = new DeepSeek({ timeoutMs: 180000 })

function sys(c, keys) {
  const hasSteps = keys.includes('steps')
  const arrNote = hasSteps ? `\n- "steps" is an array of step strings; translate each element, keep array order/length.` : ''
  return `You are a professional translator for AI/tech content. Translate the given item into natural, fluent, native English.
Rules:
1. Idiomatic English, not literal/machine style.
2. Preserve any Markdown (## headings, lists, links). Do NOT translate code/URLs/product names.${arrNote}
3. Output MUST be 100% English — no Chinese characters at all.
Return ONLY JSON with these keys: ${keys.map(k => `"${k}"`).join(', ')}.`
}

// 命中残留中文的字段：任一 _en 字段 CJK >= 阈值
function flaggedFields(c, row) {
  const hits = []
  for (const [, e] of c.txt) if (cjk(row[e]) >= THRESH) hits.push(e)
  for (const [, e] of c.arr) if (cjkAny(row[e]) >= THRESH) hits.push(e)
  return hits
}

// 仅翻译命中字段对应的源中文列（避免只为修标题却发整篇全文）
async function translateHits(c, row, hits) {
  const pairs = [...c.txt, ...c.arr].filter(([, e]) => hits.includes(e))
  const keys = pairs.map(([z]) => z)
  const payload = {}
  for (const z of keys) payload[z] = row[z]
  return ds.chatJSON(
    [{ role: 'system', content: sys(c, keys) }, { role: 'user', content: JSON.stringify(payload) }],
    { maxTokens: 8000, temperature: 0.3 }
  )
}

async function run(TABLE) {
  const c = CFG[TABLE]
  const rows = await fetchRows(TABLE)
  const flagged = rows
    .filter(r => !SKIP_SLUGS.has(r[c.idCol]))
    .map(r => ({ r, hits: flaggedFields(c, r) }))
    .filter(x => x.hits.length)
  console.log(`[${TABLE}] 共 ${rows.length}，残留中文 ${flagged.length}` +
    (flagged.length ? `（字段：${[...new Set(flagged.flatMap(x => x.hits))].join(',')}）` : ''))
  if (SCAN) return { table: TABLE, total: rows.length, bad: flagged.length }

  let targets = flagged
  if (LIMIT) targets = targets.slice(0, LIMIT)
  let ok = 0, fail = 0
  for (const { r, hits } of targets) {
    try {
      const en = await translateHits(c, r, hits)
      const f = {}
      // 只覆盖命中残留中文的字段，避免动到已正常的 _en
      for (const e of hits) {
        const pair = [...c.txt, ...c.arr].find(([, ee]) => ee === e)
        const z = pair[0]
        const val = en[z]
        const isArr = c.arr.some(([, ee]) => ee === e)
        if (isArr) { if (Array.isArray(val) && cjkAny(val) < THRESH) f[e] = val }
        else { if (val && cjk(val) < THRESH) f[e] = val }
      }
      // 没有任何干净译文 → 跳过（不写入坏数据）
      if (Object.keys(f).length === 0) { fail++; console.log(`✗ ${r[c.idCol]}: 译文仍含中文/无效，跳过`); continue }
      await patch(TABLE, r[c.idCol], f)
      ok++; console.log(`✓ ${r[c.idCol]}  修复字段：${Object.keys(f).join(',')}`)
    } catch (e) { fail++; console.log(`✗ ${r[c.idCol]}: ${e.message}`) }
  }
  console.log(`[${TABLE}] 完成：修复 ${ok}，失败 ${fail}\n`)
  return { table: TABLE, total: rows.length, bad: flagged.length, fixed: ok, fail }
}

const TABLES = (SCAN || ALL) ? Object.keys(CFG) : (ONE ? [ONE] : null)
if (!TABLES) { console.error('需 --scan | --all | --table <name>'); process.exit(1) }
if (ONE && !CFG[ONE]) { console.error(`未知表 ${ONE}`); process.exit(1) }

const summary = []
for (const t of TABLES) summary.push(await run(t))
console.log('\n=== 汇总 ===')
for (const s of summary) console.log(JSON.stringify(s))
if (!SCAN) console.log('用量:', ds.costEstimate())
