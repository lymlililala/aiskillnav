/**
 * 扫描零曝光 comparison 候选的正文质量 2026-06-12
 * 输入：/tmp/noindex-candidates.txt（71 个 slug）
 * 输出：每篇的模板垃圾特征标记（假代码 pip install <模型名>、编造跑分 94%/91%、
 * 空/短正文、跨文雷同段落），用于区分真垃圾 vs slug 误伤的正常文章。
 * 只读查询。node scripts/scan-comparison-quality-0612.mjs
 */
import { readFileSync } from 'node:fs';

const URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY = process.env.SUPABASE_SECRET_KEY;
if (!KEY) {
  console.error('需要环境变量 SUPABASE_SECRET_KEY');
  process.exit(1);
}
const H = { Authorization: 'Bearer ' + KEY, apikey: KEY };

const slugs = readFileSync('/tmp/noindex-candidates.txt', 'utf8').trim().split('\n');

// 分批 in 查询
const rows = [];
for (let i = 0; i < slugs.length; i += 20) {
  const batch = slugs.slice(i, i + 20);
  const r = await fetch(
    `${URL}/rest/v1/tutorials?select=slug,title,content&slug=in.(${batch.map((s) => `"${s}"`).join(',')})`,
    { headers: H }
  );
  const j = await r.json();
  if (!Array.isArray(j)) {
    console.error(j);
    process.exit(1);
  }
  rows.push(...j);
}

// 模板垃圾特征
const MARKERS = [
  [/pip install (gpt|claude|gemini|llama)[-\w]*/i, 'fake-pip-install'],
  [/94%.{0,40}91%|91%.{0,40}94%/s, 'fabricated-94-91'],
  [/\$0\.12/, 'fabricated-price-012'],
  [/decision framework/i, 'decision-framework'],
  [/## (Performance Benchmarks|Benchmark Results)/i, 'benchmark-section'],
  [/side-by-side comparison/i, 'side-by-side-phrase']
];

// 跨文雷同：抽每篇前 400 字符做指纹分组（粗粒度）
const paraCount = {};
for (const r of rows) {
  const c = r.content || '';
  for (const p of c.split('\n\n')) {
    const t = p.trim();
    if (t.length > 120) paraCount[t] = (paraCount[t] || 0) + 1;
  }
}

const out = [];
for (const r of rows) {
  const c = r.content || '';
  const flags = [];
  if (!c || c.length < 800) flags.push('thin<800');
  for (const [re, name] of MARKERS) if (re.test(c)) flags.push(name);
  const dupParas = c
    .split('\n\n')
    .filter((p) => p.trim().length > 120 && paraCount[p.trim()] > 1).length;
  if (dupParas > 0) flags.push(`dup-paras=${dupParas}`);
  out.push({ slug: r.slug, len: c.length, flags });
}
const found = new Set(rows.map((r) => r.slug));
for (const s of slugs) if (!found.has(s)) out.push({ slug: s, len: -1, flags: ['NOT-IN-DB'] });

out.sort((a, b) => b.flags.length - a.flags.length);
for (const o of out) console.log(`${String(o.len).padStart(6)}  ${o.flags.join(',') || '-'}  ${o.slug}`);
console.log(`\ntotal: ${out.length}, flagged: ${out.filter((o) => o.flags.length).length}`);
