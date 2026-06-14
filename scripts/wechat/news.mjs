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
import { fetchAllNewsSlugs, fetchRecentNewsTitles, upsertNews } from './lib/supabase.mjs'
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
// 跨运行事件去重：最近 N 天已发布的 news 标题（CI 无本地 news.json，靠 DB 防重复）
const recentTitles = await fetchRecentNewsTitles(Math.max(DAYS, 7))

// 字符三元组 Jaccard 相似度（中文标题去重，阈值 0.5 视为同一事件）
function trigrams(s) {
  const t = (s || '').replace(/[\s\p{P}]/gu, '').toLowerCase()
  const g = new Set()
  for (let i = 0; i < t.length - 2; i++) g.add(t.slice(i, i + 3))
  return g
}
function similar(a, b) {
  const ga = trigrams(a), gb = trigrams(b)
  if (!ga.size || !gb.size) return 0
  let inter = 0
  for (const x of ga) if (gb.has(x)) inter++
  // 重叠系数（分母取较短集合）：短事件名被长标题包含也能判为重复，避免长度稀释
  return inter / Math.min(ga.size, gb.size)
}
function isDuplicate(text, pool) {
  return pool.some(t => similar(text, t) >= 0.6)
}

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

// 英文版：把生成好的中文资讯翻成地道英文（news 仅 title_en/summary_en，无正文列）。
const NEWS_EN_SYS = `You are an AI-news editor. Translate the given Chinese AI news item into natural, fluent, native English for a global developer/tech audience.
Rules:
1. Idiomatic English a native writer would produce — NOT literal/machine translation. Faithful to facts; never add or invent.
2. Preserve the Markdown structure of the body exactly (## headings, - bullet lists, key figures/tables).
3. Do NOT translate code, product/library/API names, or URLs.
4. Keep the title objective; no clickbait.
Return ONLY a JSON object: {"title_en":"...","summary_en":"...(full English Markdown)"}`

// 翻一条 news → 英文。带应用层重试（DeepSeek 客户端只重试 HTTP 层，译文缺字段/过短/解析失败这里再重试）。
// 全部重试失败才返回 draft（英文先不上线，不阻塞中文发布）。
async function translateNews(title, summary, tries = 3) {
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const t = await ds.chatJSON(
        [{ role: 'system', content: NEWS_EN_SYS }, { role: 'user', content: `Title: ${title}\n\nBody (Markdown):\n${summary}` }],
        { maxTokens: 2500, temperature: 0.3 }
      )
      if (t.title_en && t.summary_en && t.summary_en.length > 100) {
        return { title_en: t.title_en, summary_en: t.summary_en, en_status: STATUS }
      }
      console.log(`     ⚠️ 英文译文异常(第 ${attempt}/${tries} 次)`)
    } catch (err) {
      console.log(`     ⚠️ 英文翻译失败(第 ${attempt}/${tries} 次): ${err.message}`)
    }
    if (attempt < tries) await sleep(1500 * attempt) // 退避后重试
  }
  console.log('     ⚠️ 英文翻译多次失败，en 暂存 draft')
  return { title_en: null, summary_en: null, en_status: 'draft' }
}

const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const doneEvents = new Set(results.map(r => r._event))
const publishedTitles = [...recentTitles] // 本次运行内新发的也加入，防同run内重复
let pub = 0

for (const e of events) {
  if (doneEvents.has(e.event)) { console.log(`✓ 已处理跳过: ${e.event}`); continue }
  // 事件名与最近已发布标题高度相似 → 跳过，避免重复发布同一热点（CI 跨运行防重）
  if (isDuplicate(e.event, publishedTitles)) { console.log(`⏭️  已有相似资讯，跳过: ${e.event}`); continue }
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

  // 生成出的标题再查一次重（事件名与成稿标题可能不同）
  if (isDuplicate(n.title, publishedTitles)) { console.log(`     ⏭️ 成稿标题与已有资讯相似，跳过`); continue }
  publishedTitles.push(n.title, e.event)

  // 同步生成英文版（仅对将要发布的条目翻译，省调用）。带重试，失败则 en 留 draft、不影响中文。
  const en = await translateNews(n.title, n.summary)
  row.title_en = en.title_en
  row.summary_en = en.summary_en
  row.en_status = en.en_status
  console.log(`     EN: ${en.en_status}${en.title_en ? '  ' + en.title_en : ''}`)

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
