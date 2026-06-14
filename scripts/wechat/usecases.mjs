// usecases：从采集的源文中抽取「可落地的 AI 应用场景」，写入 use_cases 表。
// use_cases 无 slug（按 id 路由）；description/steps 为纯文本（steps 直接成 HowTo 结构化数据）。
//
// 用法：
//   node scripts/wechat/usecases.mjs --dry-run        # 只看抽取结果，不入库
//   node scripts/wechat/usecases.mjs                  # 入库（过线 published，否则草稿）
//   node scripts/wechat/usecases.mjs --max 6 --threshold 75

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { truncate } from './lib/clean-html.mjs'
import { fetchAllUseCaseTitles, insertUseCase } from './lib/supabase.mjs'
import { fetchSources } from './lib/sources.mjs'
import { DATA_DIR } from './lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = arg('--dry-run', false) === true
const MAX = Number(arg('--max', 8))
const THRESHOLD = Number(arg('--threshold', 75))
const DAYS = Number(arg('--days', 14))

mkdirSync(DATA_DIR, { recursive: true })
const OUT = join(DATA_DIR, 'usecases.json')

const sources = await fetchSources({ sinceDays: DAYS, minBodyLen: 300 })

const INDUSTRIES = ['marketing', 'engineering', 'research', 'productivity', 'industry']

const ds = new DeepSeek()

// 1) 抽取场景候选（喂标题+摘要列表，先选出适合做"应用场景"的素材）
const list = sources.map((s, i) => ({ id: i, account: s.account, title: s.title, digest: (s.digest || '').slice(0, 70) }))
const PICK_SYS = `你是 AI 应用落地编辑。下面是公众号文章清单。挑出适合提炼成「可操作的 AI 应用场景」（读者能照着一步步落地的实战用法，而非新闻/观点/纯理论）的文章。
每个场景可由 1-3 篇相关文章支撑。最多 ${MAX} 个。
只返回 JSON：{"picks":[{"scene":"中文场景名","source_ids":[整数],"industry":"marketing|engineering|research|productivity|industry"}]}`

console.log(`从 ${list.length} 篇源文中挑选可落地场景（最多 ${MAX}）…`)
const picked = await ds.chatJSON(
  [{ role: 'system', content: PICK_SYS }, { role: 'user', content: JSON.stringify(list) }],
  { maxTokens: 2000 }
)
const picks = (picked.picks || []).filter(p => Array.isArray(p.source_ids) && p.source_ids.length).slice(0, MAX)
console.log(`选出 ${picks.length} 个场景候选\n`)

// 2) 逐个生成 use_case 结构
const GEN_SYS = `你是 AI 应用落地编辑。基于素材，把一个 AI 应用场景写成可照做的实战卡片。
铁律：
1. description 为【纯文本】一段话（120-200字），客观说明这个场景解决什么、用什么、效果如何。禁止 Markdown 标记。
2. steps 为【纯文本字符串数组】，3-6 步，每步一句自包含的可操作指令（不要编号前缀、不要 Markdown）。这些会直接作为 HowTo 步骤。
3. tools 为真实存在的工具/产品名数组（如 Claude、Cursor、n8n、ComfyUI 等），便于站内反链。
4. difficulty 为 1/2/3（简单/中等/复杂）；industry 从 marketing|engineering|research|productivity|industry 选最贴切的一个。
5. estimated_time 为简短中文（如"30分钟"、"1小时搭建"）。不编造数据。
只返回 JSON：
{"title":"中文标题","description":"纯文本","steps":["步骤1","步骤2","步骤3"],"tools":["工具名"],"industry":"...","difficulty":2,"estimated_time":"...","tags":["英文小写标签"]}`

const SCORE_SYS = `你是严格审核员。给这个 AI 应用场景卡片打分(0-100)：实用性、可操作性(步骤是否真能照做)、准确性。只返回 JSON：{"overall":int,"issues":["问题"]}`

const existingTitles = await fetchAllUseCaseTitles()
const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const doneScenes = new Set(results.map(r => r._scene))
let pub = 0, draft = 0

for (const p of picks) {
  if (doneScenes.has(p.scene)) { console.log(`✓ 已处理跳过: ${p.scene}`); continue }
  const arts = p.source_ids.map(id => sources[id]).filter(Boolean)
  if (!arts.length) continue
  const material = arts.map((a, i) => `### 素材${i + 1}：${a.title}\n${truncate(a.body_text, 3000)}`).join('\n\n---\n\n')

  console.log(`生成: ${p.scene}`)
  let uc
  try {
    uc = await ds.chatJSON(
      [{ role: 'system', content: GEN_SYS }, { role: 'user', content: `场景：${p.scene}\n建议行业：${p.industry}\n\n素材：\n${material}` }],
      { maxTokens: 2000, temperature: 0.5 }
    )
  } catch (e) { console.log(`  ✗ 生成失败: ${e.message}`); continue }

  // 字段闸门
  const reasons = []
  if (!uc.title || uc.title.length < 4) reasons.push('TITLE')
  if (!uc.description || uc.description.length < 60) reasons.push('DESC')
  if (!Array.isArray(uc.steps) || uc.steps.length < 3) reasons.push('STEPS<3')
  if (existingTitles.has((uc.title || '').trim())) reasons.push('DUP-TITLE')
  if (!INDUSTRIES.includes(uc.industry)) uc.industry = p.industry && INDUSTRIES.includes(p.industry) ? p.industry : 'productivity'
  if (![1, 2, 3].includes(uc.difficulty)) uc.difficulty = 2

  let score = null, decision
  if (reasons.length) {
    decision = 'draft'
    console.log(`  🟡 草稿（闸门）: ${reasons.join(',')}`)
  } else {
    try {
      score = await ds.chatJSON([{ role: 'system', content: SCORE_SYS }, { role: 'user', content: `标题：${uc.title}\n说明：${uc.description}\n步骤：${uc.steps.join(' / ')}` }], { maxTokens: 400 })
    } catch { score = { overall: 0, issues: ['评分失败'] } }
    decision = (score.overall ?? 0) >= THRESHOLD ? 'publish' : 'draft'
    console.log(`  ${decision === 'publish' ? '🟢 发布' : '🟡 草稿'}  overall=${score.overall} steps=${uc.steps.length}`)
    if (score.issues?.length) console.log(`     ${score.issues.join('; ')}`)
  }

  const row = {
    title: uc.title,
    description: uc.description,
    tools: Array.isArray(uc.tools) ? uc.tools : [],
    industry: uc.industry,
    difficulty: uc.difficulty,
    estimated_time: uc.estimated_time || '',
    steps: uc.steps,
    tags: Array.isArray(uc.tags) ? uc.tags : [],
    is_featured: false,
    published_at: decision === 'publish' ? new Date().toISOString() : null
  }

  let action = decision
  if (!DRY) {
    try { action = `${decision}:${await insertUseCase(row)}`; existingTitles.add(uc.title.trim()) }
    catch (e) { action = 'error'; console.log(`     ✗ 写库失败: ${e.message}`) }
  }
  results.push({ _scene: p.scene, title: uc.title, industry: uc.industry, difficulty: uc.difficulty, decision, action, score: score?.overall ?? null, sources: arts.map(a => a.content_url) })
  if (!DRY) writeFileSync(OUT, JSON.stringify(results, null, 2))
  if (decision === 'publish') pub++; else draft++
}

console.log(`\n${DRY ? '[DRY-RUN] ' : ''}完成：发布 ${pub}，草稿 ${draft}`)
if (!DRY) console.log(`记录写入 ${OUT}`)
console.log('DeepSeek 用量:', ds.costEstimate())
