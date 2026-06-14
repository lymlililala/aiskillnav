// 2) 聚类：DeepSeek 对源文池语义聚类，产出适合写常青教程的主题簇（每簇 3-6 篇）。
// 数据源：Supabase wx_sources（读最近 N 天，无需重爬）。
// 用法：node scripts/wechat/2-cluster.mjs --days 14 --max-clusters 8

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { DeepSeek } from './deepseek.mjs'
import { DATA_DIR } from './lib/env.mjs'
import { fetchSources } from './lib/sources.mjs'
import { mkdirSync } from 'node:fs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  return i === -1 ? def : process.argv[i + 1]
}
const MAX_CLUSTERS = Number(arg('--max-clusters', 8))
const DAYS = Number(arg('--days', 14))

mkdirSync(DATA_DIR, { recursive: true })
const OUT = join(DATA_DIR, 'clusters.json')

const sources = (await fetchSources({ sinceDays: DAYS, minBodyLen: 200 }))
console.log(`从 wx_sources 读取最近 ${DAYS} 天：${sources.length} 篇`)
// 给模型的精简清单（不含全文，省 token）
const list = sources.map((s, i) => ({ id: i, account: s.account, title: s.title, digest: (s.digest || '').slice(0, 80) }))

// 站内 14 个支柱主题，提示模型 tags 向其靠拢
const PILLAR_TOKENS = ['rag','agent','multi-agent','model-deployment','vllm','workflow','n8n','openai','gpt','claude','anthropic','langchain','langgraph','fine-tuning','lora','rlhf','prompt-engineering','cot','mcp','evaluation','benchmark','security','prompt-injection','api','function-calling']

const ds = new DeepSeek()

const sys = `你是资深 AI 技术内容主编。下面是一批从 AI/科技公众号采集的文章（仅标题与摘要）。
任务：把它们按语义聚成若干「适合写成常青深度教程/解析」的主题簇。

要求：
1. 每簇挑选 3-6 篇语义最相关、能互相补充的源文（给出它们的 id）。
2. 剔除：纯时效新闻/快讯、营销软文、招聘、无技术沉淀价值的内容（不要硬凑成簇）。
3. 优先能写成「常青教程」的技术主题（原理/实战/选型/最佳实践），而非一次性事件。
4. 主题应尽量贴合这些站内标签词（用于内链聚合）：${PILLAR_TOKENS.join(', ')}。
5. 最多产出 ${MAX_CLUSTERS} 个簇，宁缺毋滥。

只返回 JSON：
{"clusters":[{
  "topic":"中文主题名",
  "working_title":"拟定的中文文章标题(吸引点击但不标题党)",
  "angle":"这篇文章独特的切入角度/能给读者什么(一句话)",
  "source_ids":[整数数组],
  "suggested_category":"concept|hands-on|agent|mcp 之一",
  "suggested_tags":["英文小写标签，尽量命中上面的标签词"],
  "suggested_level":"beginner|intermediate|advanced"
}]}`

console.log(`对 ${list.length} 篇源文聚类（最多 ${MAX_CLUSTERS} 簇）…`)
const out = await ds.chatJSON(
  [{ role: 'system', content: sys }, { role: 'user', content: JSON.stringify(list) }],
  { maxTokens: 4000 }
)

const clusters = (out.clusters || []).filter(c => Array.isArray(c.source_ids) && c.source_ids.length >= 2)
// 回填源文引用（sn / title），供下一步取全文
for (const c of clusters) {
  c.sources = c.source_ids.map(id => sources[id]).filter(Boolean).map(s => ({ sn: s.sn, account: s.account, title: s.title }))
}

writeFileSync(OUT, JSON.stringify(clusters, null, 2))
console.log(`\n产出 ${clusters.length} 个主题簇 → ${OUT}`)
for (const c of clusters) console.log(`  · [${c.suggested_category}] ${c.working_title}  (${c.source_ids.length} 源文)`)
console.log('用量:', ds.costEstimate())
console.log('⚠️  请打开 clusters.json 审一遍主题归并是否合理，再跑 3-synthesize.mjs')
