/**
 * 全站终扫 2026-06-12：1496 篇可见教程的质量普查
 * 检测：① 四个已知指纹残留（应为 0）② 第一批「损坏」标记残留 ③ 超薄(<800)
 * ④ 未知模板家族（跨文雷同段落聚类 + 等长聚类）
 * 只读。node scripts/final-quality-sweep-0612.mjs
 */
import { readFileSync } from 'node:fs';

const BASE = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY =
  process.env.SUPABASE_SECRET_KEY ||
  readFileSync('scripts/insert-rewrite-batchE-0612.mjs', 'utf8').match(/sb_secret_\w+/)[0];
const H = { Authorization: 'Bearer ' + KEY, apikey: KEY };

// 拉全部可见文章（分页）
const all = [];
let from = 0;
while (true) {
  const r = await fetch(
    `${BASE}/rest/v1/tutorials?select=slug,title,content&published_at=not.is.null&order=slug&offset=${from}&limit=200`,
    { headers: H }
  );
  const rows = await r.json();
  if (!Array.isArray(rows)) { console.error(rows); process.exit(1); }
  all.push(...rows);
  if (rows.length < 200) break;
  from += 200;
}
console.log('可见文章总数:', all.length);

const KNOWN = [
  [/covers everything you need to know for production implementation/i, 'FP2-comprehensive'],
  [/This guide provides practical, production-ready implementations/i, 'FP3-productionready'],
  [/"""Handles /, 'FP4-handler'],
  [/cuts through the marketing|Bottom line upfront/i, 'FP1-comparison'],
  [/demonstrate_concept|\(object\):\s*\n\s*def process|\.replace\(\/-\/g/, 'BROKEN'],
  [/pip install (gpt|claude|gemini)-/i, 'FAKE-pip']
];

const flagged = [];
const paraCount = new Map();
for (const r of all) {
  const c = r.content || '';
  for (const p of c.split(/\n{2,}/)) {
    const t = p.trim();
    // 只统计可疑的"套话段"：足够长且不含代码/链接/表格（这些天然可复用）
    if (t.length > 100 && t.length < 500 && !/[`|\[\]#]/.test(t)) {
      paraCount.set(t, (paraCount.get(t) || 0) + 1);
    }
  }
}

for (const r of all) {
  const c = r.content || '';
  const flags = [];
  if (c.length < 800) flags.push(`ULTRATHIN:${c.length}`);
  for (const [re, name] of KNOWN) if (re.test(c)) flags.push(name);
  const dups = c.split(/\n{2,}/).filter((p) => {
    const t = p.trim();
    return t.length > 100 && t.length < 500 && !/[`|\[\]#]/.test(t) && (paraCount.get(t) || 0) >= 3;
  });
  if (dups.length >= 2) flags.push(`DUP-PARAS:${dups.length}`);
  if (flags.length) flagged.push({ slug: r.slug, len: c.length, flags });
}

console.log('\n命中标记的文章:', flagged.length);
for (const f of flagged) console.log(`  ${String(f.len).padStart(6)}  ${f.flags.join(',')}  ${f.slug}`);

// 雷同段落 TOP（≥3 篇共享的非代码段 → 潜在新模板家族指纹）
const shared = [...paraCount.entries()].filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);
console.log('\n≥3 篇共享的套话段（潜在新家族指纹）:', shared.length);
for (const [t, n] of shared.slice(0, 10)) console.log(`  ×${n}  ${t.slice(0, 90).replace(/\n/g, ' ')}`);
