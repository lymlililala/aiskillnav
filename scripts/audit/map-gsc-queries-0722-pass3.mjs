#!/usr/bin/env node
/** 只读第三轮：news 真实结构 + fields medal 排查 + 重点 news 体检 */
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}` };

async function q(path) {
  const r = await fetch(`${base}/rest/v1/${path}`, { headers });
  const rows = await r.json();
  return rows;
}

// 1) news 真实列
const one = await q('news?select=*&limit=1');
console.log('=== news 实际列 ===');
console.log(Object.keys(one[0] ?? {}).join(', '));

// 2) fields medal / 菲尔兹 / leak 全站排查（news 按 title+summary；tutorials 按 title+summary+content）
console.log('\n=== fields/菲尔兹/leak 排查 ===');
for (const term of ['fields', '菲尔兹', 'leak', '泄露']) {
  const n = await q(`news?select=slug,title,published_at,status&or=(title.ilike.*${encodeURIComponent(term)}*,summary.ilike.*${encodeURIComponent(term)}*)&limit=8`);
  for (const r of n) console.log(`  [news ${term}] ${r.slug} | ${r.title} | pub=${r.published_at} status=${r.status}`);
  const t = await q(`tutorials?select=slug,title,published_at&or=(title.ilike.*${encodeURIComponent(term)}*,summary.ilike.*${encodeURIComponent(term)}*)&limit=8`);
  for (const r of t) console.log(`  [tut ${term}] ${r.slug} | ${r.title} | pub=${r.published_at}`);
}

// 3) 重点 news 体检
console.log('\n=== 重点 news 体检 ===');
for (const slug of [
  'ai-automation-jobs-future-of-work-2025',
  'ai-replaces-jobs-real-data-2026',
  'tencent-rxbrain-embodied-ai-model-cmr547',
  'huawei-tao-scaling-v2-paper-update-ystdq2',
  'gpt-5-6-leaks-and-rumors-75srjj'
]) {
  const rows = await q(`news?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  const r = rows[0];
  if (!r) {
    console.log(`  ${slug}: NOT FOUND`);
    continue;
  }
  console.log(`  ${r.slug} | status=${r.status} pub=${r.published_at}`);
  console.log(`    title=${r.title}`);
  console.log(`    summary(${(r.summary ?? '').length}字)=${(r.summary ?? '').slice(0, 200)}`);
  if ('content' in r) console.log(`    content长度=${r.content?.length ?? 0}`);
  console.log(`    tags=${JSON.stringify(r.tags)} source=${r.source_name}`);
}

// 4) 世界经济论坛词簇在 tutorials content 里的匹配
console.log('\n=== tutorials content 含"世界经济论坛" ===');
const wef = await q(`tutorials?select=slug,title,published_at,en_status&content=ilike.*${encodeURIComponent('世界经济论坛')}*&limit=8`);
for (const r of wef) console.log(`  ${r.slug} | ${r.title} | pub=${r.published_at ?? 'NULL'} en=${r.en_status ?? '-'}`);
