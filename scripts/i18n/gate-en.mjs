// 英文翻译质量闸门（AdSense 级从严）：评估 _en 内容，过线置 en_status=published，
// 否则 draft；并生成 src/features/tutorials/en-slugs.ts 的 allowlist（仅 published）。
// 用法：
//   node scripts/i18n/gate-en.mjs --dry-run          # 只评估打印，不改库不写文件
//   node scripts/i18n/gate-en.mjs                    # 评估 + 写库 + 生成 allowlist
//   node scripts/i18n/gate-en.mjs --threshold 85

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { DeepSeek } from '../wechat/deepseek.mjs'
import { requireEnv } from '../wechat/lib/env.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = arg('--dry-run', false) === true
const THRESHOLD = Number(arg('--threshold', 85))

const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }

// 已翻译（有 content_en）的全部行
async function fetchTranslated() {
  const out = []
  let offset = 0
  for (;;) {
    const r = await fetch(`${base}/rest/v1/tutorials?select=slug,title_en,summary_en,content_en,en_status&content_en=not.is.null&order=slug&offset=${offset}&limit=500`, { headers: H })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error(JSON.stringify(rows).slice(0, 150))
    out.push(...rows); if (rows.length < 500) break; offset += 500
  }
  return out
}
async function setStatus(slug, status) {
  const r = await fetch(`${base}/rest/v1/tutorials?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify({ en_status: status })
  })
  if (!r.ok) throw new Error(`PATCH ${r.status}`)
}

// 硬性闸门
const FINGERPRINTS = [/covers everything you need to know/i, /This guide provides practical, production-ready/i, /pip install (gpt|claude|gemini)-/i]
function hardChecks(row) {
  const c = row.content_en || ''
  const reasons = []
  if (c.length < 1500) reasons.push(`THIN:${c.length}`)
  const cjk = (c.match(/[一-鿿]/g) || []).length
  if (cjk > c.length * 0.03) reasons.push(`CJK残留:${cjk}`) // 英文正文不该有大量中文
  for (const re of FINGERPRINTS) if (re.test(c)) reasons.push('FINGERPRINT')
  if (!row.title_en || row.title_en.length < 6) reasons.push('TITLE')
  // 注：不检查 FAQ —— FAQ 是原文结构问题，非翻译质量问题，翻译沿用原文即可
  return reasons
}

const ds = new DeepSeek({ timeoutMs: 120000 })
const SCORE_SYS = `You are a strict English content quality reviewer for a site that will apply for Google AdSense.
Rate this English tech article 0-100 on: fluency (native-sounding, not machine-translated), accuracy, usefulness/depth, readability.
Be harsh on machine-translation artifacts, awkward phrasing, or low added value. Return ONLY JSON: {"overall":int,"machine_translated":true|false,"issues":["..."]}`

const rows = await fetchTranslated()
console.log(`待评估英文译文 ${rows.length} 篇（阈值 ${THRESHOLD}）${DRY ? ' [DRY]' : ''}\n`)

const published = []
let pub = 0, draft = 0
for (const row of rows) {
  const hard = hardChecks(row)
  let decision, score = null
  if (hard.length) {
    decision = 'draft'
    console.log(`🟡 draft  ${row.slug}  闸门:${hard.join(',')}`)
  } else {
    try {
      score = await ds.chatJSON([{ role: 'system', content: SCORE_SYS }, { role: 'user', content: `Title: ${row.title_en}\n\n${row.content_en}` }], { maxTokens: 400 })
    } catch { score = { overall: 0, machine_translated: true, issues: ['评分失败'] } }
    const ok = (score.overall ?? 0) >= THRESHOLD && !score.machine_translated
    decision = ok ? 'published' : 'draft'
    console.log(`${ok ? '🟢 pub  ' : '🟡 draft'}  ${row.slug}  score=${score.overall} mt=${score.machine_translated}`)
    if (score.issues?.length && !ok) console.log(`        ${score.issues.join('; ')}`)
  }
  if (decision === 'published') { published.push(row.slug); pub++ } else draft++
  if (!DRY && decision !== row.en_status) await setStatus(row.slug, decision)
}

console.log(`\n${DRY ? '[DRY] ' : ''}过线 ${pub}，未过线 ${draft}`)

if (!DRY) {
  // 生成 allowlist（供路由/sitemap）
  const file = join(__dir, '..', '..', 'src', 'features', 'tutorials', 'en-slugs.ts')
  const body = `// 自动生成（scripts/i18n/gate-en.mjs）：已翻译且通过质量闸门、可索引的英文教程 slug。
// 仅这些 slug 在 /en/tutorials/{slug} 提供英文页并进英文 sitemap；其余英文不暴露。
export const EN_TUTORIAL_SLUGS: ReadonlySet<string> = new Set([
${published.map(s => `  '${s}'`).join(',\n')}
]);
`
  writeFileSync(file, body)
  console.log(`已写 allowlist：${file}（${published.length} 篇）`)
}
console.log('DeepSeek 用量:', ds.costEstimate())
