// 一次性：用"喂全文+长资讯"提示词重生成已入库的 news（PATCH 同 slug，不新建）。
// 用法：node scripts/wechat/regen-news.mjs [--dry-run]
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { truncate } from './lib/clean-html.mjs'
import { requireEnv, DATA_DIR } from './lib/env.mjs'

const DRY = process.argv.includes('--dry-run')
const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }

const news = JSON.parse(readFileSync(join(DATA_DIR, 'news.json'), 'utf8'))
const sources = JSON.parse(readFileSync(join(DATA_DIR, 'sources.json'), 'utf8'))
const byUrl = new Map(sources.map(s => [s.content_url, s]))

const NEWS_SYS = `你是 AI 资讯编辑。基于多家公众号对【同一事件】的报道（提供全文），写一条客观、信息充实的中文深度资讯。
铁律：
1. 只陈述事实，综合多源信息，不夸大、不编造数字；多源有出入时注明分歧或取保守表述。
2. summary 用 Markdown，500-900 字，结构化呈现：开头一段交代事件核心；用 2-4 个 ## 小标题分层展开（背景/关键细节/各方反应或数据/影响）；适当用 - 要点列表和关键数据。
3. 标题客观，不做标题党。不要"本文""综上"等套话。
只返回 JSON：{"summary":"Markdown正文","tags":["英文小写标签"]}`

const ds = new DeepSeek()
console.log(`重生成 ${news.length} 条 news（喂全文，长资讯）${DRY ? ' [DRY]' : ''}\n`)

for (const item of news) {
  const arts = (item.sources || []).map(s => byUrl.get(s.url)).filter(Boolean)
  if (!arts.length) { console.log('✗ 无源文跳过', item.slug); continue }
  const material = arts.map((a, i) => `### 报道${i + 1}：[${a.account}] ${a.title}\n${truncate(a.body_text || a.digest, 3500)}`).join('\n\n---\n\n')
  let out
  try {
    out = await ds.chatJSON(
      [{ role: 'system', content: NEWS_SYS }, { role: 'user', content: `事件：${item._event}\n\n各家报道：\n${material}` }],
      { maxTokens: 2500 }
    )
  } catch (e) { console.log('✗ 生成失败', item.slug, e.message); continue }

  const len = (out.summary || '').length
  console.log(`${DRY ? '[DRY] ' : ''}${item.slug}  ${len}字  ${item.title}`)
  if (DRY) continue
  const body = { summary: out.summary }
  if (Array.isArray(out.tags) && out.tags.length) body.tags = out.tags
  const r = await fetch(`${base}/rest/v1/news?slug=eq.${encodeURIComponent(item.slug)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(body)
  })
  if (!r.ok) console.log('  ✗ PATCH 失败', r.status, (await r.text()).slice(0, 120))
}
console.log('\n完成。用量:', ds.costEstimate())
