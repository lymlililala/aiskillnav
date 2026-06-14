// 翻译 tutorials 中文内容 → 英文 _en 列。DeepSeek，复用 wechat 的客户端与写库范式。
// 用法：
//   node scripts/i18n/translate.mjs --limit 5          # 先翻 top 5 试水
//   node scripts/i18n/translate.mjs                    # 翻 top-slugs.json 全部
//   node scripts/i18n/translate.mjs --redo             # 重翻（覆盖已有 _en）

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { DeepSeek } from '../wechat/deepseek.mjs'
import { requireEnv } from '../wechat/lib/env.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dir, 'data')

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const LIMIT = arg('--limit', null) ? Number(arg('--limit', null)) : null
const REDO = arg('--redo', false) === true

const TOP = join(DATA_DIR, 'top-slugs.json')
if (!existsSync(TOP)) { console.error('缺少 top-slugs.json，先跑 pick-top-tutorials.mjs'); process.exit(1) }
let slugs = JSON.parse(readFileSync(TOP, 'utf8')).map(t => t.slug)
if (LIMIT) slugs = slugs.slice(0, LIMIT)

const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }

async function getRow(slug) {
  const r = await fetch(`${base}/rest/v1/tutorials?slug=eq.${encodeURIComponent(slug)}&select=slug,title,subtitle,summary,content,title_en,content_en`, { headers: H })
  const [row] = await r.json()
  return row
}
async function patchEn(slug, fields) {
  const r = await fetch(`${base}/rest/v1/tutorials?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(fields)
  })
  if (!r.ok) throw new Error(`PATCH 失败 ${r.status}: ${(await r.text()).slice(0, 150)}`)
}

const ds = new DeepSeek({ timeoutMs: 180000 })

const SYS = `You are a professional Chinese-to-English translator specializing in AI/software technical content for a developer audience.
Translate the given Chinese tutorial into natural, fluent, native English. Rules:
1. Output idiomatic English a native technical writer would produce — NOT literal/machine-style translation.
2. Preserve the exact Markdown structure: headings (##/###), lists, code fences, tables, blockquotes, links.
3. Do NOT translate code, commands, API names, library names, or URLs inside the content.
4. Keep the "## FAQ" section as "## FAQ" with the same **Question?** answer format.
5. Keep internal links as-is (e.g. /tutorials/...). Do not invent content; translate faithfully but fluently.
Return ONLY a JSON object: {"title":"...","subtitle":"...","summary":"...","content":"...(full English Markdown)"}`

console.log(`翻译 ${slugs.length} 篇 …\n`)
let done = 0, skipped = 0
for (const slug of slugs) {
  const row = await getRow(slug)
  if (!row) { console.log(`✗ 找不到 ${slug}`); continue }
  if (row.content_en && !REDO) { console.log(`✓ 已翻译跳过 ${slug}`); skipped++; continue }

  const user = `标题：${row.title}\n${row.subtitle ? '副标题：' + row.subtitle + '\n' : ''}摘要：${row.summary || ''}\n\n正文：\n${row.content || ''}`
  try {
    const out = await ds.chatJSON([{ role: 'system', content: SYS }, { role: 'user', content: user }], { maxTokens: 8000, temperature: 0.3 })
    if (!out.content || out.content.length < 200) { console.log(`✗ 译文异常 ${slug}`); continue }
    await patchEn(slug, {
      title_en: out.title || null,
      subtitle_en: out.subtitle || null,
      summary_en: out.summary || null,
      content_en: out.content,
      en_status: 'draft' // 翻译完先 draft，由 gate-en 评估后置 published
    })
    done++
    console.log(`✓ ${slug}  ${out.content.length} chars`)
  } catch (e) {
    console.log(`✗ 翻译失败 ${slug}: ${e.message}`)
  }
}
console.log(`\n完成：翻译 ${done}，跳过 ${skipped}。用量:`, ds.costEstimate())
console.log('下一步：node scripts/i18n/gate-en.mjs 评估质量并放行')
