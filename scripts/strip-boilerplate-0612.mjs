/**
 * 剥离批量套话段 2026-06-12：298 篇「正文真实但带批量套话头尾」的净化
 * 套话定义：在原 1496 篇语料里被 ≥5 篇共享的 100-500 字符纯文段（无代码/表格/链接）。
 * 用 --dry-run 输出预览不写库。备份在 backups-batch4-20260612.json。
 * node scripts/strip-boilerplate-0612.mjs [--dry-run]
 */
import { readFileSync } from 'node:fs';

const BASE = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY =
  process.env.SUPABASE_SECRET_KEY ||
  readFileSync('scripts/insert-rewrite-batchE-0612.mjs', 'utf8').match(/sb_secret_\w+/)[0];
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY, apikey: KEY };
const DRY = process.argv.includes('--dry-run');

// 语料 = 当前可见 + 第四批备份（≈ 原 1496 集合），保证套话计数口径一致
const corpus = [];
let from = 0;
while (true) {
  const r = await fetch(
    `${BASE}/rest/v1/tutorials?select=slug,content&published_at=not.is.null&order=slug&offset=${from}&limit=200`,
    { headers: { Authorization: H.Authorization, apikey: H.apikey } }
  );
  const rows = await r.json();
  corpus.push(...rows);
  if (rows.length < 200) break;
  from += 200;
}
for (const r of JSON.parse(readFileSync('backups-batch4-20260612.json', 'utf8')))
  if (!corpus.some((c) => c.slug === r.slug)) corpus.push({ slug: r.slug, content: r.content });

const isProse = (t) => t.length > 100 && t.length < 500 && !/[`|\[\]#]/.test(t);
const paraCount = new Map();
for (const r of corpus)
  for (const p of (r.content || '').split(/\n{2,}/)) {
    const t = p.trim();
    if (isProse(t)) paraCount.set(t, (paraCount.get(t) || 0) + 1);
  }

const targets = readFileSync('/tmp/batch4-strip.txt', 'utf8').trim().split('\n');
const bySlug = Object.fromEntries(corpus.map((r) => [r.slug, r.content || '']));

let done = 0, totalRemoved = 0;
for (const slug of targets) {
  const c = bySlug[slug];
  if (!c) { console.error('MISS', slug); continue; }
  const kept = [];
  let removed = 0;
  for (const p of c.split(/\n{2,}/)) {
    const t = p.trim();
    if (isProse(t) && (paraCount.get(t) || 0) >= 5) { removed++; continue; }
    kept.push(p);
  }
  if (!removed) { done++; continue; }
  const cleaned = kept.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  totalRemoved += removed;
  if (DRY) {
    if (done < 2) {
      console.log(`=== ${slug}: 移除 ${removed} 段, ${c.length}→${cleaned.length}`);
      // 展示被移除的段
      for (const p of c.split(/\n{2,}/)) {
        const t = p.trim();
        if (isProse(t) && (paraCount.get(t) || 0) >= 5)
          console.log('  [删]', t.slice(0, 80).replace(/\n/g, ' '));
      }
    }
    done++;
    continue;
  }
  const r = await fetch(`${BASE}/rest/v1/tutorials?slug=eq.${slug}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ content: cleaned })
  });
  if (r.ok) done++;
  else console.error('ERR', slug, r.status);
}
console.log(`${DRY ? '[DRY] ' : ''}处理 ${done}/${targets.length} 篇，共移除 ${totalRemoved} 段套话`);
