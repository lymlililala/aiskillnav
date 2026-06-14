// 0) 解析 20 个公众号名 → wxid。一次性步骤，结果落 data/accounts.json，人工核对。
// 用法：node scripts/wechat/accounts.mjs
//       node scripts/wechat/accounts.mjs --only "机器之心,量子位"   # 只解析部分

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { CimiClient } from './cimidata/client.mjs'
import { DATA_DIR, ACCOUNTS_FILE } from './lib/env.mjs'

// 目标公众号（来自用户提供的截图）
const ACCOUNT_NAMES = [
  'AI科技大本营', '机器之心', '李rumor', '谭少卿', '包包算法笔记', '智能超参数', '晚点LatePost',
  '苏哲管理咨询', 'AIGC开放社区', 'DataFunTalk', '夕小瑶科技说', '量子位', 'Founder Park', 'AINLPer',
  '新智元', '大模型最新论文', '甲维斯C', 'Z Finance', '腾讯研究院', 'Datawhale'
]

const onlyArg = process.argv.find(a => a.startsWith('--only'))
const only = onlyArg ? (onlyArg.split('=')[1] || process.argv[process.argv.indexOf(onlyArg) + 1] || '').split(',').map(s => s.trim()).filter(Boolean) : null
const names = only && only.length ? ACCOUNT_NAMES.filter(n => only.includes(n)) : ACCOUNT_NAMES

mkdirSync(DATA_DIR, { recursive: true })
const OUT = ACCOUNTS_FILE

// 已解析的保留（增量）
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const byName = new Map(existing.map(a => [a.name, a]))

const cimi = new CimiClient({ minIntervalMs: 2500 })
const sleep = ms => new Promise(r => setTimeout(r, ms))

// cimidata 搜索需预热：同名首次常报 1002「没有找到结果，请稍后再试」，重试即可。
async function searchWithRetry(name, tries = 4) {
  let lastErr
  for (let i = 0; i < tries; i++) {
    try {
      const r = await cimi.searchAccounts(name)
      if (r.length) return r
    } catch (e) {
      lastErr = e
      if (e.code !== 1002) throw e // 非「稍后再试」错误直接抛
    }
    await sleep(6000) // 等预热
  }
  if (lastErr) throw lastErr
  return []
}

console.log(`解析 ${names.length} 个公众号 wxid（含重试，较慢）…\n`)

for (const name of names) {
  if (byName.get(name)?.wxid) {
    console.log(`✓ 已有  ${name}  ${byName.get(name).wxid}`)
    continue
  }
  try {
    const accounts = await searchWithRetry(name)
    // 取昵称精确匹配优先，否则第一个
    const exact = accounts.find(a => a.nickname === name)
    const best = exact || accounts[0]
    if (!best) {
      console.log(`✗ 未找到  ${name}`)
      byName.set(name, { name, wxid: null, candidates: [] })
      continue
    }
    byName.set(name, {
      name,
      nickname: best.nickname,
      wxid: best.wxid,
      biz: best.biz,
      description: best.description,
      // 留候选供人工纠错（同名号问题）
      candidates: accounts.slice(0, 5).map(a => ({ nickname: a.nickname, wxid: a.wxid }))
    })
    const flag = exact ? '✓' : '?'
    console.log(`${flag} ${name}  →  ${best.nickname}  ${best.wxid}${exact ? '' : '  (非精确匹配，请核对)'}`)
  } catch (e) {
    console.log(`✗ 出错  ${name}: ${e.message}`)
    byName.set(name, { name, wxid: null, error: e.message })
  }
}

const result = ACCOUNT_NAMES.map(n => byName.get(n)).filter(Boolean)
writeFileSync(OUT, JSON.stringify(result, null, 2))
console.log(`\n已写入 ${OUT}`)
console.log(`成功 ${result.filter(a => a.wxid).length}/${ACCOUNT_NAMES.length}，余额 ${cimi.balance}`)
console.log('⚠️  请打开 accounts.json 核对带 (非精确匹配) 的项，必要时从 candidates 手动改 wxid')
