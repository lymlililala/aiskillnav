// 4) 发布：质量闸门 + DeepSeek 自评分。过线 → published_at=now（可见）；否则 → null（草稿）。
// 用法：
//   node scripts/wechat/4-publish.mjs --dry-run     # 只打印评分与判定，不入库
//   node scripts/wechat/4-publish.mjs               # 实际写库
//   node scripts/wechat/4-publish.mjs --threshold 75

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { checkQuality } from './lib/quality.mjs'
import { upsertTutorial } from './lib/supabase.mjs'
import { DATA_DIR } from './lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = arg('--dry-run', false) === true
const THRESHOLD = Number(arg('--threshold', 80))

const DRAFTS = join(DATA_DIR, 'drafts.json')
const OUT = join(DATA_DIR, 'published.json')
if (!existsSync(DRAFTS)) { console.error('缺少 drafts.json，先跑 3-synthesize.mjs'); process.exit(1) }
const drafts = JSON.parse(readFileSync(DRAFTS, 'utf8'))

const ds = new DeepSeek()
const SCORE_SYS = `你是严格的内容质量审核员。给下面这篇中文技术教程按 4 个维度打分(各 0-100)并给总分：
- originality 原创度（是否像综合提炼的原创，而非洗稿/拼凑）
- depth 深度与信息密度
- accuracy 技术准确性（有无明显错误/编造）
- readability 结构与可读性
只返回 JSON：{"originality":int,"depth":int,"accuracy":int,"readability":int,"overall":int,"issues":["问题简述"]}`

const results = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const donePub = new Set(results.filter(r => r.action && r.action !== 'error').map(r => r.slug))

let pub = 0, draft = 0, rejected = 0

for (const d of drafts) {
  if (donePub.has(d.slug)) { console.log(`✓ 已处理跳过 ${d.slug}`); continue }

  // 硬性闸门
  const q = checkQuality(d)
  let score = null, decision, reasonText

  if (!q.pass) {
    decision = 'draft'
    reasonText = `闸门未过: ${q.reasons.join(',')}`
  } else {
    // 软性：AI 自评分
    try {
      score = await ds.chatJSON(
        [{ role: 'system', content: SCORE_SYS }, { role: 'user', content: `标题：${d.title}\n\n${d.content}` }],
        { maxTokens: 600 }
      )
    } catch (e) {
      score = { overall: 0, issues: ['评分失败:' + e.message] }
    }
    decision = (score.overall ?? 0) >= THRESHOLD ? 'publish' : 'draft'
    reasonText = `overall=${score.overall} (阈值${THRESHOLD}) faq=${q.faqPairs} len=${q.len}`
  }

  console.log(`${decision === 'publish' ? '🟢 发布' : '🟡 草稿'}  ${d.slug}`)
  console.log(`     ${reasonText}`)
  if (score?.issues?.length) console.log(`     问题: ${score.issues.join('; ')}`)

  const row = {
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle || null,
    summary: d.summary || null,
    content: d.content,
    level: d.level || 'intermediate',
    category: d.category || 'concept',
    tags: d.tags || [],
    estimated_minutes: d.estimated_minutes || 10,
    // 草稿 = null（站内不可见但详情页可渲染）；发布 = now
    published_at: decision === 'publish' ? new Date().toISOString() : null
  }

  let action = decision
  if (!DRY) {
    try {
      const r = await upsertTutorial(row)
      action = `${decision}:${r}`
    } catch (e) {
      action = 'error'
      console.log(`     ✗ 写库失败: ${e.message}`)
    }
  }

  results.push({ slug: d.slug, decision, action, score: score?.overall ?? null, quality: q.reasons, sources: d._sources?.map(s => s.url) })
  if (!DRY) writeFileSync(OUT, JSON.stringify(results, null, 2))
  if (decision === 'publish') pub++; else draft++
}

console.log(`\n${DRY ? '[DRY-RUN] ' : ''}完成：发布 ${pub}，草稿 ${draft}`)
if (!DRY) console.log(`记录写入 ${OUT}`)
console.log('DeepSeek 用量:', ds.costEstimate())
