// 阶段1：tutorials 语言双向迁移——让每篇可见教程都有中文(content)+英文(content_en)两版。
// - 英文原生行(content 实为英文)：先把英文搬到 _en 列，再翻成中文覆盖 content/title/...
// - 中文原生行：翻成英文写入 _en 列
// 幂等、分批、断点续跑（已双语的跳过）。
// 用法：
//   node scripts/i18n/migrate-lang.mjs --limit 5      # 试跑
//   node scripts/i18n/migrate-lang.mjs                # 全量(可见行)
//   node scripts/i18n/migrate-lang.mjs --redo-slug x  # 重做单篇

import { DeepSeek } from '../wechat/deepseek.mjs'
import { requireEnv } from '../wechat/lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const LIMIT = arg('--limit', null) ? Number(arg('--limit', null)) : null

const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }

const sleep = ms => new Promise(r => setTimeout(r, ms))
// 带重试的 fetch（扛网络抖动）
async function rfetch(url, opts, tries = 4) {
  let last
  for (let i = 0; i < tries; i++) {
    try { return await fetch(url, opts) } catch (e) { last = e; await sleep(1500 * (i + 1)) }
  }
  throw last
}

function cjkCount(s) {
  return ((s || '').match(/[一-鿿]/g) || []).length
}
// 用绝对中文字数判定：英文原文≈0，中文译文有上百字（占比对代码密集文不可靠）
const isChinese = s => cjkCount(s) > 50

async function fetchVisible() {
  const out = []
  let offset = 0
  for (;;) {
    const r = await rfetch(`${base}/rest/v1/tutorials?select=slug,title,subtitle,summary,content,title_en,subtitle_en,summary_en,content_en,en_status&published_at=not.is.null&order=slug&offset=${offset}&limit=1000`, { headers: H })
    const rows = await r.json()
    if (!Array.isArray(rows)) throw new Error(JSON.stringify(rows).slice(0, 150))
    out.push(...rows); if (rows.length < 1000) break; offset += 1000
  }
  return out
}
async function patch(slug, fields) {
  const r = await rfetch(`${base}/rest/v1/tutorials?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(fields)
  })
  if (!r.ok) throw new Error(`PATCH ${r.status}: ${(await r.text()).slice(0, 150)}`)
}

const ds = new DeepSeek({ timeoutMs: 180000 })

function sysPrompt(toLang) {
  const lang = toLang === 'en' ? 'English' : 'Simplified Chinese'
  return `You are a professional technical translator for AI/software developer content. Translate the given tutorial into natural, fluent, native ${lang}.
Rules:
1. Idiomatic ${lang}, not literal/machine-style.
2. Preserve exact Markdown structure: ## headings, lists, code fences, tables, blockquotes, links.
3. Do NOT translate code, commands, API names, library names, URLs.
4. Keep a "## FAQ" section as-is in structure.
5. Keep internal links (/tutorials, /en/tutorials, /mcp ...) unchanged.
Return ONLY JSON: {"title":"...","subtitle":"...","summary":"...","content":"...full ${lang} Markdown..."}`
}

async function translate(row, toLang, src) {
  const user = `Title: ${src.title}\n${src.subtitle ? 'Subtitle: ' + src.subtitle + '\n' : ''}Summary: ${src.summary || ''}\n\nBody:\n${src.content || ''}`
  return ds.chatJSON([{ role: 'system', content: sysPrompt(toLang) }, { role: 'user', content: user }], { maxTokens: 8000, temperature: 0.3 })
}

const rows = await fetchVisible()
let targets = rows.filter(r => {
  const zhOk = isChinese(r.content)            // content 已是中文
  const enOk = r.content_en && r.content_en.length > 100 // 有英文
  return !(zhOk && enOk)                       // 两者都齐才算 done
})
if (LIMIT) targets = targets.slice(0, LIMIT)

console.log(`可见 ${rows.length} 篇，待处理 ${targets.length} 篇\n`)
let enToZh = 0, zhToEn = 0, fail = 0

for (const row of targets) {
  try {
    if (isChinese(row.content)) {
      // 中文原生 → 补英文
      if (row.content_en && row.content_en.length > 100) { continue }
      const en = await translate(row, 'en', row)
      await patch(row.slug, {
        title_en: en.title, subtitle_en: en.subtitle || null, summary_en: en.summary || null,
        content_en: en.content, en_status: 'published'
      })
      zhToEn++; console.log(`✓ zh→en  ${row.slug}`)
    } else {
      // 英文原生 → 先保英文到 _en，再翻中文覆盖中文列
      const enSrc = {
        title: row.title_en || row.title, subtitle: row.subtitle_en || row.subtitle,
        summary: row.summary_en || row.summary, content: row.content_en || row.content
      }
      const fields = { en_status: 'published' }
      if (!row.content_en) {
        fields.title_en = row.title; fields.subtitle_en = row.subtitle || null
        fields.summary_en = row.summary || null; fields.content_en = row.content
      }
      const zh = await translate(row, 'zh', enSrc)
      fields.title = zh.title; fields.subtitle = zh.subtitle || null
      fields.summary = zh.summary || null; fields.content = zh.content
      await patch(row.slug, fields)
      enToZh++; console.log(`✓ en→zh  ${row.slug}`)
    }
  } catch (e) {
    fail++; console.log(`✗ ${row.slug}: ${e.message}`)
  }
  if ((enToZh + zhToEn) % 20 === 0 && (enToZh + zhToEn)) console.log(`  …进度 ${enToZh + zhToEn}/${targets.length}  余额无关  用量 ${JSON.stringify(ds.usage)}`)
}

console.log(`\n完成：英文→中文 ${enToZh}，中文→英文 ${zhToEn}，失败 ${fail}`)
console.log('DeepSeek 用量:', ds.costEstimate())
