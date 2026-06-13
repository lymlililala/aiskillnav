// 3) 合成：逐簇取成员源文全文，DeepSeek 合成一篇原创中文常青教程（站内 Markdown 方言）。
// 用法：node scripts/wechat/3-synthesize.mjs
//       node scripts/wechat/3-synthesize.mjs --limit 3   # 只合成前 3 簇试跑

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { truncate } from './lib/clean-html.mjs'
import { uniqueSlug } from './lib/slug.mjs'
import { fetchAllSlugs } from './lib/supabase.mjs'
import { DATA_DIR } from './lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  return i === -1 ? def : process.argv[i + 1]
}
const LIMIT = arg('--limit', null) ? Number(arg('--limit', null)) : null

const SRC = join(DATA_DIR, 'sources.json')
const CLU = join(DATA_DIR, 'clusters.json')
const OUT = join(DATA_DIR, 'drafts.json')
for (const [f, n] of [[SRC, 'sources.json'], [CLU, 'clusters.json']]) {
  if (!existsSync(f)) { console.error(`缺少 ${n}`); process.exit(1) }
}

const sources = JSON.parse(readFileSync(SRC, 'utf8'))
const bySn = new Map(sources.map(s => [s.sn, s]))
let clusters = JSON.parse(readFileSync(CLU, 'utf8'))
if (LIMIT) clusters = clusters.slice(0, LIMIT)

const ds = new DeepSeek()
console.log(`拉取站内现有 slug 用于查重 …`)
const existingSlugs = await fetchAllSlugs()
console.log(`现有 ${existingSlugs.size} 个 slug。开始合成 ${clusters.length} 篇 …\n`)

const SYS = `你是资深 AI 技术作者，为技术学习网站 aiskillnav 写原创中文深度教程。
下面给你同一主题下的多篇公众号文章作为「素材参考」。你要综合提炼，写一篇全新的、结构清晰的原创教程。

铁律：
1. 这是原创综合写作，不是改写或翻译。绝不能逐段照搬/复述任何一篇素材；要重新组织、提炼共识、补充自己的逻辑框架。
2. 全文中文为主，面向中文开发者。专业、准确、有信息密度，拒绝套话和空话。
3. 正文用 Markdown，遵循以下方言：
   - 章节用 ## 与 ###；要点用 - 列表；步骤用有序列表
   - 代码用 \`\`\` 围栏（如有代码必须正确可读，禁止伪代码/编造 API/编造 pip 包名）
   - 表格用 | 管道 |
   - 必须自然嵌入 2-4 个站内内链，写成 Markdown 链接指向相关支柱主题中心页，路径只能从以下白名单选取（按文章主题相关性选）：
     /tutorials/topic/rag、/tutorials/topic/agent、/tutorials/topic/model-deployment、/tutorials/topic/workflow、/tutorials/topic/openai、/tutorials/topic/claude、/tutorials/topic/langchain、/tutorials/topic/fine-tuning、/tutorials/topic/prompt-engineering、/tutorials/topic/mcp、/tutorials/topic/evaluation、/tutorials/topic/security、/tutorials/topic/api-integration
     例：想深入了解可参考 [AI Agent 与多智能体](/tutorials/topic/agent)。不要编造其它站内路径。
4. 必须包含一个 "## FAQ" 章节，至少 3 对问答，格式为：
   **问题？** 紧跟答案文字。
5. 正文 ≥ 3000 字（中文字符）。

只返回 JSON：
{
 "slug":"英文小写连字符的-url-slug(不含后缀,我会自动加)",
 "title":"中文标题",
 "subtitle":"中文副标题(一句话)",
 "summary":"120-160字中文摘要,用作 meta description",
 "content":"完整 Markdown 正文(含 ## FAQ)",
 "tags":["英文小写标签数组"],
 "level":"beginner|intermediate|advanced",
 "estimated_minutes":整数,
 "category":"concept|hands-on|agent|mcp"
}`

const drafts = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const doneTopics = new Set(drafts.map(d => d._topic))

for (const c of clusters) {
  if (doneTopics.has(c.topic)) { console.log(`✓ 已合成跳过: ${c.topic}`); continue }
  const members = (c.sources || []).map(s => bySn.get(s.sn)).filter(Boolean)
  if (members.length < 2) { console.log(`✗ 源文不足跳过: ${c.topic}`); continue }

  const material = members
    .map((m, i) => `### 素材${i + 1}：${m.title}（来源公众号：${m.account}）\n${truncate(m.body_text, 5000)}`)
    .join('\n\n---\n\n')

  const userMsg = `主题：${c.topic}\n建议标题：${c.working_title}\n切入角度：${c.angle}\n建议分类：${c.suggested_category}\n建议标签：${(c.suggested_tags || []).join(', ')}\n建议难度：${c.suggested_level || 'intermediate'}\n\n以下是素材文章：\n\n${material}`

  console.log(`合成中: ${c.working_title}  (${members.length} 源文)`)
  try {
    const d = await ds.chatJSON([{ role: 'system', content: SYS }, { role: 'user', content: userMsg }], { maxTokens: 8000, temperature: 0.6 })
    d.slug = uniqueSlug(d.slug || c.working_title, existingSlugs)
    // 用建议值兜底
    d.category = d.category || c.suggested_category || 'concept'
    d.level = d.level || c.suggested_level || 'intermediate'
    d.tags = Array.isArray(d.tags) && d.tags.length ? d.tags : (c.suggested_tags || [])
    d.estimated_minutes = d.estimated_minutes || Math.max(5, Math.round((d.content || '').length / 400))
    // provenance：记录来源，备查与合规追溯（不入库，仅留 data/）
    d._topic = c.topic
    d._sources = members.map(m => ({ sn: m.sn, account: m.account, title: m.title, url: m.content_url }))
    drafts.push(d)
    writeFileSync(OUT, JSON.stringify(drafts, null, 2))
    console.log(`  ✓ ${d.slug}  ${(d.content || '').length} 字`)
  } catch (e) {
    console.log(`  ✗ 合成失败: ${e.message}`)
  }
}

console.log(`\n已写入 ${OUT}（共 ${drafts.length} 篇草稿）`)
console.log('用量:', ds.costEstimate())
console.log('⚠️  抽查 drafts.json 1-2 篇（原创度/格式/FAQ/字数），再跑 4-publish.mjs')
