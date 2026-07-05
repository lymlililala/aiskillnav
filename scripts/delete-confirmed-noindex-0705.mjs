/**
 * 删除 GSC 已确认 noindex 的损坏教程页（2026-07-05）。
 * 安全闸：只删「在 GSC noindex 报告」∩「在 NOINDEX_TUTORIAL_SLUGS 名单」的 slug。
 * 报告里但不在名单的 slug 一律跳过并告警（可能是别的原因 noindex 的正经页）。
 * 删前把整行导出到 output/ 备份。
 * dry-run（默认，只报告+备份）：node scripts/delete-confirmed-noindex-0705.mjs
 * 真删：           node scripts/delete-confirmed-noindex-0705.mjs --commit
 */
import { readFileSync, writeFileSync } from 'node:fs';

const COMMIT = process.argv.includes('--commit');
const BASE = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY =
  process.env.SUPABASE_SECRET_KEY ||
  readFileSync('scripts/insert-rewrite-batchE-0612.mjs', 'utf8').match(/sb_secret_\w+/)[0];
const H = { Authorization: 'Bearer ' + KEY, apikey: KEY, 'Content-Type': 'application/json' };

// 1) GSC 报告里的 tutorial slug
const gsc = JSON.parse(readFileSync('/tmp/gsc_noindex_slugs.json', 'utf8'));

// 2) 我们主动 noindex 名单
const src = readFileSync('src/features/tutorials/noindex-slugs.ts', 'utf8');
const listed = new Set([...src.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]));

// 3) 交叉核对
const deletable = gsc.filter((s) => listed.has(s));
const notListed = gsc.filter((s) => !listed.has(s)); // 报告里但不在名单 → 不删，告警

console.log(`GSC tutorial slugs: ${gsc.length}`);
console.log(`∩ noindex 名单（可删）: ${deletable.length}`);
if (notListed.length) {
  console.log(`⚠️ 在报告但不在名单，跳过不删（请人工确认）:`);
  notListed.forEach((s) => console.log('   -', s));
}

// 4) 拉取整行备份
const rows = [];
for (let i = 0; i < deletable.length; i += 20) {
  const batch = deletable.slice(i, i + 20);
  const r = await fetch(
    `${BASE}/rest/v1/tutorials?select=*&slug=in.(${batch.map((s) => `"${s}"`).join(',')})`,
    { headers: H }
  );
  const j = await r.json();
  if (!Array.isArray(j)) { console.error(j); process.exit(1); }
  rows.push(...j);
}
const foundSlugs = new Set(rows.map((r) => r.slug));
const missing = deletable.filter((s) => !foundSlugs.has(s));
console.log(`DB 命中: ${rows.length} 行` + (missing.length ? `；DB 已不存在: ${missing.length}（${missing.join(', ')}）` : ''));

const backupPath = `output/deleted-tutorials-noindex-0705.json`;
writeFileSync(backupPath, JSON.stringify(rows, null, 2));
console.log(`备份已写入: ${backupPath}`);

if (!COMMIT) {
  console.log('\n[dry-run] 未删除。确认无误后加 --commit 执行删除。');
  process.exit(0);
}

// 5) 删除
let deleted = 0;
for (let i = 0; i < deletable.length; i += 20) {
  const batch = deletable.slice(i, i + 20);
  const r = await fetch(
    `${BASE}/rest/v1/tutorials?slug=in.(${batch.map((s) => `"${s}"`).join(',')})`,
    { method: 'DELETE', headers: { ...H, Prefer: 'return=representation' } }
  );
  const j = await r.json();
  if (!Array.isArray(j)) { console.error('删除失败:', j); process.exit(1); }
  deleted += j.length;
}
console.log(`\n✅ 已删除 ${deleted} 行。`);
