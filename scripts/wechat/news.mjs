// news：按「同一天 + 同事件」聚类公众号热点（≥2 篇扎堆=热点），DeepSeek 生成短新闻摘要，写入 news 表。
// news 是「摘要 + 原文外链」形态（无正文），比 tutorials 更轻、更合规。
//
// 用法：
//   node scripts/wechat/news.mjs --dry-run          # 只看热点判定与生成，不入库
//   node scripts/wechat/news.mjs                    # 入库（默认 published）
//   node scripts/wechat/news.mjs --days 3           # 看最近 3 天的扎堆（默认 7）
//   node scripts/wechat/news.mjs --status draft     # 入库为草稿待审

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { truncate } from './lib/clean-html.mjs'
import { uniqueSlug } from './lib/slug.mjs'
import { fetchAllNewsSlugs, upsertNews } from './lib/supabase.mjs'
import { fetchSources } from './lib/sources.mjs'
import { DATA_DIR } from './lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = arg('--dry-run', false) === true
const DAYS = Number(arg('--days', 3))
const STATUS = arg('--status', 'published')

mkdirSync(DATA_DIR, { recursive: true })
const OUT = join(DATA_DIR, 'news.json')

// 站内 14 个支柱主题（对齐 src/features/tutorials/topics.ts），news 据 tags/标题匹配后做站内内链
const TOPICS = [
  ['rag', ['rag', 'retrieval', 'vector', 'embedding', 'pinecone', 'qdrant', 'pgvector']],
  ['agent', ['agent', 'agents', 'multi-agent', 'crewai', 'autogen']],
  ['model-deployment', ['deploy', 'serving', 'inference', 'vllm', 'kubernetes']],
  ['workflow', ['workflow', 'automation', 'pipeline', 'n8n']],
  ['openai', ['openai', 'gpt', 'gpt-4o', 'whisper', 'sora']],
  ['claude', ['claude', 'anthropic', 'fable']],
  ['langchain', ['langchain', 'langgraph', 'llamaindex']],
  ['fine-tuning', ['fine-tuning', 'lora', 'qlora', 'rlhf', 'sft', 'post-training']],
  ['prompt-engineering', ['prompt', 'few-shot', 'cot']],
  ['mcp', ['mcp']],
  ['evaluation', ['eval', 'evaluation', 'benchmark', 'tracing']],
  ['security', ['security', 'safety', 'prompt-injection', 'jailbreak']],
  ['api-integration', ['api', 'function-calling', 'tool-calling', 'sdk']]
]
function matchTopicUrl(tags, title) {
  const hay = new Set([...(tags || []).map(t => String(t).toLowerCase()), ...String(title || '').toLowerCase().split(/[^a-z0-9+]+/)])
  const lt = String(title || '').toLowerCase()
  for (const [slug, toks] of TOPICS) {
    if (toks.some(tk => hay.has(tk) || lt.includes(tk))) return `/tutorials/topic/${slug}`
  }
  return '' // 无匹配 → 空，详情页不渲染延伸阅读 CTA
}

const recent = (await fetchSources({ sinceDays: DAYS, minBodyLen: 150 })).filter(s => s.published_at)
console.log(`最近 ${DAYS} 天内源文：${recent.length} 篇`)

// 给模型的精简清单（含发布日，引导它按「同日+同事件」聚类）
const list = recent.map((s, i) => ({
  id: i,
  date: s.published_at.slice(0, 10),
  account: s.account,
  title: s.title,
  digest: (s.digest || '').slice(0, 60)
}))

const ds = new DeepSeek()

const CLUSTER_SYS = `你是 AI 资讯编辑。下面是最近若干天 AI/科技公众号的发文清单（含日期、公众号、标题）。
任务：找出「热点事件」——即多个不同公众号在相近时间（同一天或相邻一两天）报道的同一件事（如某新模型发布、某公司动态、某重大研究）。

要求：
1. 每个热点至少由 2 篇来自【不同公众号】的文章构成（同一公众号的多篇不算扎堆）。
2. 只保留真正的「事件型热点」，剔除：常青技术教程、个人观点、营销推广、无明确事件的泛泛而谈。
3. 给每个热点起一个准确的中文事件名。

只返回 JSON：
{"events":[{
  "event":"中文事件名（如：DeepSeek-V4 发布）",
  "source_ids":[整数数组，来自不同公众号],
  "category":"模型|框架|工具|Agent|行业 之一",
  "tags":["英文小写标签"]
}]}`

