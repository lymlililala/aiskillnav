// 内容盘点：直查 Supabase REST（PostgREST），零依赖。
// 统计 tutorials 的发布状态、正文字数分布、疑似模板文占比，以及其他内容表的量级。
import { readFileSync } from 'node:fs';

// --- 读取 .env.local ---
const env = {};
for (const line of readFileSync(new URL('../../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function count(table, filter = '') {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=id${filter}`, {
    headers: { ...H, Prefer: 'count=exact', Range: '0-0' }
  });
  const cr = res.headers.get('content-range') || '';
  return Number(cr.split('/')[1] || 0);
}

async function fetchAll(table, select, filter = '') {
  const out = [];
  let from = 0;
  const step = 1000;
  for (;;) {
    const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=${select}${filter}`, {
      headers: { ...H, Range: `${from}-${from + step - 1}` }
    });
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) break;
    out.push(...rows);
    if (rows.length < step) break;
    from += step;
  }
  return out;
}

// 中文按字符计，英文按词近似——统一用「非空白字符数」当正文体量指标
const bodyLen = (s) => (s || '').replace(/\s/g, '').length;

// 疑似模板/批量文特征：编造跑分表、假 benchmark、统一模板句式
function templateSignals(t) {
  const c = t.content || '';
  const sig = [];
  if (/\|\s*(基准|跑分|得分|分数|benchmark|score)/i.test(c)) sig.push('跑分表');
  if (/(在.*测试中|实测|实际测试).*(得分|分数|准确率)\s*[:：]?\s*\d/i.test(c)) sig.push('编造实测数');
  if (/综上所述|总而言之/.test(c) && c.length < 1200) sig.push('模板短文');
  return sig;
}

const line = '─'.repeat(60);

// ===== tutorials =====
const tuts = await fetchAll(
  'tutorials',
  'slug,title,category,level,published_at,en_status,content'
);
const published = tuts.filter((t) => t.published_at);
const hidden = tuts.filter((t) => !t.published_at);

const buckets = { '<500': 0, '500-1000': 0, '1000-1500': 0, '1500-2500': 0, '2500+': 0 };
for (const t of published) {
  const n = bodyLen(t.content);
  if (n < 500) buckets['<500']++;
  else if (n < 1000) buckets['500-1000']++;
  else if (n < 1500) buckets['1000-1500']++;
  else if (n < 2500) buckets['1500-2500']++;
  else buckets['2500+']++;
}

const templated = published.filter((t) => templateSignals(t).length);
const enPub = tuts.filter((t) => t.en_status === 'published').length;
const hasFaq = published.filter((t) => /##\s*FAQ/i.test(t.content || '')).length;

console.log(line);
console.log('TUTORIALS（教程）');
console.log(line);
console.log(`总行数：            ${tuts.length}`);
console.log(`已发布(索引中)：    ${published.length}`);
console.log(`已降级/noindex：    ${hidden.length}   (published_at 置空)`);
console.log(`英文版已发布：      ${enPub}`);
console.log(`含 ## FAQ(重写批次)：${hasFaq}`);
console.log('');
console.log('已发布教程正文字数分布（非空白字符数）：');
for (const [k, v] of Object.entries(buckets)) {
  const bar = '█'.repeat(Math.round((v / Math.max(published.length, 1)) * 40));
  console.log(`  ${k.padEnd(10)} ${String(v).padStart(4)}  ${bar}`);
}
const okLong = buckets['1500-2500'] + buckets['2500+'];
console.log('');
console.log(`>=1500 字的「达标长文」：${okLong} 篇  (占已发布 ${((okLong / Math.max(published.length, 1)) * 100).toFixed(0)}%)`);
console.log(`疑似模板/批量文：       ${templated.length} 篇  (占已发布 ${((templated.length / Math.max(published.length, 1)) * 100).toFixed(0)}%)`);
if (templated.length) {
  console.log('  样例：');
  for (const t of templated.slice(0, 12)) {
    console.log(`   - [${templateSignals(t).join(',')}] ${t.slug}  (${bodyLen(t.content)}字)`);
  }
}

// 分类分布（已发布）
const byCat = {};
for (const t of published) byCat[t.category] = (byCat[t.category] || 0) + 1;
console.log('');
console.log('已发布教程分类分布：');
for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(k).padEnd(16)} ${v}`);
}

// ===== 其他内容表量级（薄列表页规模） =====
console.log('');
console.log(line);
console.log('其他内容表（列表/详情页规模）');
console.log(line);
for (const tb of ['skills', 'agents', 'mcp', 'models', 'usecases', 'news']) {
  try {
    const n = await count(tb);
    console.log(`  ${tb.padEnd(12)} ${n}`);
  } catch {
    console.log(`  ${tb.padEnd(12)} (查询失败)`);
  }
}
console.log(line);
