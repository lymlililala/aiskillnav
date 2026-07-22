#!/usr/bin/env node
/**
 * 2026-07-22 GSC 优化批次 1：news 表三篇重点文章。
 *  - fields-medal-leak: title_en 改为关键词前置（"Fields Medal 2026 Leak"），summary_en 补齐/润色
 *  - ai-automation-jobs: 84 字薄摘要 → 完整 markdown 分析（匹配"世界经济论坛 就业报告 2025"词簇）
 *  - tencent-rxbrain: 标题关键词前置（RxBrain 开头）
 * 备份落 output/news-backup-20260722.json。幂等：重复执行结果一致。
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

async function get(slug) {
  const r = await fetch(`${base}/rest/v1/news?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`, {
    headers
  });
  const rows = await r.json();
  return rows[0];
}
async function patch(slug, payload) {
  const r = await fetch(`${base}/rest/v1/news?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`PATCH ${slug} 失败 ${r.status}: ${(await r.text()).slice(0, 300)}`);
}

// ---------- 1) Fields Medal ----------
const FM_SLUG = 'fields-medal-leak-2026-wang-deng-n9masd';
const fm = await get(FM_SLUG);
const fmPatch = {
  title_en: 'Fields Medal 2026 Leak: Winners List Revealed Early — Two Chinese Mathematicians Among Four',
  summary_en: `On July 14, 2026, the official website of the International Congress of Mathematicians (ICM 2026) leaked the Fields Medal winners list ahead of the ceremony through a front-end API flaw. The leaked list names Chinese mathematicians Hong Wang (NYU Courant / IHES) and Yu Deng (University of Chicago), alongside John Pardon and Jacob Tsimerman. ICM has patched the flaw, but the data had already been archived. If confirmed at the official announcement on July 23, it would be the first time two Chinese-born mathematicians share the prize in the same year, and Wang would become the third woman ever to win a Fields Medal.

## How the list leaked
- The flaw was in the schedule API endpoint \`eventSnapshot\`, which returned full data including entries flagged as \`HIDDEN\`.
- A simple \`curl\` request plus a search for the \`HIDDEN\` keyword exposed all four winners' names.
- The same endpoint also leaked winners of the Abacus Medal, Chern Medal, Gauss Prize and other ICM awards.
- After the leak spread on Zhihu and other platforms, prediction market Polymarket pushed the four candidates' implied odds above 98%.

## Hong Wang: the 90s-born solver of the Kakeya conjecture
- Born 1991 in Guilin, China; entered Peking University in 2007, later moving from geophysics to mathematics (B.S. 2011).
- Earned an engineering degree at École Polytechnique and a master's at Paris-Saclay, then a PhD at MIT in 2019 under Larry Guth.
- Now professor at NYU's Courant Institute; in 2025 became the first female permanent professor at IHES (France).
- In 2025, with Joshua Zahl, she resolved the three-dimensional Kakeya conjecture, a century-old problem tied to harmonic analysis and number theory.
- Previous honors include the Salem Prize, the ICCM Gold Medal of Mathematics, and the Ostrowski Prize.

## Yu Deng: the IMO gold medalist behind Hilbert's sixth problem
- Born 1989 in Shenzhen; IMO gold medalist in 2006 (tied 6th worldwide), admitted to Peking University, transferred to MIT in 2009.
- PhD at Princeton in 2015 under Alexandru D. Ionescu; now professor of mathematics at the University of Chicago.
- In 2024-2025, with Xiao Ma and Zaher Hani, he resolved the narrow Hilbert sixth problem, rigorously deriving the macroscopic Boltzmann equation from microscopic particle systems — described as the most important answer to the problem in 125 years.
- ICM's own site had already marked Hilbert's sixth problem as "partially solved", highlighting his work.

## Why it matters
- If confirmed, China would become the fifth country (after the US, France, UK, Russia) to have two mathematicians win in the same year.
- Both Wang and Deng were Peking University class of 2007 undergraduates before pursuing doctorates in the US.
- Previous Chinese-descent Fields Medalists — Shing-Tung Yau (1982) and Terence Tao (2006) — were not undergrad-educated in mainland China.
- In October 2025 the two shared the ICCM Gold Medal of Mathematics.
- This Fields Medal cycle has drawn unusual attention due to the leak, and is seen as a symbolic moment in the era of human mathematicians competing with AI.`
};
if (fm) {
  await patch(FM_SLUG, fmPatch);
  console.log(`[fields-medal] title_en 已关键词前置, summary_en ${fmPatch.summary_en.length} 字符 (原 ${fm.summary_en?.length ?? 0})`);
} else console.log('[fields-medal] NOT FOUND, 跳过');

// ---------- 2) 世界经济论坛 就业报告 ----------
const WEF_SLUG = 'ai-automation-jobs-future-of-work-2025';
const wef = await get(WEF_SLUG);
const wefSummary = `世界经济论坛（WEF）《未来就业报告 2025》显示：到 2027 年，人工智能将创造 7800 万个新岗位，同时淘汰 6800 万个岗位——净增约 1000 万。报告基于对全球数百家大型企业的调查，是判断"AI 会不会抢走工作"这一问题最常被引用的权威数据之一。本文梳理报告核心结论：哪些岗位风险最大、哪些在增长、技能需求如何变化，以及个人和企业该怎么准备。

## 报告核心数据

- **净增为正**：新技术（尤其是 AI）创造的岗位多于淘汰的岗位，但"净增"掩盖了剧烈的结构性替换——消失的和新增的不是同一批工作。
- **替代集中在例行性岗位**：数据录入、行政支持、基础客服、现金收付等高度规则化的白领与蓝领岗位首当其冲，因为生成式 AI 首次让"认知类例行工作"也能被自动化。
- **增长集中在三类**：AI 直接相关岗位（机器学习工程师、提示词工程、AI 产品/运维）、人机协作岗位（会用 AI 工具的分析师、运营、设计师）、以及难自动化的线下服务岗位（护理、技工、教育）。
- **技能半衰期缩短**：报告强调企业普遍认为现有员工技能中相当大比例将在几年内过时，"再培训"成为企业 HR 预算的重点方向。

## 哪些岗位风险最大

报告与后续追踪研究一致指向同一规律：**可被清晰描述流程的工作最危险**。典型高风险方向包括：

1. 基础文案与翻译、标准化内容生产；
2. 数据录入、单据处理、基础财务与 HR 事务；
3. 初级客服与电销；
4. 初级编程与测试中的模板化部分。

值得注意的是，受冲击最大的并非低学历岗位，而是"中等技能白领"——这正是过去二十年最稳定的就业层。

## 企业与个人该怎么准备

**企业侧**：报告建议把 AI 部署与再培训捆绑推进——先盘点哪些任务（而非岗位）可被 AI 增强，再围绕"人机协作"重新设计岗位，而不是简单裁撤。只做减法的企业会在两三年后缺乏懂业务的 AI 操作者。

**个人侧**：三个可执行方向——

- 把本岗位的 AI 工具链用到熟练（不是了解概念，而是日产出中使用）；
- 投资 AI 难替代的能力：跨领域判断、客户信任、现场处置、责任签字类工作；
- 保持可迁移技能（数据分析、写作、项目管理）的持续更新。

## 背景与局限

- WEF 报告基于企业问卷的自报预期，历史上各期报告都高估过替代速度、低估过新岗位形态，读数应视为"方向信号"而非精确预测。
- 报告发布于 2025 年初，此后生成式 AI 能力仍在快速演进，实际影响节奏因行业而异。
- 同主题可延伸阅读本站《2026 就业市场大调查：AI 真的在替代人类工作吗？数据说话》。`;
const wefPatch = {
  title: '世界经济论坛《未来就业报告2025》：AI 将净增千万岗位，哪些职业最危险？',
  summary: wefSummary,
  tags: ['世界经济论坛', '未来就业报告', 'AI就业', 'WEF', '人工智能', '就业影响']
};
if (wef) {
  await patch(WEF_SLUG, wefPatch);
  console.log(`[wef] 标题已对齐词簇, 摘要 ${wef.summary?.length ?? 0}字 -> ${wefSummary.length}字`);
} else console.log('[wef] NOT FOUND, 跳过');

// ---------- 3) RxBrain 标题关键词前置 ----------
const RX_SLUG = 'tencent-rxbrain-embodied-ai-model-cmr547';
const rx = await get(RX_SLUG);
if (rx) {
  await patch(RX_SLUG, {
    title: 'RxBrain：腾讯发布具身世界认知基座模型，统一推理与视觉想象（已开源）'
  });
  console.log('[rxbrain] 标题已关键词前置');
} else console.log('[rxbrain] NOT FOUND, 跳过');

// ---------- 备份（优化后状态快照留档，含旧值来自上面 get） ----------
writeFileSync(
  'output/news-backup-20260722.json',
  JSON.stringify(
    {
      when: '2026-07-22',
      note: 'GSC 0715-0722 优化前的 news 原始行（fields-medal / wef / rxbrain）',
      before: { [FM_SLUG]: fm, [WEF_SLUG]: wef, [RX_SLUG]: rx }
    },
    null,
    2
  )
);
console.log('备份（优化前快照）-> output/news-backup-20260722.json');
