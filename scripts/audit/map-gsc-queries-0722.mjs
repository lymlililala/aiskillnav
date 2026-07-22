#!/usr/bin/env node
/**
 * 只读：把 gsc/0715-0722 的重点查询映射到站内内容（Supabase PostgREST，零依赖）。
 * 用法：node scripts/audit/map-gsc-queries-0722.mjs
 */
import { readFileSync } from 'node:fs';

// 解析 .env.local（不打印任何值）
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) throw new Error('缺少 Supabase 环境变量');
const headers = { apikey: key, Authorization: `Bearer ${key}` };

const PROBES = [
  ['fields-medal', 'fields medal', 'fields medal leak/leaked/winners leaked (~83 imp, pos 9-14, 1 click)'],
  ['wef-jobs-zh', '世界经济论坛', '世界经济论坛 人工智能 就业报告 2025 词簇 (~30 imp, pos 12-20)'],
  ['wef-jobs-en', 'future of jobs', '同上英文'],
  ['joltsms', 'joltsms', 'joltsms (16 imp, pos 6.1, 0 click)'],
  ['rxbrain', 'rxbrain', 'rxbrain (7 imp, pos 6.3)'],
  ['tsgram', 'tsgram', 'tsgram (5 imp, pos 8.2)'],
  ['whenlabs', 'whenlabs', 'whenlabs (7 imp, pos 18.4)'],
  ['wopee', 'wopee', 'wopee.io (6 imp, pos 19.3)'],
  ['llm-cost', 'llm cost', 'llm cost optimization (40 imp, pos 76)'],
  ['llm-cost-zh', '成本优化', '中文成本优化相关'],
  ['llm-fallback', 'fallback', 'llm fallback/routing (42 imp, pos 52-83)'],
  ['ai-dlp', 'data loss prevention', 'ai dlp (31 imp, pos 87-90)'],
  ['clinical-doc', 'clinical documentation', 'ai/ambient clinical documentation (41 imp, pos 79-90)'],
  ['enterprise-genai', 'enterprise', 'enterprise generative ai (44 imp, pos 92-96)'],
  ['ai-chip', 'chip architecture', 'ai chip architecture (19 imp, pos 91)'],
  ['mistral', 'mistral', 'mistral large (18 imp, pos 83)'],
  ['groq', 'groq', 'groq api (15 imp, pos 78)'],
  ['credit-risk', 'credit risk', 'ai credit risk (14 imp, pos 85)'],
  ['cloud-cost', 'cloud cost', 'ai cloud cost optimization (14 imp, pos 66)'],
  ['notion-km', 'notion', 'notion knowledge management (13 imp, pos 35)'],
  ['vad', 'voice activity', 'voice activity detection (11 imp, pos 62)'],
  ['firecrawl', 'firecrawl', 'firecrawl mcp (10 imp, pos 73)'],
  ['hospital', 'hospital', 'technology for hospital operations (24 imp, pos 67)'],
  ['langserve', 'langserve', 'langserve vs fastapi (3 imp, pos 6)'],
  ['text2sql', 'text-to-sql', '中文 text-to-sql 世界杯 (3 imp, pos 6.3)'],
  ['gpt56', 'gpt-5.6', 'gpt5.6 juice (3 imp, pos 7.3)'],
  ['chinaxiv', 'chinaxiv', 'chinaxiv 202605.00224v2 (7 imp, pos 1-8)'],
  ['world-model', '世界模型', '世界模型最新进展 (1 click)'],
  ['langfuse', 'langfuse', 'langfuse (1 click, pos 73)'],
  ['mobile-next', 'mobile-next', 'mobile-next (1 click, pos 4)'],
  ['mckinsey-jobs', 'mckinsey', 'mckinsey report ai impact on jobs (多词 pos 1-2)'],
  ['rag-hallu', 'hallucination', 'rag hallucination reduction (多词 pos 1-4)']
];

const TABLES = [
  ['tutorials', 'slug,title,published_at,en_status', ['title', 'summary']],
  ['news', 'slug,title,published_at', ['title', 'summary']],
  ['agents', 'slug,name,status', ['name', 'description']],
  ['mcp_servers', 'slug,name', ['name', 'description']],
  ['skills', 'slug,name,status', ['name', 'description']],
  ['skill_tools', 'slug,name', ['name', 'description']]
];

for (const [label, term, desc] of PROBES) {
  const hits = new Set();
  for (const [table, cols, searchCols] of TABLES) {
    for (const col of searchCols) {
      const url = `${base}/rest/v1/${table}?select=${cols}&${col}=ilike.${encodeURIComponent(`*${term}*`)}&limit=5`;
      const r = await fetch(url, { headers });
      const rows = await r.json();
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        hits.add(
          `${table}: slug=${row.slug ?? '-'} | ${row.title ?? row.name} | pub=${row.published_at ?? '-'} en=${row.en_status ?? '-'}`
        );
      }
    }
  }
  console.log(`\n### ${label} — ${desc}`);
  if (hits.size === 0) console.log('  (无匹配)');
  else [...hits].slice(0, 8).forEach((h) => console.log('  ' + h));
}
