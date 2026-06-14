// 1) 采集：逐号取历史文章列表 + 正文，落 data/sources.json（按 sn 去重，增量）。
// 用法：
//   node scripts/wechat/1-crawl.mjs                 # 默认每号 2 页(~20篇)
//   node scripts/wechat/1-crawl.mjs --max-pages 1   # 试跑省钱
//   node scripts/wechat/1-crawl.mjs --since 2026-05-01   # 只要该日期后的
//   node scripts/wechat/1-crawl.mjs --no-body        # 只拉列表不拉正文(省钱预览)

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { CimiClient } from './cimidata/client.mjs'
import { htmlToText } from './lib/clean-html.mjs'
import { DATA_DIR, ACCOUNTS_FILE } from './lib/env.mjs'

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}

const MAX_PAGES = Number(arg('--max-pages', 2))
const SINCE = arg('--since', null) // YYYY-MM-DD
const NO_BODY = arg('--no-body', false) === true

mkdirSync(DATA_DIR, { recursive: true })
const ACC_FILE = ACCOUNTS_FILE
const OUT = join(DATA_DIR, 'sources.json')

if (!existsSync(ACC_FILE)) {
  console.error('缺少 data/accounts.json，请先跑 node scripts/wechat/accounts.mjs')
  process.exit(1)
}
const accounts = JSON.parse(readFileSync(ACC_FILE, 'utf8')).filter(a => a.wxid)

// 已采集的（增量），按 sn 去重
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const bySn = new Map(existing.map(s => [s.sn, s]))

function snOf(url) {
  const m = url.match(/[?&]sn=([0-9a-f]+)/i)
  return m ? m[1] : url
}

const cimi = new CimiClient()
const sinceTs = SINCE ? new Date(SINCE).getTime() : null
let newCount = 0, bodyCount = 0

console.log(`采集 ${accounts.length} 个号，每号最多 ${MAX_PAGES} 页${SINCE ? `，仅 ${SINCE} 之后` : ''}${NO_BODY ? '，跳过正文' : ''}\n`)

for (const acc of accounts) {
  let got = 0
  try {
    for await (const item of cimi.iterAccountHistory(acc.wxid, { maxPages: MAX_PAGES })) {
      const sn = snOf(item.content_url)
      if (bySn.has(sn)) continue
      if (sinceTs && new Date(item.published_at).getTime() < sinceTs) continue
      const rec = {
        sn,
        account: acc.name,
        wxid: acc.wxid,
        title: item.title,
        digest: item.digest || '',
        content_url: item.content_url,
        published_at: item.published_at,
        body_text: ''
      }
      bySn.set(sn, rec)
      got++
      newCount++
    }
    console.log(`  ${acc.name}: 新增 ${got} 篇`)
  } catch (e) {
    console.log(`  ${acc.name}: 列表出错 ${e.message}`)
  }
}

// 拉正文（只拉缺正文的）
if (!NO_BODY) {
  const need = [...bySn.values()].filter(s => !s.body_text)
  console.log(`\n拉取正文 ${need.length} 篇 …`)
  for (const s of need) {
    try {
      const html = await cimi.articleBody(s.content_url)
      s.body_text = htmlToText(html)
      bodyCount++
      if (bodyCount % 10 === 0) {
        console.log(`  …${bodyCount}/${need.length}  余额 ${cimi.balance}`)
        writeFileSync(OUT, JSON.stringify([...bySn.values()], null, 2)) // 阶段性保存防中断丢失
      }
    } catch (e) {
      console.log(`  正文失败 [${s.account}] ${s.title?.slice(0, 20)}: ${e.message}`)
    }
  }
}

const all = [...bySn.values()]
writeFileSync(OUT, JSON.stringify(all, null, 2))
console.log(`\n已写入 ${OUT}`)
console.log(`总计 ${all.length} 篇（本次新增 ${newCount}，拉正文 ${bodyCount}），余额 ${cimi.balance}`)
