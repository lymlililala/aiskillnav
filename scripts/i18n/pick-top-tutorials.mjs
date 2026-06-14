// 从 GSC Performance xlsx 的「网页」sheet 选出高流量教程 slug，供优先翻译。
// 零依赖：xlsx 即 zip+xml，用系统 unzip 取出 xml 再正则解析。
// 用法：
//   node scripts/i18n/pick-top-tutorials.mjs                 # 默认 top 50
//   node scripts/i18n/pick-top-tutorials.mjs --top 100
//   node scripts/i18n/pick-top-tutorials.mjs --file <xlsx路径>

import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dir, 'data')

function arg(name, def) {
  const i = process.argv.indexOf(name)
  return i === -1 ? def : process.argv[i + 1]
}
const TOP = Number(arg('--top', 50))

// 定位 GSC Performance xlsx
function findXlsx() {
  const cli = arg('--file', null)
  if (cli) return cli
  const gscRoot = join(__dir, '..', '..', 'gsc')
  if (!existsSync(gscRoot)) return null
  // 取最新日期目录下的 Performance 文件
  const dirs = readdirSync(gscRoot).filter(d => /^\d{8}$/.test(d)).sort().reverse()
  for (const d of dirs) {
    const sub = join(gscRoot, d)
    const f = readdirSync(sub).find(x => /Performance-on-Search.*\.xlsx$/.test(x))
    if (f) return join(sub, f)
  }
  return null
}

const xlsx = findXlsx()
if (!xlsx) { console.error('找不到 GSC Performance xlsx，请用 --file 指定'); process.exit(1) }
console.log('解析:', xlsx)

function unzipEntry(entry) {
  return execFileSync('unzip', ['-p', xlsx, entry], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8')
}

// sharedStrings：所有字符串按索引存放
const ss = unzipEntry('xl/sharedStrings.xml')
const strings = []
for (const m of ss.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
  // 取 <t> 文本（可能多段），去标签
  const text = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => x[1]).join('')
  strings.push(text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
}

// 「网页」sheet = sheet3（workbook 第3个）。每行：A=URL(字符串索引) B=点击 C=曝光 D=CTR E=排名
const sheet = unzipEntry('xl/worksheets/sheet3.xml')
const rows = []
for (const rm of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
  const cells = {}
  for (const cm of rm[1].matchAll(/<c r="([A-Z]+)\d+"(?:[^>]*?)\s+t="(\w)"[^>]*><v>([\s\S]*?)<\/v><\/c>|<c r="([A-Z]+)\d+"[^>]*><v>([\s\S]*?)<\/v><\/c>/g)) {
    const col = cm[1] || cm[4]
    const type = cm[2]
    const val = cm[3] ?? cm[5]
    cells[col] = { type, val }
  }
  if (!cells.A) continue
  const url = cells.A.type === 's' ? strings[Number(cells.A.val)] : cells.A.val
  const clicks = cells.B ? Number(cells.B.val) : 0
  const imps = cells.C ? Number(cells.C.val) : 0
  rows.push({ url, clicks, imps })
}

// 过滤教程 URL，提取 slug，按点击→曝光排序
const TUT_RE = /\/tutorials\/([a-z0-9-]+)\/?$/i
const tutorials = rows
  .map(r => {
    const m = (r.url || '').match(TUT_RE)
    return m ? { slug: m[1], clicks: r.clicks, imps: r.imps } : null
  })
  .filter(Boolean)
  .filter(t => t.imps > 0 || t.clicks > 0)
  .sort((a, b) => b.clicks - a.clicks || b.imps - a.imps)

const top = tutorials.slice(0, TOP)
mkdirSync(DATA_DIR, { recursive: true })
const OUT = join(DATA_DIR, 'top-slugs.json')
writeFileSync(OUT, JSON.stringify(top, null, 2))

console.log(`教程 URL 共 ${tutorials.length} 条，取 top ${top.length} → ${OUT}\n`)
console.log('Top 15 预览（点击 / 曝光 / slug）:')
for (const t of top.slice(0, 15)) console.log(`  ${String(t.clicks).padStart(4)} ${String(t.imps).padStart(6)}  ${t.slug}`)