console.log('识别热点事件 …')
const clustered = await ds.chatJSON(
  [{ role: 'system', content: CLUSTER_SYS }, { role: 'user', content: JSON.stringify(list) }],
  { maxTokens: 3000 }
)

// 校验：≥2 篇且来自不同公众号
const events = (clustered.events || []).filter(e => {
  const arts = (e.source_ids || []).map(id => recent[id]).filter(Boolean)
  const accounts = new Set(arts.map(a => a.account))
  e._articles = arts
  return arts.length >= 2 && accounts.size >= 2
})
console.log(`识别到 ${events.length} 个热点事件（≥2 篇且跨号）\n`)

if (!events.length) {
  console.log('近期无明显热点扎堆。可加大 --days 或等更多采集。')
  process.exit(0)
}

const existingSlugs = await fetchAllNewsSlugs()
const NEWS_SYS = `你是 AI 资讯编辑。基于多家公众号对【同一事件】的报道（提供全文），写一条客观、信息充实的中文深度资讯。
铁律：
1. 只陈述事实，综合多源信息，不夸大、不编造数字；多源有出入时注明分歧或取保守表述。
2. summary 用 Markdown，500-900 字，结构化呈现：
   - 开头一段交代事件核心（是什么、谁、何时）；
   - 用 2-4 个 ## 小标题分层展开（如背景、关键细节、各方反应/数据、影响）；
   - 适当用 - 要点列表和关键数据，提升信息密度与可读性。
3. 标题客观，不做标题党。不要写"本文""综上"等套话。
只返回 JSON：
{"slug":"英文小写连字符slug(不含后缀)","title":"中文标题","summary":"Markdown正文","tags":["英文小写标签"]}`

const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const doneEvents = new Set(results.map(r => r._event))
let pub = 0

for (const e of events) {
  if (doneEvents.has(e.event)) { console.log(`✓ 已处理跳过: ${e.event}`); continue }
  // 喂多源全文（每篇截断到 3500 字控 context），让模型综合出有信息量的深度资讯
  const material = e._articles
    .map((a, i) => `### 报道${i + 1}：[${a.account}] ${a.title}\n${truncate(a.body_text || a.digest, 3500)}`)
    .join('\n\n---\n\n')

  console.log(`生成: ${e.event}  (${e._articles.length} 源 / ${new Set(e._articles.map(a => a.account)).size} 号)`)
  let n
  try {
    n = await ds.chatJSON(
      [{ role: 'system', content: NEWS_SYS }, { role: 'user', content: `事件：${e.event}\n建议分类：${e.category}\n\n各家报道：\n${material}` }],
      { maxTokens: 2500 }
    )
  } catch (err) {
    console.log(`  ✗ 生成失败: ${err.message}`)
    continue
  }

  n.slug = uniqueSlug(n.slug || e.event, existingSlugs)
  // 不回链公众号原文（导流走 + 漏权重 + 链接常失效）。改指向站内相关支柱主题页做内链。
  const internalUrl = matchTopicUrl(n.tags?.length ? n.tags : e.tags, n.title || e.event)
  const row = {
    slug: n.slug,
    title: n.title,
    summary: n.summary,
    source_url: internalUrl, // 站内 /tutorials/topic/x 或 ''（空则详情页不渲染 CTA）
    source_name: '综合整理',
    category: e.category || 'Agent',
    tags: Array.isArray(n.tags) && n.tags.length ? n.tags : (e.tags || []),
    status: STATUS,
    published_at: new Date().toISOString()
  }

  console.log(`  ${DRY ? '[DRY] ' : ''}${n.slug}  分类:${row.category}  延伸:${internalUrl || '(无)'}`)
  console.log(`     ${n.title}`)

  let action = STATUS
  if (!DRY) {
    try { action = `${STATUS}:${await upsertNews(row)}` }
    catch (err) { action = 'error'; console.log(`     ✗ 写库失败: ${err.message}`) }
  }
  results.push({ _event: e.event, slug: n.slug, title: n.title, category: row.category, action, sources: e._articles.map(a => ({ account: a.account, title: a.title, url: a.content_url })) })
  if (!DRY) writeFileSync(OUT, JSON.stringify(results, null, 2))
  pub++
}

console.log(`\n${DRY ? '[DRY-RUN] ' : ''}完成：生成 ${pub} 条热点新闻`)
if (!DRY) console.log(`记录写入 ${OUT}`)
console.log('DeepSeek 用量:', ds.costEstimate())
