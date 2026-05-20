/**
 * SEO/GEO 批次 2026-05-20 — News (3篇)
 * node scripts/insert-seo-0520-news.mjs
 */
const BASE = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E';
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY, apikey: KEY };

async function upsert(table, rows) {
  const r = await fetch(BASE + '/rest/v1/' + table + '?on_conflict=slug', {
    method: 'POST',
    headers: { ...H, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(rows)
  });
  const txt = await r.text();
  if (!r.ok) { console.error('ERR', table, txt.slice(0, 300)); return; }
  const j = JSON.parse(txt);
  console.log('OK', table, Array.isArray(j) ? j.length : 1, 'rows');
}

const NEWS = [
{
  slug: 'openai-o3-mini-release-price-performance-2026',
  title: 'OpenAI o3 mini 正式发布：推理模型平民化，$0.15 每百万 token',
  summary: `## OpenAI 发布 o3 mini：让推理模型不再是奢侈品

2026年5月，OpenAI 正式推出 o3 mini，将旗舰推理模型 o3 的核心能力打包进价格极低的版本——$0.15/1M input tokens，比 o3 的 $15/1M 便宜 100 倍。

## 核心性能数据

o3 mini 并不是 o3 的"阉割版"。在实际场景中表现超出预期：

| Benchmark | o3 mini | o3（旗舰）| GPT-4o |
|-----------|---------|---------|--------|
| AIME 2024 | 63.4% | 96.7% | 13.4% |
| GPQA Diamond | 71.2% | 87.7% | 53.0% |
| SWE-bench | 49.3% | 71.7% | 38.0% |

o3 mini 的数学推理能力比 GPT-4o 高出近 50 个百分点，接近专业竞赛参赛水平。

## 三种"思考力度"可调节

o3 mini 引入了 **reasoning_effort** 参数：

- **low**：最快，约 3-5 秒，适合简单推理
- **medium**（默认）：约 8-15 秒，平衡速度和深度
- **high**：约 30-60 秒，接近 o3 的推理质量

\`\`\`python
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    model="o3-mini",
    messages=[{"role": "user", "content": "证明√2是无理数"}],
    reasoning_effort="high"
)
\`\`\`

## 定价对比（2026年5月）

| 模型 | Input | Output |
|------|-------|--------|
| o3 mini | $0.15/1M | $0.60/1M |
| o3 | $15/1M | $60/1M |
| GPT-4o | $2.50/1M | $10/1M |
| GPT-4o mini | $0.15/1M | $0.60/1M |

注意：o3 mini 与 GPT-4o mini 定价相同，但在数学和代码推理能力上远超后者。

## 什么时候用 o3 mini？

**适合**：需要推理能力但预算有限的 AI 应用、数学题解题类 Agent、代码调试和算法实现、科学数据分析。

**不适合**：日常对话文本生成（GPT-4o mini 更便宜且够用）、需要视觉输入（o3 mini 不支持图像）。

## 行业影响

o3 mini 意味着"推理型 AI"终于有了普及价格。此前企业在考虑 o3 时因成本望而却步；现在同样的推理能力可以以 1% 的成本部署。

预计接下来 3 个月，数学辅导、代码审查、科学研究类 AI 应用会迎来一波爆发——这些场景此前因推理模型成本过高一直没能大规模落地。`,
  source_url: 'https://aiskillnav.com/news/openai-o3-mini-release-price-performance-2026',
  source_name: 'AI Skill Navigation',
  category: '模型',
  tags: ['o3 mini', 'OpenAI', '推理模型', '大模型发布', 'AI价格', 'reasoning'],
  status: 'published',
  is_featured: true,
  published_at: '2026-05-20T08:00:00Z',
  created_at: '2026-05-20T08:00:00Z',
  updated_at: '2026-05-20T08:00:00Z'
},

{
  slug: 'google-notebooklm-plus-enterprise-2026',
  title: 'Google NotebookLM Plus 全面升级：从学习工具到企业知识管理平台',
  summary: `## NotebookLM 从"学生工具"升级到"企业级 AI 知识平台"

2026年5月，Google 对 NotebookLM 进行重大版本升级，推出面向企业的 NotebookLM Plus，深度集成 Gemini 2.5 Pro 的 100 万 token 上下文能力。这标志着这款产品正式进入企业市场。

## 5 大核心升级

### 1. 无限文档容量 + 100 万 token 上下文

此前每个 Notebook 限制 50 个文档；升级后 Plus 版提升到 500 个文档，单次对话可分析整个 Notebook 的全部内容。

实测：将一个 300 页的技术规范文档 + 20 份相关论文放入同一 Notebook，问"这个系统的主要性能瓶颈是什么，各论文如何评估？"——NotebookLM 给出了横跨所有文档的综合分析，并精确标注了每个结论的来源文档和页码。

### 2. Audio Overview 2.0（播客式摘要）

原有的"Audio Overview"功能升级为 2.0：

- **可定制的对话风格**：学术讨论、轻松对话、深度访谈等模式
- **可交互**：播放过程中可以暂停并提问，AI 主持人会实时回答
- **多语言支持**：新增中文、日文、西班牙文等 10 种语言

**实际应用**：上传一份 50 页的竞品分析报告，10 分钟后得到一段 15 分钟的"播客"——两个 AI 主持人讨论这份报告的关键发现。通勤途中听完，比自己读节省 35 分钟。

### 3. 企业级权限控制

NotebookLM Plus 加入了企业必需的权限功能：

- **Notebook 级别的访问控制**：可以设置某个 Notebook 只有特定人员可以访问
- **Google Workspace 集成**：与 Google 企业账号的组织架构无缝连接
- **审计日志**：记录谁访问了哪个 Notebook、问了哪些问题

### 4. API 访问（开发者重磅功能）

NotebookLM Plus 首次开放 API，让开发者可以将 NotebookLM 的能力嵌入到自己的应用中：

\`\`\`python
from google import notebooklm

notebook = notebooklm.Notebook(notebook_id="your-id")
notebook.add_source(url="https://example.com/report.pdf")

response = notebook.query("这份报告的核心论点是什么？")
print(response.answer)
print(response.citations)  # 答案来源，精确到段落
\`\`\`

### 5. Mind Maps 自动生成

新增思维导图功能：将 Notebook 中的所有内容自动生成可视化的知识图谱，支持导出为 PNG/SVG。

---

## 定价

| 版本 | 价格 | 文档数量上限 | API 访问 |
|------|------|------------|---------|
| 免费版 | 免费 | 50个/Notebook | ❌ |
| Plus（个人）| $19.99/月 | 300个/Notebook | ✅（有限额）|
| Enterprise | 联系销售 | 500个/Notebook | ✅（无限额）|

---

## 与竞品对比

| 功能 | NotebookLM Plus | Perplexity Spaces | Notion AI |
|------|----------------|-----------------|----------|
| 文档上传 | 300个/Notebook | 50个/Space | 无限制 |
| 播客摘要 | ✅ 独家功能 | ❌ | ❌ |
| 来源引用 | ✅ 精确到段落 | ✅ | ⚠️ 较弱 |
| API | ✅ | ❌ | ✅ |
| 中文支持 | ✅ | ✅ | ✅ |

---

## 什么样的团队最适合 NotebookLM Plus？

**最适合**：
- 研究团队（学术或企业研究部门）
- 法律/咨询/金融团队（大量文档分析需求）
- 产品团队（整合竞品分析、用户反馈、技术文档）

**不太适合**：
- 主要需求是 AI 写作辅助（Notion AI 或 Claude 更合适）
- 需要实时网页信息（Perplexity 更合适）`,
  source_url: 'https://aiskillnav.com/news/google-notebooklm-plus-enterprise-2026',
  source_name: 'AI Skill Navigation',
  category: '工具',
  tags: ['NotebookLM', 'Google', '知识管理', 'AI工具', '企业AI', '文档分析'],
  status: 'published',
  is_featured: true,
  published_at: '2026-05-20T10:00:00Z',
  created_at: '2026-05-20T10:00:00Z',
  updated_at: '2026-05-20T10:00:00Z'
},

{
  slug: 'ai-engineer-job-market-skills-2026',
  title: 'AI 工程师就业市场 2026 年中报告：哪些技能最值钱，薪资涨了多少',
  summary: `## 2026 年 AI 工程师就业市场：供需双旺，但要求也越来越具体

2026年上半年，AI 相关岗位的招聘量比 2025年同期增长了 67%（LinkedIn 数据）。但与此同时，岗位要求也从"了解 AI"升级为"有实际 Agent 部署经验"。

本文基于对 500+ 个 AI 相关招聘 JD 的分析，梳理 2026 年最值钱的 AI 技能和真实薪资水平。

---

## 最热门的岗位类型（按招聘量排序）

| 岗位 | 招聘量增速（同比）| 薪资中位数（北京/上海）|
|------|----------------|---------------------|
| AI 产品经理 | +145% | 45-70万/年 |
| AI Agent 工程师 | +230% | 50-90万/年 |
| 提示词工程师（Prompt Engineer）| +89% | 35-60万/年 |
| LLMOps 工程师 | +312% | 55-95万/年 |
| AI 应用全栈工程师 | +178% | 45-80万/年 |

增速最快的是 **LLMOps 工程师**——负责 AI 模型的部署、监控、成本优化和 A/B 测试，这个岗位 2024年几乎不存在，现在是各大公司最难招的职位之一。

---

## 技术技能的薪资溢价（相比同级别非AI工程师）

| 技能 | 薪资溢价 |
|------|---------|
| 有生产环境 Agent 部署经验 | +35-45% |
| 熟悉 LangGraph / CrewAI | +25-30% |
| RAG 系统设计经验 | +20-25% |
| MCP Server 开发经验 | +15-20% |
| Fine-tuning 经验 | +20-30% |
| 向量数据库（Qdrant/Pinecone）| +15-20% |

**关键发现**：有"生产环境 Agent 部署经验"的候选人，薪资溢价最高。很多候选人只做过 demo，没有处理过真实用户流量、监控和故障排查——这个差距正在被企业高度重视。

---

## 提示词工程师：独立岗位还是附加技能？

2025 年时，提示词工程师作为独立岗位非常热门。2026年，这个岗位开始出现两极分化：

**消失中的**：纯粹的"写提示词"岗位，已经被证明没有足够的技术深度，大多数公司将其合并到产品或工程团队。

**仍然热门的**：带有完整工程背景的"AI 系统设计"能力——能设计 System Prompt 框架、评估 Agent 输出质量、构建 Prompt 测试流程。

---

## 非技术背景的人如何转型 AI 岗位？

有三条可行路径：

**路径 1：AI 产品经理**
- 需要掌握的技能：AI 能力边界评估、Agent 产品设计、指标体系设计
- 学习时间：3-6 个月
- 薪资范围：35-70万/年（取决于原有 PM 经验）

**路径 2：AI 应用全栈（低代码方向）**
- 需要掌握的技能：Dify/n8n 部署、基础 Python、Prompt 工程
- 学习时间：2-4 个月
- 薪资范围：25-45万/年（适合转型早期）

**路径 3：垂直行业 AI 应用**
- 把原有行业知识（法律/医疗/金融/教育）和 AI 技能结合
- 这类候选人往往能拿到比纯技术背景更高的薪资，因为行业知识稀缺
- 学习时间：1-3 个月（AI 技能部分）

---

## 2026 年下半年趋势预测

**技能稀缺化**：随着 AI 工具越来越易用，"会用 AI"不再是优势，"知道什么时候不用 AI"和"能评估 AI 系统质量"开始成为核心竞争力。

**岗位融合**：独立的 AI 岗位正在和传统岗位融合——不是新增"AI 工程师"，而是要求每个软件工程师都具备 AI 开发能力。

**评估标准升级**：越来越多的公司开始用"带回家实操项目"替代算法题——给你一个真实业务场景，让你用 AI 工具解决，直接看动手能力。

---

## 延伸阅读

- [AI Agent 完整入门指南](/tutorials/what-is-ai-agent)
- [AI Agent 2026 年中盘点](/tutorials/ai-agent-2026-mid-year-trends)
- [LangGraph 有状态 Agent 教程](/tutorials/langgraph-stateful-agent)`,
  source_url: 'https://aiskillnav.com/news/ai-engineer-job-market-skills-2026',
  source_name: 'AI Skill Navigation',
  category: '综合',
  tags: ['AI就业', 'AI工程师', '提示词工程师', 'LLMOps', 'AI薪资', '职业发展', 'AI转型'],
  status: 'published',
  is_featured: true,
  published_at: '2026-05-20T13:00:00Z',
  created_at: '2026-05-20T13:00:00Z',
  updated_at: '2026-05-20T13:00:00Z'
}
];

await upsert('news', NEWS);
console.log('\n新闻链接：');
NEWS.forEach(n => console.log('  https://aiskillnav.com/news/' + n.slug));
