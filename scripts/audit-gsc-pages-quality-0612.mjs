/**
 * 审计 GSC 有曝光教程页的内容质量 2026-06-12
 * 输入：/tmp/gsc-tutorial-pages.txt（imps\tclicks\tpos\tslug，按曝光降序）
 * 输出：每页 内容长度 + 质量标记（薄/模板痕迹/损坏痕迹），用于排下一轮重写队列。
 * 只读。SUPABASE_SECRET_KEY 环境变量或从旧脚本提取。node scripts/audit-gsc-pages-quality-0612.mjs
 */
import { readFileSync } from 'node:fs';

const BASE = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY =
  process.env.SUPABASE_SECRET_KEY ||
  readFileSync('scripts/insert-rewrite-batchE-0612.mjs', 'utf8').match(/sb_secret_\w+/)[0];
const H = { Authorization: 'Bearer ' + KEY, apikey: KEY };

const lines = readFileSync('/tmp/gsc-tutorial-pages.txt', 'utf8').trim().split('\n');
const pages = lines.map((l) => {
  const [imps, clicks, pos, slug] = l.split('\t');
  return { imps: +imps, clicks: +clicks, pos: +pos, slug };
});

const rows = [];
for (let i = 0; i < pages.length; i += 20) {
  const batch = pages.slice(i, i + 20);
  const r = await fetch(
    `${BASE}/rest/v1/tutorials?select=slug,content&slug=in.(${batch.map((p) => `"${p.slug}"`).join(',')})`,
    { headers: H }
  );
  const j = await r.json();
  if (!Array.isArray(j)) { console.error(j); process.exit(1); }
  rows.push(...j);
}
const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r.content || '']));

// 质量标记
const MARKERS = [
  [/covers everything you need to know for production implementation/i, 'TMPL-fingerprint'],
  [/cuts through the marketing|Bottom line upfront/i, 'TMPL-comparison'],
  [/demonstrate_concept|\(object\):|class \w+Handler/, 'BROKEN-code'],
  [/pip install (gpt|claude|gemini)/i, 'FAKE-pip']
];

for (const p of pages) {
  const c = bySlug[p.slug];
  if (c === undefined) { console.log(`${p.imps}\t${p.pos}\tNOT-IN-DB\t-\t${p.slug}`); continue; }
  const flags = [];
  if (c.length < 2500) flags.push('THIN<2500');
  else if (c.length < 4000) flags.push('thin<4000');
  for (const [re, name] of MARKERS) if (re.test(c)) flags.push(name);
  console.log(`${p.imps}\t${p.pos}\t${c.length}\t${flags.join(',') || '-'}\t${p.slug}`);
}
