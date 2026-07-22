#!/usr/bin/env node
/** 只读：核对 tags 注册表 16 个标签的 DB 匹配量（tags 数组重叠语义，与页面查询一致） */
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' };

const TAGS = [
  'developer-tools', 'browser-automation', 'databases', 'finance-fintech',
  'knowledge-memory', 'coding-agents', 'cloud-platforms', 'communication',
  'file-systems', 'data-platforms', 'aggregators',
  'biology-medicine-and-bioinformatics', 'python', 'llm', 'comparison', 'ai-tools'
];

async function count(table, tag, extra = '') {
  const ov = encodeURIComponent(`{"${tag}"}`);
  const r = await fetch(`${base}/rest/v1/${table}?select=id&tags=ov.${ov}${extra}&limit=1`, {
    headers
  });
  const cr = r.headers.get('content-range') ?? '0/0';
  return parseInt(cr.split('/')[1] ?? '0');
}

let bad = 0;
for (const t of TAGS) {
  const [tut, mcp, ag] = await Promise.all([
    count('tutorials', t, '&published_at=not.is.null'),
    count('mcp_servers', t),
    count('agents', t, '&status=eq.published')
  ]);
  const total = tut + mcp + ag;
  if (total < 8) bad++;
  console.log(
    `${total >= 8 ? '✓' : '✗'} ${t.padEnd(36)} tut=${tut} mcp=${mcp} agent=${ag} total=${total}`
  );
}
process.exit(bad ? 1 : 0);
