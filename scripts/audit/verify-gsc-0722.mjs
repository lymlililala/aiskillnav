#!/usr/bin/env node
/**
 * 2026-07-22 GSC 优化最终验证：10 篇教程 + 6 个 MCP + 3 条 news 的上线资格核对。
 * 核对项 = 各页面类型索引/sitemap 的真实判定条件（见 src/features/seo/sitemap-data.ts、
 * src/app/(main)/tutorials/[slug]/page.tsx、index-allowlist.ts、noindex-slugs.ts）。
 */
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}` };
const q = async (p) => (await (await fetch(`${base}/rest/v1/${p}`, { headers })).json()) ?? [];

const noindexSrc = readFileSync('src/features/tutorials/noindex-slugs.ts', 'utf8');
const allowSrc = readFileSync('src/features/mcp/index-allowlist.ts', 'utf8');
const boostSrc = readFileSync('src/lib/index-boost.ts', 'utf8');

const TUTORIALS = [
  'groq-api-developer-guide-and-quick-start-2026-pv6asd',
  'mistral-large-3-api-complete-guide-2026-setup-features-best-practices-k89ew',
  'llm-api-cost-optimization-guide-2026',
  'voice-activity-detection-python-guide-2026',
  'llm-fallback-strategy-production-2026',
  'notion-ai-knowledge-management-team-workflow',
  'ai-cloud-cost-optimization-strategies',
  'ai-clinical-documentation-ambient-scribes-2026',
  'enterprise-generative-ai-adoption-playbook-2026',
  'ai-credit-risk-management-guide-2026',
  'ai-data-loss-prevention-dlp-guide-2026'
];
const MCPS = [
  'rchanllc-joltsms-mcp-server',
  'areweai-tsgram-mcp',
  'whenlabs-org-when',
  'wopee-io-wopee-mcp',
  'mobile-next-mobile-mcp',
  'firecrawl-mcp'
];
const NEWS = [
  'fields-medal-leak-2026-wang-deng-n9masd',
  'ai-automation-jobs-future-of-work-2025',
  'tencent-rxbrain-embodied-ai-model-cmr547'
];

let fail = 0;
console.log('=== 教程 ===');
for (const slug of TUTORIALS) {
  const [t] = await q(
    `tutorials?select=slug,title_en,published_at,en_status,content,content_en&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  if (!t) {
    console.log(`  ✗ ${slug}: NOT FOUND`);
    fail++;
    continue;
  }
  const checks = {
    发布: !!t.published_at,
    en发布: t.en_status === 'published',
    title_en: !!t.title_en,
    FAQ: /##\s*FAQ/i.test(t.content ?? ''),
    FAQ_en: /##\s*FAQ/i.test(t.content_en ?? ''),
    撤noindex: !noindexSrc.includes(`'${slug}'`),
    首页内链: boostSrc.includes(`/tutorials/${slug}`)
  };
  const bad = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (bad.length) fail++;
  console.log(
    `  ${bad.length ? '✗' : '✓'} ${slug} | zh=${t.content?.length ?? 0}字 en=${t.content_en?.length ?? 0}字${bad.length ? ' | 缺: ' + bad.join(',') : ''}`
  );
}

console.log('=== MCP ===');
for (const slug of MCPS) {
  const [m] = await q(
    `mcp_servers?select=slug,description,description_en,en_status&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  if (!m) {
    console.log(`  ✗ ${slug}: NOT FOUND`);
    fail++;
    continue;
  }
  const checks = {
    白名单: allowSrc.includes(`'${slug}'`),
    en发布: m.en_status === 'published',
    desc充实: (m.description?.length ?? 0) >= 100,
    desc_en: (m.description_en?.length ?? 0) >= 150
  };
  const bad = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (bad.length) fail++;
  console.log(
    `  ${bad.length ? '✗' : '✓'} ${slug} | desc=${m.description?.length ?? 0}字 desc_en=${m.description_en?.length ?? 0}字符${bad.length ? ' | 缺: ' + bad.join(',') : ''}`
  );
}

console.log('=== News ===');
for (const slug of NEWS) {
  const [n] = await q(
    `news?select=slug,published_at,en_status,summary,summary_en&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  const ok = n && n.published_at && n.en_status === 'published' && (n.summary?.length ?? 0) >= 800;
  if (!ok) fail++;
  console.log(
    `  ${ok ? '✓' : '✗'} ${slug} | zh=${n?.summary?.length ?? 0}字 en=${n?.summary_en?.length ?? 0}字符 en_status=${n?.en_status}`
  );
}

console.log(fail === 0 ? '\n全部通过 ✓' : `\n${fail} 项未达标 ✗`);
process.exit(fail === 0 ? 0 : 1);
