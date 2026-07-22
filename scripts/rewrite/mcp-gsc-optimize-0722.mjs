#!/usr/bin/env node
/**
 * 2026-07-22 GSC 优化批次 2：MCP 子功能页内容充实。
 * 6 个有 GSC 曝光/点击的 MCP 详情页：扩写 zh 描述 + 补 description_en + en_status=published。
 * 备份旧值到 output/mcp-backup-20260722.json。幂等。
 */
import { readFileSync, writeFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal'
};

const ENRICH = {
  'rchanllc-joltsms-mcp-server': {
    description:
      'JoltSMS MCP Server 为 AI Agent 提供真实美国 SIM 卡手机号：自动接收入站短信、轮询消息并提取 OTP 验证码。配合 Claude、Cursor 等 MCP 客户端，Agent 可自主完成「注册账号 → 接收验证码 → 回填」的完整闭环，适合自动化测试、批量账号验证、短信通知监控等场景。',
    description_en:
      'JoltSMS MCP Server gives AI agents a dedicated US SIM phone number: receive inbound SMS, poll messages, and extract OTP codes automatically. With Claude, Cursor, or any MCP client, your agent completes the full register → receive code → fill code loop — ideal for automated testing, account verification, and SMS monitoring.'
  },
  'areweai-tsgram-mcp': {
    description:
      'TSgram MCP 把 Telegram 变成随身携带的开发入口：在手机上通过 Telegram 对话访问本地工作区的 Claude，随时随地阅读、编写和修改代码。适合通勤途中评审 diff、让长任务跑完后推送通知到手机、离开电脑也能继续推进开发。',
    description_en:
      'TSgram MCP turns Telegram into a mobile dev console: chat from your phone with Claude running in your local workspace — read, write, and edit code anywhere. Review diffs on the go, get notified when long-running tasks finish, and keep work moving away from your desk.'
  },
  'whenlabs-org-when': {
    description:
      'When MCP 是面向 AI 编码助手的开发者工具包：自动检测 AI 上下文文件中的技术栈、捕获端口冲突、校验 .env 配置模式、发现文档与代码的漂移。让 AI 助手动手修改前先「看清」项目真实现状，显著减少环境类返工与配置错误。',
    description_en:
      'When MCP is a toolkit for AI coding assistants: auto-detects the stack from AI context files, catches port conflicts, validates .env schemas, and spots documentation drift — so your AI assistant sees the project as it actually is before changing code, cutting environment rework and config errors.'
  },
  'wopee-io-wopee-mcp': {
    description:
      'Wopee MCP 调度自主 Web 测试 AI Agent：打开真实浏览器执行测试用例，自动断言并报告通过/失败结果。把自然语言描述的测试步骤变成可运行的端到端检查，适合回归测试、冒烟测试与跨浏览器验证的自动化。',
    description_en:
      'Wopee MCP orchestrates autonomous web-testing agents: they drive real browsers, execute test cases, and report pass/fail automatically. Turn plain-language test steps into runnable end-to-end checks — built for regression suites, smoke tests, and cross-browser verification.'
  },
  'mobile-next-mobile-mcp': {
    description:
      'Mobile MCP（mobile-next）让 AI Agent 直接操控 iOS / Android 模拟器与真机：点击、滑动、输入、截图、断言界面元素，用自然语言驱动移动端 UI 自动化。覆盖 App 功能测试、操作录屏回放、跨设备兼容性检查，是移动 QA 场景最活跃的 MCP 实现之一。',
    description_en:
      'Mobile MCP (mobile-next) lets AI agents drive iOS and Android simulators and real devices — tap, swipe, type, screenshot, and assert UI elements using natural language. Covers functional app testing, session replay, and cross-device checks; one of the most active MCP servers for mobile QA.'
  },
  'firecrawl-mcp': {
    description:
      'Firecrawl MCP Server 是官方托管的网页抓取 MCP：把任意 URL 转成干净的 Markdown 或结构化数据，支持整站爬取、站内搜索与深度抽取，让 Claude、Cursor 等 MCP 客户端实时获取网页上下文。适合 RAG 数据采集、竞品监控、研究型 Agent 的联网能力扩展。',
    description_en:
      'The official Firecrawl MCP server converts any URL into clean Markdown or structured data — with site-wide crawling, search, and deep extraction — giving Claude, Cursor, and other MCP clients live web context. Built for RAG data pipelines, competitor monitoring, and research agents that need the open web.'
  }
};

const before = {};
for (const slug of Object.keys(ENRICH)) {
  const r = await fetch(
    `${base}/rest/v1/mcp_servers?select=slug,name,description,description_en,en_status,install_cmd,stars&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    { headers }
  );
  const rows = await r.json();
  if (!rows[0]) {
    console.log(`  ${slug}: NOT FOUND, 跳过`);
    continue;
  }
  before[slug] = rows[0];
  const p = await fetch(`${base}/rest/v1/mcp_servers?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ ...ENRICH[slug], en_status: 'published' })
  });
  if (!p.ok) throw new Error(`PATCH ${slug} 失败 ${p.status}: ${(await p.text()).slice(0, 200)}`);
  console.log(
    `  ${slug}: desc ${before[slug].description?.length ?? 0}→${ENRICH[slug].description.length}字, desc_en=${ENRICH[slug].description_en.length}字符, en_status=published (stars=${before[slug].stars})`
  );
}
writeFileSync(
  'output/mcp-backup-20260722.json',
  JSON.stringify({ when: '2026-07-22', note: 'MCP 充实前原始行', before }, null, 2)
);
console.log('备份 -> output/mcp-backup-20260722.json');
