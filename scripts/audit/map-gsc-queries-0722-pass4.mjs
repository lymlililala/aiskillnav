#!/usr/bin/env node
/** 只读第四轮：fields medal news 现状 + 三篇待复活 tutorial 内容质量 + schema 约束 */
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}` };
const q = async (p) => {
  const r = await fetch(`${base}/rest/v1/${p}`, { headers });
  return r.json();
};

// fields medal news 完整行
const [fm] = await q('news?select=*&slug=eq.fields-medal-leak-2026-wang-deng-n9masd&limit=1');
console.log('=== fields medal news ===');
console.log('title:', fm.title);
console.log('title_en:', fm.title_en ?? 'NULL');
console.log('en_status:', fm.en_status ?? 'NULL');
console.log(`summary(${fm.summary?.length}字):\n${fm.summary}\n`);

// 三篇待处理 tutorial 内容抽查
for (const slug of [
  'ai-cloud-cost-optimization-strategies',
  'groq-api-developer-guide-and-quick-start-2026-pv6asd',
  'mistral-large-3-api-complete-guide-2026-setup-features-best-practices-k89ew'
]) {
  const [t] = await q(
    `tutorials?select=slug,title,title_en,summary,published_at,en_status,level,category,tags,estimated_minutes,content,content_en&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  console.log(`=== ${slug} ===`);
  console.log(`title=${t.title} | title_en=${t.title_en ?? 'NULL'}`);
  console.log(`pub=${t.published_at ?? 'NULL'} en=${t.en_status ?? '-'} level=${t.level} cat=${t.category} min=${t.estimated_minutes}`);
  console.log(`tags=${JSON.stringify(t.tags)}`);
  console.log(`zh ${t.content?.length ?? 0}字 / en ${t.content_en?.length ?? 0}字`);
  console.log('--- zh 开头 600 字 ---');
  console.log((t.content ?? '').slice(0, 600));
  console.log('--- zh 结尾 300 字 ---');
  console.log((t.content ?? '').slice(-300));
  console.log();
}

// tutorials category 取值分布（了解合法值）
const cats = await q('tutorials?select=category&published_at=not.is.null&limit=500');
const dist = {};
for (const r of cats) dist[r.category] = (dist[r.category] ?? 0) + 1;
console.log('=== category 分布(已发布前500) ===', JSON.stringify(dist));
