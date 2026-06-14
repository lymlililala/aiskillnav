// 阶段2：news / use_cases 语言双向迁移（每行补齐中英两版）。参数化复用。
// 用法：
//   node scripts/i18n/migrate-content.mjs --table news --limit 5
//   node scripts/i18n/migrate-content.mjs --table news
//   node scripts/i18n/migrate-content.mjs --table use_cases

import { DeepSeek } from '../wechat/deepseek.mjs'
import { requireEnv } from '../wechat/lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const TABLE = arg('--table', null)
const LIMIT = arg('--limit', null) ? Number(arg('--limit', null)) : null

// 表配置：idCol 主键、langField 判语言字段、txt 文本字段对、arr 数组字段对、visible 过滤
const CFG = {
  news: {
    idCol: 'slug', langField: 'summary',
    txt: [['title', 'title_en'], ['summary', 'summary_en']], arr: [],
    visible: 'status=eq.published',
    select: 'slug,title,summary,title_en,summary_en,en_status'
  },
  use_cases: {
    idCol: 'id', langField: 'description',
    txt: [['title', 'title_en'], ['description', 'description_en']], arr: [['steps', 'steps_en']],
    visible: 'published_at=not.is.null',
    select: 'id,title,description,steps,title_en,description_en,steps_en,en_status'
  },
  // 目录类：只翻 description（name 是专有名，不翻）
  skills: { idCol: 'id', langField: 'description', txt: [['description', 'description_en']], arr: [], visible: 'status=eq.published', select: 'id,description,description_en,en_status' },
  skill_tools: { idCol: 'id', langField: 'description', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' },
  agents: { idCol: 'id', langField: 'description', txt: [['description', 'description_en']], arr: [], visible: 'status=eq.published', select: 'id,description,description_en,en_status' },
  mcp_servers: { idCol: 'id', langField: 'description', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' },
  ai_models: { idCol: 'id', langField: 'description', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' },
  benchmarks: { idCol: 'id', langField: 'description', txt: [['description', 'description_en']], arr: [], visible: '', select: 'id,description,description_en,en_status' }
}
if (!CFG[TABLE]) { console.error('需 --table news|use_cases'); process.exit(1) }
const c = CFG[TABLE]

const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }
const sleep = ms => new Promise(r => setTimeout(r, ms))
async function rfetch(url, opts, tries = 4) {
  let last
  for (let i = 0; i < tries; i++) { try { return await fetch(url, opts) } catch (e) { last = e; await sleep(1500 * (i + 1)) } }
  throw last
}
const cjk = s => ((s || '').match(/[一-鿿]/g) || []).length

async function fetchRows() {
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
async function patch(id, fields) {
  const r = await rfetch(`${base}/rest/v1/${TABLE}?${c.idCol}=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(fields)
  })
  if (!r.ok) throw new Error(`PATCH ${r.status}: ${(await r.text()).slice(0, 150)}`)
}

const ds = new DeepSeek({ timeoutMs: 120000 })

function sys(toLang) {
  const lang = toLang === 'en' ? 'English' : 'Simplified Chinese'
  const arrNote = c.arr.length ? `\n- "steps" is an array of step strings; translate each element, keep array order/length.` : ''
  return `You are a professional translator for AI/tech content. Translate the given item into natural, fluent, native ${lang}.
Rules:
1. Idiomatic ${lang}, not literal/machine style.
2. Preserve any Markdown (## headings, lists, links). Do NOT translate code/URLs/product names.${arrNote}
Return ONLY JSON with these keys: ${[...c.txt.map(([z]) => z), ...c.arr.map(([z]) => z)].map(k => `"${k}"`).join(', ')}.`
}

async function translate(src, toLang) {
  const payload = {}
  for (const [z] of c.txt) payload[z] = src[z]
  for (const [z] of c.arr) payload[z] = src[z]
  const out = await ds.chatJSON(
    [{ role: 'system', content: sys(toLang) }, { role: 'user', content: JSON.stringify(payload) }],
    { maxTokens: 4000, temperature: 0.3 }
  )
  return out
}

const rows = await fetchRows()
let targets = rows.filter(r => {
  const enField = c.txt[c.txt.length - 1][1] // 最后一个文本 _en 字段（summary_en/description_en）
  return !(r.en_status === 'published' && r[enField] && String(r[enField]).length > 3)
})
if (LIMIT) targets = targets.slice(0, LIMIT)
console.log(`[${TABLE}] 共 ${rows.length}，待处理 ${targets.length}\n`)

let toZh = 0, toEn = 0, fail = 0
for (const row of targets) {
  try {
    const enFieldKey = c.txt[c.txt.length - 1][1]
    if (cjk(row[c.langField]) > 5) {
      // 中文原生 → 补英文
      if (row[enFieldKey] && String(row[enFieldKey]).length > 3) continue
      const en = await translate(row, 'en')
      const f = { en_status: 'published' }
      for (const [z, e] of c.txt) f[e] = en[z] ?? null
      for (const [z, e] of c.arr) f[e] = Array.isArray(en[z]) ? en[z] : (row[z] || null)
      await patch(row[c.idCol], f)
      toEn++; console.log(`✓ zh→en  ${row[c.idCol]}`)
    } else {
      // 英文原生 → 保英文到 _en，再译中文覆盖中文列
      const f = { en_status: 'published' }
      const enFilled = row[enFieldKey] && String(row[enFieldKey]).length > 3
      const enSrc = {}
      for (const [z, e] of c.txt) { enSrc[z] = enFilled ? row[e] : row[z]; if (!enFilled) f[e] = row[z] }
      for (const [z, e] of c.arr) { enSrc[z] = enFilled ? row[e] : row[z]; if (!enFilled) f[e] = row[z] }
      const zh = await translate(enSrc, 'zh')
      for (const [z] of c.txt) f[z] = zh[z] ?? row[z]
      for (const [z] of c.arr) f[z] = Array.isArray(zh[z]) ? zh[z] : row[z]
      await patch(row[c.idCol], f)
      toZh++; console.log(`✓ en→zh  ${row[c.idCol]}`)
    }
  } catch (e) { fail++; console.log(`✗ ${row[c.idCol]}: ${e.message}`) }
}
console.log(`\n[${TABLE}] 完成：英→中 ${toZh}，中→英 ${toEn}，失败 ${fail}`)
console.log('用量:', ds.costEstimate())
