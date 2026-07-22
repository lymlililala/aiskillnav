#!/usr/bin/env node
/**
 * 只读第二轮：content 全文检索 + 关键行完整信息 + MCP 白名单核对。
 * 用法：node scripts/audit/map-gsc-queries-0722-pass2.mjs
 */
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
  return Array.isArray(rows) ? rows : [];
}

// 1) content 全文检索：fields medal / mckinsey / 菲尔兹
console.log('=== content 检索: fields medal / 菲尔兹 / mckinsey ===');
for (const term of ['fields medal', '菲尔兹', 'mckinsey', '麦肯锡']) {
  for (const table of ['tutorials', 'news']) {
    const rows = await q(
      `${table}?select=slug,title,published_at,en_status&content=ilike.${encodeURIComponent(`*${term}*`)}&limit=6`
    );
    for (const r of rows)
      console.log(`  [${term}] ${table}: ${r.slug} | ${r.title} | pub=${r.published_at ?? '-'} en=${r.en_status ?? '-'}`);
  }
}

// 2) 关键文章完整信息（title/summary 长度/content 长度/FAQ）
console.log('\n=== 关键存量文章体检 ===');
const SLUGS = [
  ['news', 'ai-automation-jobs-future-of-work-2025'],
  ['news', 'ai-replaces-jobs-real-data-2026'],
  ['news', 'tencent-rxbrain-embodied-ai-model-cmr547'],
  ['news', 'huawei-tao-scaling-v2-paper-update-ystdq2'],
  ['tutorials', 'llm-fallback-strategy-production-2026'],
  ['tutorials', 'notion-ai-knowledge-management-team-workflow'],
  ['tutorials', 'voice-activity-detection-python-guide-2026'],
  ['tutorials', 'ai-cloud-cost-optimization-strategies'],
  ['tutorials', 'ai-text-to-sql-world-cup-stats-2026-sql5m8'],
  ['tutorials', 'fastapi-vs-langserve-side-by-side-comparison-kfi6r8'],
  ['tutorials', 'llm-api-cost-optimization-guide-2026'],
  ['tutorials', 'ai-cost-optimization-inference-2025']
];
for (const [table, slug] of SLUGS) {
  const rows = await q(
    `${table}?select=slug,title,summary,tags,published_at,en_status,content,title_en,summary_en,content_en&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  const r = rows[0];
  if (!r) {
    console.log(`  ${table}/${slug}: NOT FOUND`);
    continue;
  }
  const faq = (r.content?.match(/^##\s*FAQ/gim) || []).length > 0 ? '有FAQ' : '无FAQ';
  console.log(`  ${table}/${r.slug}`);
  console.log(`    title=${r.title}`);
  console.log(`    pub=${r.published_at ?? 'NULL'} en=${r.en_status ?? '-'} | 中文字数=${r.content?.length ?? 0} | 英文content=${r.content_en ? r.content_en.length : 'NULL'} | ${faq}`);
  console.log(`    summary=${(r.summary ?? '').slice(0, 120)}`);
  console.log(`    tags=${JSON.stringify(r.tags)}`);
}

// 3) MCP 详情页白名单核对（读 src/features/mcp/index-allowlist.ts）
console.log('\n=== MCP 白名单核对 ===');
const allow = readFileSync('src/features/mcp/index-allowlist.ts', 'utf8');
for (const slug of [
  'rchanllc-joltsms-mcp-server',
  'areweai-tsgram-mcp',
  'whenlabs-org-when',
  'wopee-io-wopee-mcp',
  'firecrawl-mcp',
  'mobile-next-mobile-mcp'
]) {
  console.log(`  ${slug}: ${allow.includes(`'${slug}'`) || allow.includes(`"${slug}"`) ? '在白名单(可索引)' : '不在白名单(noindex)'}`);
}

// 4) 这些 MCP 行的描述字段
console.log('\n=== MCP 行描述 ===');
for (const slug of ['rchanllc-joltsms-mcp-server', 'areweai-tsgram-mcp', 'whenlabs-org-when', 'wopee-io-wopee-mcp']) {
  const rows = await q(
    `mcp_servers?select=slug,name,description,description_en,tags,stars,is_official&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  const r = rows[0];
  if (r) {
    console.log(`  ${r.slug} | stars=${r.stars} official=${r.is_official}`);
    console.log(`    desc=${(r.description ?? '').slice(0, 150)}`);
  }
}
