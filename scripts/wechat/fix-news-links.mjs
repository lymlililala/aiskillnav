// 一次性修正：把已入库的 wechat-news 的微信外链 → 站内主题内链；source_name → 综合整理。
// 用法：node scripts/wechat/fix-news-links.mjs [--dry-run]
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { requireEnv, DATA_DIR } from './lib/env.mjs'

const DRY = process.argv.includes('--dry-run')
const base = requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '')
const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const H = { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }

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
  for (const [slug, toks] of TOPICS) if (toks.some(tk => hay.has(tk) || lt.includes(tk))) return `/tutorials/topic/${slug}`
  return ''
}

const slugs = JSON.parse(readFileSync(join(DATA_DIR, 'news.json'), 'utf8')).map(x => x.slug)
console.log(`修正 ${slugs.length} 条 news 的链接 …\n`)

for (const slug of slugs) {
  const r = await fetch(`${base}/rest/v1/news?slug=eq.${encodeURIComponent(slug)}&select=slug,title,tags,source_url`, { headers: H })
  const [row] = await r.json()
  if (!row) { console.log('✗ 未找到', slug); continue }
  const url = matchTopicUrl(row.tags, row.title)
  console.log(`${DRY ? '[DRY] ' : ''}${slug}\n     ${row.source_url} → ${url || '(空，隐藏CTA)'}`)
  if (DRY) continue
  const p = await fetch(`${base}/rest/v1/news?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ source_url: url, source_name: '综合整理' })
  })
  if (!p.ok) console.log('  ✗ PATCH 失败', p.status, (await p.text()).slice(0, 120))
}
console.log('\n完成。')
