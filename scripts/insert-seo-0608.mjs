/**
 * SEO/GEO 批次 2026-06-08 — Tutorials（基于 GSC 热门曝光 query，本站此前无对应文章）
 * node scripts/insert-seo-0608.mjs
 */
const URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E';
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY, apikey: KEY };

async function upsert(table, rows) {
  const r = await fetch(URL + '/rest/v1/' + table + '?on_conflict=slug', {
    method: 'POST',
    headers: { ...H, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(rows)
  });
  const txt = await r.text();
  if (!r.ok) { console.error('ERR', table, txt.slice(0, 300)); return; }
  const j = JSON.parse(txt);
  console.log('OK', table, Array.isArray(j) ? j.length : 1, 'rows');
}

const TUTORIALS = [
{
  slug: 'llamaindex-vs-langchain-which-rag-framework-2026',
  title: 'LlamaIndex vs LangChain：到底该用哪个搭 RAG（2026 实战对比）',
  subtitle: '两个都用过半年后，我把选型逻辑讲清楚：什么项目用 LlamaIndex，什么项目用 LangChain',
  summary: '都说 LlamaIndex 专注检索、LangChain 偏向编排，但落到具体项目还是会纠结。这篇按"你要做什么"来分，配真实代码和踩过的坑，帮你 10 分钟内做出选型决定。',
  content: `# LlamaIndex vs LangChain：搭 RAG 到底选哪个

先给结论，省得你往下翻：**纯做检索问答、数据接入复杂，选 LlamaIndex；要串多步骤、多工具、Agent 流程，选 LangChain。** 两个能混用，而且实战里经常混用。

下面说为什么。

## 一句话定位

- **LlamaIndex**：从一开始就是冲着「把你的数据喂给 LLM」去的。索引、分块、检索这套，它做得最顺手。
- **LangChain**：更像一个「胶水层」，把模型、工具、记忆、Agent 全都能串起来。RAG 只是它能做的一小块。

所以问题不是「谁更强」，是「你的活儿偏哪头」。

## 直接上对比表

| 维度 | LlamaIndex | LangChain |
|------|-----------|-----------|
| 核心强项 | 数据索引与检索 | 流程编排 / Agent |
| 上手难度 | 检索场景更低 | 概念多，学习曲线陡 |
| 数据连接器 | 极丰富（LlamaHub 几百个） | 有，但没那么全 |
| 检索策略 | 内置多，开箱即用 | 要自己拼 |
| Agent 能力 | 有，但不是主场 | 主场，生态最大 |
| 文档质量 | 检索部分清晰 | 庞杂，版本变动快 |

## 什么时候选 LlamaIndex

如果你的需求是这种：「我有一堆 PDF / Notion / 数据库，想让用户用自然语言问，答案要准、要带出处」——闭眼选 LlamaIndex。

它的 \`VectorStoreIndex\` 几行就能跑起来：

\`\`\`python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

docs = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(docs)
qe = index.as_query_engine(similarity_top_k=5)
print(qe.query("我们的退款政策是怎么规定的？"))
\`\`\`

更关键的是检索策略。像句子窗口检索、自动合并检索这些进阶玩法，LlamaIndex 是内置的，换个 retriever 类就行。同样的东西在 LangChain 里你得自己搭。如果你做的是企业知识库、客服问答这类，省下来的时间很可观。

向量库这块我一般配 pgvector 或 Qdrant，具体可以看 [pgvector 向量搜索实战](/tutorials/pgvector-vector-search-postgresql-2026)。

## 什么时候选 LangChain

只要你的流程超出「检索→回答」，开始有分支、有工具调用、有多轮决策，LangChain 的价值就出来了。

举个真实场景：一个 Agent 要先判断用户问的是「订单问题」还是「产品咨询」，订单问题去查数据库，产品咨询走 RAG，查不到再转人工。这种带状态、带分支的流程，用 LangChain（更准确说是 LangGraph）画状态图，比硬写 if-else 清爽太多。这部分可以参考 [LangGraph 有状态 Agent 指南](/tutorials/langgraph-stateful-ai-agents-guide-2026)。

\`\`\`python
from langchain.agents import create_react_agent, AgentExecutor
# 把检索、查库、转人工都包成 tool，交给 Agent 自己决定调哪个
agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)
\`\`\`

## 别忽略的坑

**LangChain 的版本问题**：它迭代太快，去年的教程今年可能 import 路径就变了。生产项目一定要锁版本，别用 \`latest\`。这是我们踩过最疼的坑——一次小版本升级，链路直接断。

**LlamaIndex 的 Agent 不要硬上**：它也有 Agent 模块，但生态和稳定性跟 LangChain 没法比。需要复杂 Agent 别勉强用 LlamaIndex 凑。

**性能上两者差距不大**：真正的瓶颈在向量检索和 LLM 调用，框架本身的开销可以忽略。别在这上面纠结。

## 那能不能一起用？

能，而且推荐。常见组合是：**LlamaIndex 负责数据索引和检索，把它包成一个 LangChain 的 tool，再交给 LangChain 的 Agent 编排。** 各用各的长处，这是目前比较成熟的生产架构。

## 选型速查

- 只做文档问答、知识库 → LlamaIndex
- 要 Agent、多工具、复杂流程 → LangChain
- 既要好检索又要复杂编排 → 两个一起用，LlamaIndex 做检索层
- 团队是新手、想快出 demo → 看哪个场景更贴，别两个都学

选框架这事，别被「哪个更火」带跑。先看你这个项目三个月后会长成什么样，再决定。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['LlamaIndex', 'LangChain', 'RAG', '框架对比', '检索增强'],
  related_tools: ['LlamaIndex', 'LangChain', 'pgvector', 'Qdrant'],
  estimated_minutes: 12,
  published_at: '2026-06-06T09:00:00Z'
},
{
  slug: 'langsmith-vs-langfuse-llm-observability-2026',
  title: 'LangSmith vs Langfuse：LLM 可观测性工具怎么选（2026）',
  subtitle: '一个闭源好用、一个开源能自托管，关键看你在不在乎数据出境和成本',
  summary: 'LangSmith 和 Langfuse 都是给 LLM 应用做 tracing、评估、监控的。这篇讲清两者最实际的区别：开源 vs 闭源、能否自托管、定价、和框架的绑定程度，帮你按团队情况选。',
  content: `# LangSmith vs Langfuse：LLM 可观测性怎么选

做 LLM 应用做到一定规模，你一定会想要这三样东西：**看每次调用的完整链路（trace）、跑评估（eval）、监控线上质量。** LangSmith 和 Langfuse 就是干这个的。

它们功能高度重叠，选型其实是几个非技术因素在决定。

## 最核心的一个区别：开源与自托管

这是分水岭，先想清楚这条：

- **Langfuse 开源**，可以自己部署在公司服务器上，数据不出境、不进第三方。
- **LangSmith 闭源**，是 LangChain 官方的托管服务，数据走他们的云（有企业版自托管，但要谈商务）。

如果你的数据合规要求严（金融、医疗、政企），或者就是不想把 prompt 和用户数据发给外部，**Langfuse 几乎是唯一选择**。

## 功能对比

| 维度 | LangSmith | Langfuse |
|------|-----------|----------|
| 开源 | 否 | 是（MIT） |
| 自托管 | 企业版才行 | 免费自托管 |
| Tracing | 强，和 LangChain 无缝 | 强，框架无关 |
| 评估 / Eval | 成熟 | 成熟，够用 |
| Prompt 管理 | 有 | 有 |
| 框架绑定 | 偏 LangChain 生态 | 中立，啥框架都接 |
| 定价 | 按 trace 量收费 | 云版按量；自托管免费 |

## 选 LangSmith 的情况

你本来就重度用 LangChain / LangGraph，那 LangSmith 是「亲儿子」，集成基本零成本——设个环境变量，trace 自动就上来了：

\`\`\`bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=ls_xxx
\`\`\`

不用改代码，链路、token、耗时全自动记录。如果团队不在乎数据托管在第三方，又想省事，LangSmith 体验确实更顺。

## 选 Langfuse 的情况

三种情况优先 Langfuse：

1. **数据必须自己掌控**——自托管，一行数据都不出公司。
2. **不想被 LangChain 绑定**——你用的是 LlamaIndex、Vercel AI SDK 或者干脆裸调 OpenAI，Langfuse 都能接，它是框架中立的。
3. **成本敏感**——自托管除了服务器没别的费用。trace 量大的时候，这个差距会很明显。

接入也简单，SDK 包一下就行：

\`\`\`python
from langfuse.decorators import observe

@observe()
def my_rag_pipeline(question):
    # 你的检索 + 生成逻辑，trace 自动上报
    ...
\`\`\`

## 实话实说的几个点

**别指望可观测性工具能替你做质量保证。** 它给你数据，但「答案好不好」还得你自己定义评估标准。工具是放大镜，不是医生。

**trace 量会爆。** 高流量应用每天几十万条 trace 很正常，云版按量计费的话账单会吓人。这也是很多团队最后转去自托管 Langfuse 的原因。

**两个都接也不是不行。** 有团队开发期用 LangSmith 调试，上线后用自托管 Langfuse 跑监控。不冲突。

## 一句话决策

- 重度 LangChain 用户、不在乎数据托管 → LangSmith
- 要自托管 / 数据合规 / 框架中立 / 省钱 → Langfuse
- 拿不定 → 先上 Langfuse 自托管，反正不要钱，不合适再说

可观测性这步很多团队拖到出事才补，建议尽早接——线上 LLM 出问题，没 trace 你连复现都做不到。配合 [LLM 应用监控实践](/tutorials/machine-learning-model-monitoring-dashboard-2026) 一起搭更完整。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['LangSmith', 'Langfuse', 'LLM可观测性', 'observability', 'tracing'],
  related_tools: ['LangSmith', 'Langfuse', 'LangChain'],
  estimated_minutes: 10,
  published_at: '2026-06-05T09:00:00Z'
},
{
  slug: 'qdrant-vs-chroma-vector-database-2026',
  title: 'Qdrant vs Chroma：向量数据库怎么选（2026 选型指南）',
  subtitle: 'Chroma 适合快速起步，Qdrant 扛得住生产——但分界线没那么绝对',
  summary: 'Chroma 轻量易上手、Qdrant 性能强能扛量，这是大方向。但具体到你的项目，还得看数据规模、过滤需求和部署方式。本文用真实场景把选型说清楚。',
  content: `# Qdrant vs Chroma：向量数据库选型

一句话先摆这儿：**做原型、数据几万条以内，用 Chroma 起步最快；要上生产、数据上百万、要复杂过滤，上 Qdrant。**

但这条线不是铁的，下面讲清楚什么时候该越线。

## 两者定位

- **Chroma**：主打「简单」。\`pip install\` 完，几行代码就有一个能用的向量库，连嵌入模型都帮你封好了。
- **Qdrant**：主打「生产级」。Rust 写的，性能好，过滤、分片、量化这些生产需要的东西都有。

## 对比表

| 维度 | Chroma | Qdrant |
|------|--------|--------|
| 上手速度 | 极快 | 中等 |
| 语言 / 性能 | Python，够用 | Rust，更快 |
| 数据规模 | 几万到几十万舒服 | 百万级以上稳 |
| 元数据过滤 | 基础 | 强大，支持复杂条件 |
| 部署 | 本地 / 嵌入式为主 | Docker / 集群 / 云 |
| 量化压缩 | 无 | 有，省内存 |

## Chroma 适合你，如果……

你在做 demo、做 POC，或者个人项目，数据量不大。Chroma 的卖点就是「别让向量库成为你的负担」：

\`\`\`python
import chromadb
client = chromadb.Client()
col = client.create_collection("docs")
col.add(documents=["文档内容..."], ids=["1"])
res = col.query(query_texts=["问题"], n_results=3)
\`\`\`

就这么几行，不用配服务、不用建索引参数。验证想法阶段，这种「零摩擦」很值钱。LlamaIndex、LangChain 也都默认带 Chroma 集成，搭 RAG 原型基本是开箱即用。

## Qdrant 适合你，如果……

出现下面任一信号，就该考虑 Qdrant 了：

- **数据往百万级走**——Chroma 到这个量级查询会明显变慢。
- **过滤需求复杂**——比如「只在 2026 年后、标签含 'finance'、作者是 X 的文档里检索」。Qdrant 的 payload 过滤这块做得很扎实，Chroma 就吃力。
- **要正经部署**——Qdrant 有官方 Docker、集群、云服务，运维心里有底。

\`\`\`python
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

client = QdrantClient(url="http://localhost:6333")
client.search(
    collection_name="docs",
    query_vector=vec,
    query_filter=Filter(must=[FieldCondition(key="year", match=MatchValue(value=2026))]),
    limit=5
)
\`\`\`

那个带过滤的检索，是 Qdrant 在生产里最常被用到的能力。

## 几句掏心窝的话

**别为了「以后可能要扩」一上来就用 Qdrant。** 大多数项目根本到不了 Chroma 撑不住的量级，过早上 Qdrant 是给自己加运维负担。需求长大了再迁移，向量数据本来就好导。

**如果你已经在用 Postgres**，还有第三个选项：pgvector。不用单独维护一个向量服务，数据和业务库放一起，对中小项目特别香，详见 [pgvector 向量搜索实战](/tutorials/pgvector-vector-search-postgresql-2026)。

**嵌入模型才是检索质量的大头。** 选 Chroma 还是 Qdrant 影响的是性能和运维，而「检索准不准」主要由你的 embedding 模型和分块策略决定。别把精力都花在选库上。

## 决策清单

- 原型 / 小数据 / 想快 → Chroma
- 百万级 / 复杂过滤 / 要部署 → Qdrant
- 已经在用 Postgres → 先考虑 pgvector
- 不确定 → Chroma 起步，撑不住再迁 Qdrant

选向量库这事，能往后拖就往后拖——先把检索效果调好，库的事是后面的事。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['Qdrant', 'Chroma', '向量数据库', 'vector database', 'RAG'],
  related_tools: ['Qdrant', 'Chroma', 'pgvector', 'LlamaIndex'],
  estimated_minutes: 10,
  published_at: '2026-06-04T09:00:00Z'
},
{
  slug: 'vercel-ai-sdk-vs-langchain-2026',
  title: 'Vercel AI SDK vs LangChain：前端做 AI 应用该用哪个（2026）',
  subtitle: '一个为前端流式 UI 而生，一个是全能编排框架——其实很多项目两个都要',
  summary: 'Vercel AI SDK 在 Next.js 里做流式聊天 UI 几乎无敌，LangChain 在复杂 AI 逻辑编排上更强。这篇讲清两者的真实定位和如何配合，避免你选错方向。',
  content: `# Vercel AI SDK vs LangChain：前端 AI 应用选型

这俩经常被拿来比，但其实**它们解决的不是同一层的问题**。搞清这点，选型就不纠结了。

- **Vercel AI SDK**：解决「前端怎么优雅地展示 AI 输出」——流式打字效果、状态管理、和 React 组件的绑定。
- **LangChain**：解决「AI 逻辑本身怎么编排」——检索、工具、Agent、多步推理。

所以真相是：**很多项目两个一起用**，Vercel AI SDK 管前端那层，LangChain 管后端逻辑那层。

## 一张表看清

| 维度 | Vercel AI SDK | LangChain |
|------|---------------|-----------|
| 定位 | 前端 / 全栈 AI UI | AI 逻辑编排 |
| 流式 UI | 极强，\`useChat\` 一把梭 | 不管这层 |
| RAG / Agent | 基础，要自己搭 | 强项 |
| 语言 | TypeScript 优先 | Python / JS 都强 |
| 框架贴合 | Next.js / React 无缝 | 框架无关 |
| 学习曲线 | 平缓 | 陡 |

## Vercel AI SDK 强在哪

如果你用 Next.js，要做一个聊天界面，那种「字一个一个蹦出来」的流式效果，Vercel AI SDK 让它变得离谱地简单：

\`\`\`tsx
'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleSubmit, handleInputChange } = useChat();
  return (
    <form onSubmit={handleSubmit}>
      {messages.map(m => <div key={m.id}>{m.content}</div>)}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}
\`\`\`

流式、状态、loading、错误处理，\`useChat\` 全包了。换模型也只是改后端一行——OpenAI、Anthropic、Google 都有适配。这种开发体验，纯手搓 fetch + ReadableStream 是比不了的。

## LangChain 强在哪

但 Vercel AI SDK 不碰「AI 逻辑」。一旦你的需求是「先检索知识库、再判断要不要调工具、答不上来转人工」，这套编排它不管。这时候 LangChain（或 LangGraph）才是主力，相关思路见 [LangGraph 有状态 Agent 指南](/tutorials/langgraph-stateful-ai-agents-guide-2026)。

## 最佳实践：两个一起用

成熟的 Next.js AI 应用，架构通常是这样：

\`\`\`
前端组件 (useChat)
   ↓ 调用
API Route (/api/chat)
   ↓ 里面跑
LangChain 链路（RAG / Agent / 工具）
   ↓ 流式返回
前端逐字渲染
\`\`\`

Vercel AI SDK 在 API Route 里能直接把 LangChain 的流式输出转成它的格式，对接很顺。前端体验 + 后端逻辑，各取所长。

## 几个提醒

**别用 Vercel AI SDK 硬做复杂 Agent。** 它能调工具，但多步、有状态的复杂流程不是它的设计目标，硬上会很别扭。

**也别用 LangChain 去管前端 UI。** 它没有流式 UI 那套东西，自己搭费力不讨好。

**纯 TypeScript 团队**：如果你坚决不想碰 Python，LangChain.js 也能用，但生态和文档不如 Python 版。这种情况可以多靠 Vercel AI SDK + 轻量自己写逻辑。

## 选型结论

- 只做聊天 UI、流式体验 → Vercel AI SDK 足够
- 复杂 AI 逻辑、Agent、RAG → LangChain
- Next.js 全栈 AI 应用（大多数情况） → 两个一起，分工明确
- 死磕 TypeScript → Vercel AI SDK 为主，逻辑自己写或用 LangChain.js

记住那句话：它俩不是竞品，是搭档。纠结「二选一」本身就是问错了问题。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['Vercel AI SDK', 'LangChain', 'Next.js', 'AI应用', '流式UI'],
  related_tools: ['Vercel AI SDK', 'LangChain', 'Next.js'],
  estimated_minutes: 11,
  published_at: '2026-06-03T09:00:00Z'
},
{
  slug: 'step-back-prompting-complete-guide-2026',
  title: 'Step-Back Prompting 后退提示法：让模型先抽象再回答',
  subtitle: '一个被低估的提示技巧，专治模型「钻进细节出不来」',
  summary: 'Step-Back Prompting 的思路是：回答具体问题前，先让模型退一步、提炼出背后的通用原理或概念，再用这个原理来解题。对推理题、知识题效果尤其明显，本文给方法和可直接套的模板。',
  content: `# Step-Back Prompting 后退提示法

直接问模型一个具体问题，它有时会一头扎进细节，答偏。**Step-Back（后退提示）的核心动作就一个：让它先退一步，找出问题背后的通用原理，再回来解题。**

这招是 DeepMind 提出的，对物理、化学这类知识推理题，准确率提升相当明显。

## 它在解决什么

人类专家解难题时，很少一上来就抠细节。会先想「这属于哪类问题、有什么通用规律」，再往下套。模型直接答的时候，往往跳过了这一步——Step-Back 就是把这步强行补回来。

## 两步走

**第一步，后退（抽象）**：别急着问原问题，先问背后的概念。

**第二步，回答**：拿着第一步得到的原理，再解原来的具体问题。

举个例子。原问题：

> 一个理想气体，温度变成原来的 2 倍、体积变成原来的 1/4，压强怎么变？

直接问，模型容易算错。换成 Step-Back：

> 第一步：这道题涉及哪条物理定律？它的公式是什么？
> （模型答：理想气体状态方程 PV=nRT）
> 第二步：用这条定律，温度×2、体积×1/4，压强如何变化？

有了 PV=nRT 这个「锚」，模型再算就稳多了。

## 可直接套的模板

\`\`\`
在回答下面这个问题之前，请先后退一步：
1）这个问题属于哪个领域 / 涉及什么核心概念或原理？
2）相关的通用规则、公式或方法是什么？

然后再用上面提炼的原理，回答具体问题：
{你的具体问题}
\`\`\`

## 什么场景好用

- **知识推理题**：物理、化学、数学，需要先调对公式 / 定律的。
- **复杂分析**：先定「这是什么类型的问题」，能少走弯路。
- **容易被表面细节带偏的问题**：强制抽象一层，避免见树不见林。

## 什么场景别用

**简单事实问答别用。** 问「法国首都是哪」还让它先后退一步，纯属浪费 token 和时间。Step-Back 是给「需要先定框架」的难题用的。

**它会增加成本。** 一次变两次推理，token 和延迟都上去了。对延迟敏感的线上场景要权衡。

## 和其他技巧的关系

Step-Back 经常和思维链（CoT）一起用：先 Step-Back 定原理，再用 CoT 一步步推。两者不冲突，是互补的。想系统了解推理类提示，可以看 [思维链提示完全指南](/tutorials/chain-of-thought-prompting-complete-guide-and-examples-ai4646)。

如果你还在打基础，建议先过一遍 [提示工程入门](/tutorials/prompt-engineering-101-beginners-complete-guide-mbnbq0)，再来用这些进阶技巧会更顺。

## 小结

记住一句话：**难题别让模型直接冲，先让它退一步看清楚是什么题。** Step-Back 不是万能的，但用对场景，提升很扎实。`,
  level: 'intermediate',
  category: 'concept',
  tags: ['Step-Back Prompting', '后退提示', '提示工程', 'prompt engineering', '推理'],
  related_tools: ['ChatGPT', 'Claude', 'Gemini'],
  estimated_minutes: 8,
  published_at: '2026-06-02T09:00:00Z'
},
{
  slug: 'skeleton-of-thought-prompting-guide-2026',
  title: 'Skeleton-of-Thought：先列骨架再填肉，让长回答又快又有条理',
  subtitle: '一个既能提速又能提升结构性的提示技巧，原理简单到容易被忽略',
  summary: 'Skeleton-of-Thought（骨架提示）让模型先生成回答的「提纲骨架」，再并行地把每个要点展开。结果是回答更有条理，而且因为可并行，整体还更快。本文讲原理和实操。',
  content: `# Skeleton-of-Thought：先搭骨架再填内容

让模型写长回答，常有两个毛病：要么结构松散像流水账，要么生成慢得让人等。**Skeleton-of-Thought（SoT，骨架提示）一招治两个。**

思路特别简单：**先让模型列出回答的提纲（骨架），再把每个提纲点分别展开（填肉）。**

## 为什么这样更好

**结构更清楚**：先有骨架，模型就不会写着写着跑题，每一段都对应一个明确的点。

**还更快**：这是反直觉的地方。骨架列出来后，各个点的展开是相互独立的，可以**并行**生成。原本要顺序写完的长文，拆成几段并发，总耗时能压下来。这也是 SoT 论文最初的卖点——加速。

## 两阶段

**阶段一，列骨架**：

\`\`\`
针对问题「{问题}」，先只列出回答的要点提纲，
每条一句话，不要展开，3-7 条。
\`\`\`

模型可能返回：

\`\`\`
1. 定义与背景
2. 核心优势
3. 主要局限
4. 适用场景
5. 实操建议
\`\`\`

**阶段二，逐点填充**：对每个骨架点，单独发一个请求让它展开（这些请求可以并发发出去）：

\`\`\`
就「{骨架点}」这一点，结合问题「{问题}」展开 2-3 句。
\`\`\`

最后把展开的内容按骨架顺序拼起来，就是一篇结构清晰的完整回答。

## 适合什么

- **结构化长回答**：评测、对比、方案、清单类。
- **对延迟敏感、又要长内容**：靠并行把时间压下来。
- **要求条理性的场景**：报告、文档、知识梳理。

## 不适合什么

**强逻辑链条的推理别用。** 数学证明、需要一步推一步的题，各点不独立，硬拆并行会断了逻辑。这类还是老老实实用思维链。

**短回答没必要。** 就答一两句话的，搭骨架是杀鸡用牛刀。

**并行带来工程复杂度。** 要真正享受到提速，得在代码里并发调多次 API、再按序拼接。如果你只是在对话框里手动用，那就只剩「结构更好」这一个好处，提速享受不到。

## 一个简化版

不想搞并行的话，单次 prompt 也能用 SoT 的思想：

\`\`\`
回答「{问题}」时，请：
1）先用一行列出 3-5 个要点提纲；
2）再逐条展开每个要点。
\`\`\`

虽然没有并行加速，但「先骨架后展开」这个结构约束，本身就能让回答明显更有条理。

## 和别的技巧搭配

骨架提示管「结构」，思维链管「推理」，两者解决不同问题。需要既有结构又要推理时，可以先 SoT 列框架、框架里需要推理的点再套 CoT。想打牢提示工程基础，建议先看 [提示工程入门](/tutorials/prompt-engineering-101-beginners-complete-guide-mbnbq0)。

## 小结

Skeleton-of-Thought 的价值是「结构 + 提速」两手抓。手动用，吃结构红利；工程化并行调用，才能把提速也吃到。`,
  level: 'intermediate',
  category: 'concept',
  tags: ['Skeleton-of-Thought', '骨架提示', '提示工程', 'prompt engineering', '并行生成'],
  related_tools: ['ChatGPT', 'Claude', 'OpenAI'],
  estimated_minutes: 8,
  published_at: '2026-06-01T09:00:00Z'
},
{
  slug: 'emotion-prompting-llm-guide-2026',
  title: 'Emotion Prompting 情感提示：加一句「这对我很重要」真的有用吗',
  subtitle: '一个听起来像玄学、但有论文支撑的提示技巧，以及它的真实边界',
  summary: 'Emotion Prompting 指在提示里加入情感色彩的话（如「这对我职业生涯很重要」），实验显示能小幅提升部分任务表现。本文讲清它为什么有效、有多有效，以及别神化它。',
  content: `# Emotion Prompting 情感提示：到底有没有用

你可能刷到过这种说法：跟 AI 说「这对我很重要」「请认真点」，它会答得更好。听着像玄学，但这事**真有论文做过实验**，叫 Emotion Prompting（情感提示，也叫 EmotionPrompt）。

结论是：**有用，但别神化。** 下面说清楚有用在哪、有多大用。

## 它是什么

很简单，就是在正常的指令后面，加一句带情感的话。比如：

- 「这对我的职业生涯非常重要。」
- 「请你认真对待，仔细检查后再回答。」
- 「我很有信心你能做好，请全力以赴。」

微软等机构的实验里，给提示加上这类情感语句，在一批任务上平均表现有小幅提升，部分任务还挺明显。

## 为什么会有效（推测）

没有定论，比较被接受的解释是：训练数据里，**带有「这很重要、要认真」语境的内容，往往后面跟着的是更严谨、更完整的回答**。模型学到了这种关联。你加情感语句，相当于把它往「认真模式」的分布上引。

说白了，不是模型「有了情绪」，是你的措辞激活了训练数据里「高质量回答」那一片区域。

## 怎么用

加在指令末尾就行：

\`\`\`
请帮我审查这段代码有没有安全漏洞，逐行分析。
这关系到一次重要的生产上线，请务必认真、不要遗漏。
\`\`\`

几个常被验证有点效果的句式：

- 强调重要性：「这对我非常重要」
- 鼓励 + 期待：「我相信你能做到最好」
- 要求严谨：「请仔细检查后再给结论」

## 泼盆冷水：别神化它

**提升是「锦上添花」级别，不是「质变」。** 一个本来就写得清楚、给了足够上下文的好提示，加情感语句可能再涨一点点。但指望靠一句「这很重要」把烂提示救活，不现实。

**对客观题几乎没用。** 数学计算、事实查询这种有标准答案的，情感语句帮不上忙。它更可能在开放性、需要「用心程度」的任务上有点作用。

**别滥用、别浮夸。** 整段全是「求求你了这太重要了」反而像噪声。一句到位就够。

**新模型上效果在减弱。** 越强的模型本来就稳定，情感提示的边际收益越小。这技巧在中等能力模型上更明显。

## 优先级排序

如果你想提升回答质量，正确的顺序是：

1. 把任务说清楚（最重要）
2. 给足上下文和例子（[few-shot 提示](/tutorials/few-shot-prompting-complete-guide-and-examples-dsy4k6) 这类）
3. 用对推理技巧（思维链等）
4. **最后**，再考虑加点情感提示锦上添花

把第 4 步当第 1 步做，就本末倒置了。打基础还是看 [提示工程入门](/tutorials/prompt-engineering-101-beginners-complete-guide-mbnbq0)。

## 小结

情感提示是真有点用的小技巧，成本几乎为零，加一句无妨。但它是「点缀」不是「主菜」——先把提示本身写好，这个才有意义。`,
  level: 'beginner',
  category: 'concept',
  tags: ['Emotion Prompting', '情感提示', '提示工程', 'prompt engineering', 'EmotionPrompt'],
  related_tools: ['ChatGPT', 'Claude', 'Gemini'],
  estimated_minutes: 7,
  published_at: '2026-05-31T09:00:00Z'
},
{
  slug: 'rephrase-and-respond-prompting-guide-2026',
  title: 'Rephrase and Respond：让模型先改写你的问题，再回答',
  subtitle: '一个治「问题没问清楚导致答非所问」的简单技巧',
  summary: 'Rephrase and Respond（RaR，改写并回答）让模型在作答前，先用自己的话把你的问题重述、补全一遍，再回答。能有效减少因问题模糊、有歧义导致的答非所问。本文给原理和模板。',
  content: `# Rephrase and Respond：先改写，再回答

很多时候模型答非所问，不是它笨，是**你的问题本身有歧义，而它按错误的理解答了。** Rephrase and Respond（RaR，改写并回答）就是来堵这个漏的。

做法一句话：**让模型在回答前，先用自己的话把你的问题重新表述、补全细节，然后再基于改写后的版本作答。**

## 为什么有用

人和人之间，听不懂会反问「你是说……对吧？」。模型默认不会反问，它会直接按自己的理解开答——如果理解偏了，整个回答就废了。

RaR 相当于强制它先「复述确认」一遍。这一复述，常常会：

- **暴露歧义**：把模糊的地方明确化。
- **补全隐含条件**：把你没说全的补上。
- **对齐理解**：让它的理解和你的意图对上。

## 模板

最简单的单步版本：

\`\`\`
请先用更清晰、更完整的方式重新表述我下面这个问题（补全可能隐含的条件），
然后再回答重述后的版本。

我的问题：{你的问题}
\`\`\`

模型会先输出「你的问题其实是想问……」，再作答。你一眼就能看出它有没有理解对——理解错了，你立刻能纠正，不用等它答完一大段废话。

## 一个真实例子

原问题：

> 这个函数怎么优化？

太模糊了——优化什么？速度？内存？可读性？直接答，模型只能瞎猜一个方向。

加上 RaR，模型会先重述：

> 你想问的是：在不改变这个函数功能的前提下，如何提升它的**执行性能**（如减少时间复杂度、避免重复计算）？

这时你发现「哦它以为我要优化性能，其实我想优化可读性」，一句话就能拨正。这就是 RaR 省下的来回。

## 适合的场景

- **问题容易有歧义**：一词多义、指代不清、条件不全。
- **高代价任务**：答错成本高，宁可先花一步确认。
- **非母语提问 / 措辞不严谨**：让模型帮你把问题「翻译」成清晰版本。

## 不适合的场景

**问题已经很明确时，是浪费。** 「Python 怎么读 CSV 文件」这种，没歧义，让它先改写纯属啰嗦。

**会增加输出长度和成本。** 多了一段改写，token 上去了。批量、对延迟敏感的场景要掂量。

## 和别的技巧配合

RaR 解决的是「输入端的理解对齐」，思维链解决的是「输出端的推理过程」，两者管不同环节，可以叠加：先 RaR 对齐理解，再 CoT 推理作答。

它和 [Step-Back 后退提示](/tutorials/step-back-prompting-complete-guide-2026) 也有点像——都是「先做点别的，再正式答」，但 Step-Back 是抽象原理，RaR 是澄清问题，目的不同。

## 小结

Rephrase and Respond 的本质是「让模型先确认听懂了没」。问题越模糊、答错越亏，它越值得用。问题本身清楚的，跳过这步。`,
  level: 'beginner',
  category: 'concept',
  tags: ['Rephrase and Respond', '改写并回答', '提示工程', 'prompt engineering', 'RaR'],
  related_tools: ['ChatGPT', 'Claude', 'Gemini'],
  estimated_minutes: 7,
  published_at: '2026-05-30T09:00:00Z'
},
{
  slug: 'human-ai-collaboration-patterns-2026',
  title: 'Human-AI Collaboration Patterns：人机协作的 6 种实用模式',
  subtitle: '不是「AI 替代人」也不是「人指挥 AI」，好的协作有章法可循',
  summary: '把 AI 用好的团队，都不是简单地「让 AI 干活」，而是设计了清晰的人机协作模式。本文总结 6 种经过验证的协作模式——从结对、审阅到人在回路，告诉你各自适合什么场景。',
  content: `# Human-AI Collaboration Patterns：人机协作的实用模式

聊 AI 容易陷进两个极端：要么「AI 要取代人了」，要么「AI 就是个高级工具」。真正把 AI 用出效果的团队，想的不是这两个，而是**人和 AI 各自该干什么、怎么交接**。

这就是协作模式。下面这 6 种，是目前实践里最常见、也最管用的。

## 模式总览

| 模式 | 谁主导 | 适合场景 |
|------|--------|---------|
| 结对协作 | 人 + AI 并肩 | 写代码、写文档 |
| 草稿—精修 | AI 出草稿，人定稿 | 内容创作 |
| 审阅把关 | AI 产出，人审核 | 高风险输出 |
| 人在回路 | AI 自动，关键点人介入 | 自动化流程 |
| 增强决策 | AI 给信息，人决策 | 分析、判断类 |
| 委托执行 | 人定目标，AI 自主跑 | 成熟、低风险任务 |

## 1. 结对协作（Pairing）

最熟悉的一种——像结对编程，人和 AI 实时一来一回。你写一点，AI 补一点；AI 提个方案，你调整。Cursor、Copilot 这类工具就是这个模式。

**关键**：人始终在驾驶位，AI 是副驾。适合需要持续判断、上下文多的创造性工作。

## 2. 草稿—精修（Draft-Refine）

AI 先出一版完整草稿，人再来改。写邮件、写文案、写初版代码常用。

**好处**：从 0 到 1 最费劲，AI 把这步包了，人专注「从 60 分到 90 分」。
**坑**：别被草稿带跑。AI 的初稿常有「看着对其实不对」的地方，精修时要带批判眼光，不能只做文字润色。

## 3. 审阅把关（Review Gate）

AI 产出，但**必须经人审核才能用**。代码合并前、内容发布前、决策执行前设一道人工关卡。

适合输出错了代价高的场景。和软件工程里的 code review 一个道理——AI 写得再快，关键产物得有人签字。涉及安全的输出尤其要这样，可参考 [AI 安全与提示注入防御](/tutorials/ai-security-prompt-injection-jailbreaking-guardrails-2026)。

## 4. 人在回路（Human-in-the-Loop）

流程大部分自动跑，**只在关键节点或不确定时**把人拉进来。比如一个客服 Agent，常见问题自动答，遇到退款、投诉这类敏感的，自动转人工。

**设计要点**：定义清楚「什么时候该叫人」。门槛设太低，人累死；设太高，出事没人兜。这个阈值是要调的。

## 5. 增强决策（Augmented Decision）

AI 不做决定，只**把信息整理好、把选项和依据摆出来**，最终由人拍板。投资分析、医疗辅助、商业判断常用。

**核心边界**：决策权和责任在人。AI 提供的是「更全的信息和更快的整理」，不是「替你负责」。这条线在高风险领域必须守死。

## 6. 委托执行（Delegation）

人只定目标和边界，AI 自主完成全流程。这是自主 Agent 的方向，比如「帮我把这批数据清洗后生成报告」。

**前提**：任务足够成熟、出错可控、有兜底。别一上来就把高风险任务全委托出去。关于让 Agent 自主跑，可以看 [LangGraph 有状态 Agent 指南](/tutorials/langgraph-stateful-ai-agents-guide-2026)。

## 怎么选模式

一条朴素的原则：**任务越关键、越不可逆，人就越要往前站。**

- 低风险、可逆、量大 → 往委托/自动化走
- 高风险、不可逆、敏感 → 往审阅/人决策走
- 新接入一个场景 → 先从「审阅把关」起步，跑稳了再放权

## 小结

人机协作不是「用不用 AI」的是非题，是「怎么分工」的设计题。先想清楚这个任务该用哪种模式，比纠结用哪个模型重要得多。`,
  level: 'beginner',
  category: 'concept',
  tags: ['Human-AI Collaboration', '人机协作', 'AI协作模式', 'human-in-the-loop', 'AI工作流'],
  related_tools: ['Cursor', 'GitHub Copilot', 'Claude'],
  estimated_minutes: 9,
  published_at: '2026-05-29T09:00:00Z'
},
{
  slug: 'machine-learning-model-monitoring-dashboard-2026',
  title: 'ML 模型监控 Dashboard：上线后该盯哪些指标（2026 实战）',
  subtitle: '模型上线只是开始，没有监控的模型就是在裸奔',
  summary: '机器学习模型上线后会悄悄退化——数据漂移、性能下滑、线上线下不一致。这篇讲清一个生产级监控 Dashboard 该盯哪些指标、怎么搭、用什么工具，让你在出事前就发现问题。',
  content: `# ML 模型监控 Dashboard：上线后盯什么

很多团队的模型上线那天是高光时刻，然后……就没有然后了。没人盯着它，直到某天效果明显变差、被业务方投诉，才回头查。

**模型不是上线就一劳永逸的，它会随着时间悄悄退化。** 监控 Dashboard 就是你的眼睛。

## 模型为什么会「变坏」

它本身没变，是**世界变了**：

- **数据漂移（Data Drift）**：线上输入的数据分布，和训练时不一样了。比如用户行为变了、季节变了、有了新品类。
- **概念漂移（Concept Drift）**：输入和输出的关系本身变了。反欺诈模型最典型——骗子手法一直在变。
- **上下游变化**：某个特征的数据源改了格式、出了 bug，模型悄悄吃了脏数据。

这些都不会报错，模型照常返回结果，只是结果越来越不靠谱。没监控你根本不知道。

## Dashboard 该盯的四类指标

**1. 性能指标**（最直接）
准确率、AUC、F1 等。问题是线上往往拿不到真实标签（label 有延迟），所以常配合代理指标看趋势。

**2. 数据漂移指标**
对比线上输入和训练数据的分布。常用 PSI（群体稳定性指数）、KL 散度。某个特征的分布突然偏移，是最早的预警信号。

**3. 预测分布**
模型输出本身的分布。比如一个分类模型，突然某一类的预测占比从 5% 飙到 40%，多半出事了。

**4. 系统指标**
延迟、吞吐、错误率、资源占用。模型再准，响应要 5 秒也没法用。

| 指标类别 | 代表指标 | 看什么 |
|---------|---------|--------|
| 性能 | 准确率/AUC/F1 | 效果有没有掉 |
| 数据漂移 | PSI、KL 散度 | 输入变没变 |
| 预测分布 | 各类别占比 | 输出异不异常 |
| 系统 | 延迟、错误率 | 服务稳不稳 |

## 怎么搭

不用从零造轮子，常见组合：

- **指标采集**：模型服务里埋点，把输入特征、预测、延迟打到日志或时序库。
- **存储**：Prometheus（系统指标）+ 数据仓库（特征/预测）。
- **可视化**：Grafana 拉指标做面板，设阈值告警。
- **专用工具**：Evidently、WhyLabs 这类专门做 ML 监控的，漂移检测开箱即用，省事。

\`\`\`python
# Evidently 检测数据漂移（示意）
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=train_df, current_data=live_df)
report.save_html("drift_report.html")
\`\`\`

如果你做的是 LLM 应用，监控维度不太一样（更关注质量、幻觉、成本），那套更适合用 [LangSmith / Langfuse 这类 LLM 可观测性工具](/tutorials/langsmith-vs-langfuse-llm-observability-2026)。

## 几个实操建议

**先设告警，再做大屏。** 漂亮的 Dashboard 没人天天盯，但阈值告警能在半夜把你叫醒。优先级：告警 > 趋势图 > 花哨大屏。

**漂移阈值别拍脑袋。** PSI 常用 0.1（轻微）、0.25（显著）做参考线，但具体得结合你的业务实际跑一段时间校准。

**留好「重训触发器」。** 监控的终点是行动——漂移到一定程度，要能触发重新训练或人工介入，光看不动等于没监控。

## 小结

一句话：**没有监控的模型，是在裸奔。** 上线那天就该把监控一起上，而不是等出事了再补。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['模型监控', 'ML monitoring', '数据漂移', 'data drift', 'MLOps'],
  related_tools: ['Evidently', 'Grafana', 'Prometheus', 'LangSmith'],
  estimated_minutes: 11,
  published_at: '2026-05-28T09:00:00Z'
},
{
  slug: 'enterprise-ai-governance-framework-2026',
  title: 'Enterprise AI Governance：企业 AI 治理框架怎么落地（2026）',
  subtitle: '不是写一堆制度文档，是把「AI 用得安全、合规、可控」变成可执行的机制',
  summary: '企业引入 AI 后，绕不开治理：数据安全、合规、模型风险、责任归属。这篇把 AI 治理框架拆成可落地的几块——政策、流程、技术管控、组织角色，避免你的 AI 项目踩合规雷区。',
  content: `# Enterprise AI Governance：企业 AI 治理框架

公司开始用 AI 了，老板很兴奋，法务很紧张。这时候你需要的不是更多 PPT，是一套**能落地的 AI 治理框架**——让 AI 用得起来，又不出事。

治理听着像「管制」，但好的治理其实是「让大家敢放心用」。下面按可执行的维度拆开讲。

## 治理到底在管什么风险

先认清要防的是什么：

- **数据风险**：敏感数据、客户隐私被喂进了外部模型。
- **合规风险**：违反 GDPR、行业监管、AI 法案。
- **模型风险**：幻觉、偏见、不可解释导致错误决策。
- **安全风险**：提示注入、数据泄露、被滥用。
- **责任风险**：AI 出错了，谁负责？

治理框架就是把这些风险变成「有人管、有流程、有工具兜」。

## 四个支柱

**1. 政策与原则（定规矩）**
明确「什么能用 AI、什么不能」「哪些数据绝不能进外部模型」「输出要不要人审」。一页纸的清晰红线，比一百页没人看的制度有用。

**2. 流程与审批（定关卡）**
新 AI 应用上线前走什么评审？高风险场景谁审批？建议分级——低风险快速通道，高风险（涉及客户、资金、合规）走严格评审。

**3. 技术管控（定护栏）**
把规矩变成代码：
- 数据脱敏、访问控制，敏感数据进模型前先处理
- 输入输出过滤，防注入、防泄露，相关做法见 [AI 安全与提示注入防御](/tutorials/ai-security-prompt-injection-jailbreaking-guardrails-2026)
- 审计日志，每次 AI 调用可追溯（谁、什么时候、问了什么、答了什么）

**4. 组织与角色（定责任）**
谁对 AI 治理负责？常见设一个跨部门的 AI 治理小组（法务 + 安全 + 业务 + 技术），别让它悬空。责任不清，出事就互相甩锅。

## 落地路线

别想着一步到位搞个完美框架，会卡死。务实的顺序：

1. **先划红线**：最快能做的，明确「绝对不能做的事」（如客户身份证号不能进任何外部 LLM）。
2. **建分级评审**：把 AI 应用按风险分级，高风险才重审。
3. **上技术护栏**：脱敏、日志、过滤先做起来。
4. **再迭代细化**：跑一段时间，按实际问题补流程。

## 几个真心话

**治理不是为了卡死创新。** 过度治理会让团队宁可偷偷用影子 AI，反而更失控。目标是「安全地放开」，不是「一刀切禁止」。

**审计日志是最低成本、最高价值的一步。** 哪怕别的都没做，先把「所有 AI 调用可追溯」做了——出事时能查，本身就是巨大的安全感。

**合规要拉法务早介入。** 技术团队判断不了 GDPR、行业监管的边界，别等做完了才发现踩线。

## 小结

企业 AI 治理的本质，是把「凭感觉用 AI」升级成「有规矩、有护栏、有人负责地用」。先划红线、上日志，再慢慢完善——能跑起来的简单框架，胜过完美的纸上框架。`,
  level: 'intermediate',
  category: 'concept',
  tags: ['AI治理', 'AI Governance', '企业AI', '合规', 'AI安全'],
  related_tools: ['Azure AI', 'AWS Bedrock', 'Claude'],
  estimated_minutes: 10,
  published_at: '2026-05-27T09:00:00Z'
},
{
  slug: 'llm-fallback-strategy-production-2026',
  title: 'LLM Fallback 降级策略：模型挂了，你的应用还能活吗',
  subtitle: '生产级 LLM 应用必须有 Plan B——超时、限流、宕机时怎么优雅降级',
  summary: 'LLM API 会超时、会限流、会宕机，单点依赖一个模型的应用迟早出事。这篇讲清生产级 LLM 应用的 fallback（降级）策略：多模型切换、重试、缓存、兜底回复，让你的服务在模型出问题时不至于全挂。',
  content: `# LLM Fallback 降级策略：给你的应用上保险

做过 LLM 应用上生产的都知道一个真相：**API 一定会出问题。** 超时、429 限流、偶发 500、甚至整个服务商宕机。如果你的应用死死绑在一个模型上，它一打喷嚏，你就全挂。

Fallback（降级）策略就是给应用上的保险。

## 会遇到的故障

- **超时**：请求发出去，迟迟不回。
- **限流（429）**：调太快，被服务商挡了。
- **服务错误（5xx）**：服务商那边抽风。
- **整体宕机**：OpenAI / Anthropic 偶尔会有大面积故障。
- **内容拒答**：模型以安全为由拒绝回答。

每一种，你都得想好「然后呢」。

## 降级策略分层

从轻到重，一层层兜：

**第一层：重试（Retry）**
偶发错误，等一下重试往往就好了。用指数退避，别傻等也别猛冲：

\`\`\`python
import time
def call_with_retry(fn, max_retries=3):
    for i in range(max_retries):
        try:
            return fn()
        except (TimeoutError, RateLimitError) as e:
            if i == max_retries - 1: raise
            time.sleep(2 ** i)  # 1s, 2s, 4s
\`\`\`

**第二层：换模型（Model Fallback）**
主模型不行，自动切备用模型。常见组合：主用 GPT-4o，挂了切 Claude，再不行切个便宜快的小模型保底。

\`\`\`python
MODELS = ["gpt-4o", "claude-3-5-sonnet", "gpt-4o-mini"]
def chat_with_fallback(messages):
    for model in MODELS:
        try:
            return call_model(model, messages)
        except Exception:
            continue  # 换下一个
    return DEFAULT_REPLY  # 全挂了走兜底
\`\`\`

这也是为什么生产应用最好用一个统一的网关层（如 LiteLLM）来抽象多家模型——切换只改配置，不动业务代码。

**第三层：缓存（Cache）**
常见问题的答案缓存起来。模型全挂时，至少高频问题还能用缓存答。语义缓存还能命中「意思相近」的问题。

**第四层：兜底回复（Graceful Degradation）**
全部都不行了，也不能给用户甩一个 500。返回一个体面的兜底：「AI 助手暂时繁忙，您可以稍后再试，或联系人工客服。」

## 设计要点

**超时一定要设，而且要短。** 别用默认的几十秒超时——用户等 30 秒早跑了。根据场景设 5-15 秒，超了就走 fallback。

**fallback 链要考虑质量落差。** 从 GPT-4o 降到小模型，回答质量会掉。关键场景宁可返回「稍后再试」，也别用一个明显变差的答案糊弄，反而砸口碑。

**别把 fallback 写死在业务逻辑里。** 抽一个统一的调用层，把重试、切换、缓存、兜底都收口在一处。业务代码只管「我要个回答」，怎么容错是底层的事。

**监控 fallback 触发率。** 如果备用模型经常被触发，说明主模型有问题，这是个信号，要去查。可以接 [LLM 可观测性工具](/tutorials/langsmith-vs-langfuse-llm-observability-2026) 盯着。

## 一个完整的降级链

\`\`\`
用户请求
  → 查缓存（命中直接返回）
  → 主模型 + 重试
  → 备用模型 + 重试
  → 兜底回复
\`\`\`

## 小结

LLM 应用的健壮性，不看它顺利时多强，看它出问题时多稳。**上生产前，先问自己一句：模型现在挂了，我的用户会看到什么？** 答不上来，就该补 fallback 了。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['LLM Fallback', '降级策略', '容错', '生产部署', 'reliability'],
  related_tools: ['LiteLLM', 'OpenAI', 'Claude', 'OpenRouter'],
  estimated_minutes: 10,
  published_at: '2026-05-26T09:00:00Z'
},
{
  slug: 'ai-system-design-llm-application-architecture-2026',
  title: 'AI System Design：一个生产级 LLM 应用该怎么设计架构',
  subtitle: '从一个 API 调用，到能扛流量、控成本、保质量的完整系统',
  summary: '把 LLM 接进产品，写个 API 调用谁都会。但要做成能扛真实流量、成本可控、质量稳定的系统，需要架构设计。这篇把一个生产级 LLM 应用的关键模块拆开讲：检索、缓存、限流、降级、监控。',
  content: `# AI System Design：生产级 LLM 应用架构

面试常问「设计一个 ChatGPT」，工作中更常遇到「把 LLM 接进我们产品并扛住流量」。两件事的内核是一样的：**从一个 API 调用，长成一个系统。**

这篇按模块讲清楚，一个像样的 LLM 应用架构都有哪些层。

## 一个最小可用的架构

\`\`\`
用户
 → API 网关（鉴权、限流）
 → 应用层（编排逻辑）
    ├─ 缓存层（命中直接返回）
    ├─ 检索层（RAG：向量库 + 重排）
    ├─ 模型层（主模型 + 备用模型）
    └─ 后处理（过滤、格式化）
 → 监控 / 日志（贯穿全程）
\`\`\`

下面逐层说为什么需要。

## 检索层（RAG）

如果应用要基于私有知识回答，就需要 RAG：把文档向量化存进向量库，查询时检索相关片段喂给模型。这一层的工程量经常被低估——分块策略、检索召回、重排，每一步都影响最终质量。框架选型可参考 [LlamaIndex vs LangChain](/tutorials/llamaindex-vs-langchain-which-rag-framework-2026)，向量库选型看 [Qdrant vs Chroma](/tutorials/qdrant-vs-chroma-vector-database-2026)。

## 缓存层

LLM 调用又慢又贵，缓存是性价比最高的优化。两种：
- **精确缓存**：相同问题直接返回上次结果。
- **语义缓存**：意思相近的问题也命中（用向量相似度判断）。

高频问题缓存命中率上去后，成本和延迟都能砍一大块。

## 模型层与降级

别死绑一个模型。设计成可切换的网关，主模型挂了能自动切备用。这部分单独成篇讲过，见 [LLM Fallback 降级策略](/tutorials/llm-fallback-strategy-production-2026)。

成本上还有个常用技巧：**模型分级路由**——简单问题走便宜的小模型，复杂问题才上 GPT-4o 这种贵的。能省不少钱。

## 限流与并发

LLM API 有速率限制，你的应用也得有。否则一波流量进来，要么把你自己的额度打爆，要么把下游模型打到 429。网关层做令牌桶限流，超出的排队或快速失败。

## 后处理

模型输出不能直接信：
- **安全过滤**：防注入、防有害输出，见 [AI 安全防御](/tutorials/ai-security-prompt-injection-jailbreaking-guardrails-2026)。
- **格式校验**：要 JSON 就校验是不是合法 JSON，不对就重试或修复。
- **敏感信息脱敏**：输出里别带出不该有的数据。

## 监控（最容易省略，最不该省略）

每次调用记录：延迟、token、成本、命中的模型、用户反馈。没有这些，线上质量下滑你根本无感。LLM 应用的监控维度和传统服务不同，详见 [LangSmith vs Langfuse](/tutorials/langsmith-vs-langfuse-llm-observability-2026)。

## 面试 / 设计时的取舍点

被问到设计题，体现深度的是这些权衡：

| 维度 | 取舍 |
|------|------|
| 延迟 vs 质量 | 流式输出改善体感；小模型快但差 |
| 成本 vs 质量 | 分级路由、缓存压成本 |
| 实时 vs 准确 | RAG 实时检索 vs 预计算 |
| 自建 vs API | 数据敏感自托管，否则用 API 省心 |

## 小结

LLM 应用架构的核心，不是「怎么调模型」，是**「怎么在质量、成本、延迟、可靠性之间做平衡」**。检索、缓存、降级、限流、监控——这几层搭齐了，你才有一个能上生产的系统，而不只是一个 demo。`,
  level: 'advanced',
  category: 'concept',
  tags: ['AI System Design', 'LLM架构', '系统设计', 'AI应用架构', 'RAG'],
  related_tools: ['LangChain', 'LiteLLM', 'Qdrant', 'Redis'],
  estimated_minutes: 12,
  published_at: '2026-05-25T09:00:00Z'
},
{
  slug: 'voice-activity-detection-python-guide-2026',
  title: 'Voice Activity Detection (VAD)：用 Python 检测「有没有人在说话」',
  subtitle: '语音应用的第一道关卡，做好它能省一大半识别成本',
  summary: 'Voice Activity Detection（VAD，语音活动检测）判断音频里哪段是人声、哪段是静音/噪声。它是语音应用的基础环节，做好能大幅降低后续 ASR 的成本和延迟。本文用 Python 实战 webrtcvad 和 Silero VAD。',
  content: `# Voice Activity Detection：用 Python 检测人声

做语音应用，第一个该解决的不是「识别说了什么」，而是「这段音频里到底有没有人在说话」。这就是 VAD（Voice Activity Detection，语音活动检测）干的事。

为什么重要？因为**把静音和噪声段也丢给语音识别（ASR），既费钱又费时还容易出错。** VAD 先把人声段切出来，后面才高效。

## 它解决什么

一段录音里通常混着：人说话、停顿静音、背景噪声。VAD 的任务是给每一小段打标签——「这是语音」还是「这不是语音」。

典型用途：
- **实时语音助手**：检测到用户开始说话才唤醒、说完了才提交识别。
- **降低 ASR 成本**：只把人声段送去识别，静音不送。
- **语音分段**：长录音按说话/停顿切成片段。

## 方案一：webrtcvad（轻量、快）

Google WebRTC 项目里的 VAD，极轻量，纯靠信号特征判断，不用模型，速度飞快。

\`\`\`python
import webrtcvad
vad = webrtcvad.Vad(2)  # 0-3，数字越大越激进（越容易判为非语音）

# 音频需是 16kHz/8kHz、16-bit 单声道，按 10/20/30ms 分帧
is_speech = vad.is_speech(frame_bytes, sample_rate=16000)
\`\`\`

**优点**：快、零依赖模型、适合实时和资源受限场景。
**缺点**：吵的环境里容易误判——它分不清「人声」和「像人声的噪声」。

## 方案二：Silero VAD（准、抗噪）

基于神经网络的 VAD，准确率明显更高，尤其抗噪声。模型也很小，CPU 上就能实时跑。

\`\`\`python
import torch
model, utils = torch.hub.load('snakers4/silero-vad', 'silero_vad')
(get_speech_timestamps, _, read_audio, _, _) = utils

wav = read_audio('audio.wav', sampling_rate=16000)
speech_ts = get_speech_timestamps(wav, model, sampling_rate=16000)
# speech_ts: [{'start': 12000, 'end': 35000}, ...] 人声段的采样点区间
\`\`\`

**优点**：准、抗噪、多语言通用、还轻。
**缺点**：比 webrtcvad 重一点（要加载模型），但绝大多数场景这点开销值得。

## 怎么选

| 场景 | 推荐 |
|------|------|
| 资源极受限 / 嵌入式 | webrtcvad |
| 环境安静、要极致快 | webrtcvad |
| 有噪声 / 要准 | Silero VAD |
| 大多数应用 | Silero VAD |

实话说，除非你跑在很弱的设备上，**默认选 Silero VAD**，省心又准。

## 实战中的坑

**采样率和格式要对。** webrtcvad 对输入格式很挑（16/8kHz、16-bit、单声道、固定帧长），不对就报错或乱判。先把音频转成它要的格式。

**别指望 VAD 解决一切。** 强噪声、多人同时说话这些复杂场景，VAD 也会犯错。它是「第一道粗筛」，不是完美分离器。

**加一点缓冲。** 人声段前后留一点余量（padding），别把刚要说的第一个字或尾音切掉了。

## 接下来

VAD 切出人声段后，下一步就是送去 ASR 做识别。如果要做多语种识别，可以接着看 [多语种语音识别](/tutorials/multilingual-asr-speech-recognition-2026)，或用 [OpenAI Whisper API](/tutorials/openai-whisper-api-complete-guide-2026)。

## 小结

VAD 是语音流水线里最容易被跳过、又最不该跳过的一环。做好它，后面的识别又快又省。新项目无脑选 Silero VAD 起步基本不会错。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['Voice Activity Detection', 'VAD', '语音检测', 'Python', '语音识别'],
  related_tools: ['Silero VAD', 'webrtcvad', 'Whisper', 'PyTorch'],
  estimated_minutes: 9,
  published_at: '2026-05-24T09:00:00Z'
},
{
  slug: 'multilingual-asr-speech-recognition-2026',
  title: '多语种语音识别（Multilingual ASR）：一套方案识别几十种语言',
  subtitle: '从 Whisper 到混合语言场景，多语种 ASR 的现状与实操',
  summary: '多语种 ASR（自动语音识别）让一套系统能识别几十种语言，甚至处理一句话里中英混说的情况。本文讲清主流方案（以 Whisper 为代表）、语言检测、中英混说处理，以及落地时的真实难点。',
  content: `# 多语种语音识别（Multilingual ASR）

做面向全球或者多语言用户的语音产品，绕不开一个需求：**一套系统，识别几十种语言。** 这就是多语种 ASR（Automatic Speech Recognition）。

好消息是，这几年这事变简单多了——以前每种语言一个模型，现在一个模型通吃几十上百种语言。

## 现在的主流方案

**Whisper（OpenAI）几乎是默认选择。** 一个模型支持近 100 种语言，开源、效果好、用法简单。多语种 ASR 现在很大程度上就是「用好 Whisper」。

\`\`\`python
import whisper
model = whisper.load_model("large-v3")

# 自动检测语言并识别
result = model.transcribe("audio.mp3")
print(result["language"], result["text"])

# 或指定语言（已知语言时更准更快）
result = model.transcribe("audio.mp3", language="zh")
\`\`\`

云端不想自己跑模型的，直接用 [OpenAI Whisper API](/tutorials/openai-whisper-api-complete-guide-2026)，传音频拿文本。

其他选择：各家云厂商（Google、Azure、AWS）的语音服务也都支持多语种，胜在工程化完善、有 SLA，但要钱、数据走第三方。

## 语言检测

多语种场景第一个问题：**这段音频是什么语言？**

Whisper 内置语言检测——不指定 language 参数时，它先听一小段判断语言，再识别。多数场景够用。

但如果你**已经知道**用户的语言（比如根据 App 设置），一定要显式指定。原因有两个：检测会偶尔判错（尤其短音频、口音重），而且跳过检测还更快。

## 最难啃的：中英混说

真实场景里，很多人一句话里中英文混着说：「这个 deadline 我觉得有点 tight」。这是多语种 ASR 最头疼的地方——code-switching（语码转换）。

现状：
- Whisper 对中英混说有一定处理能力，但不完美，专业术语、缩写容易出错。
- 强制指定单一语言反而会更差（它会硬把英文词按中文音转写）。混说场景一般让它自动，或用 large 级别模型。
- 对识别准确率要求高的混说场景，可能需要针对性微调或后处理纠错。

别指望开箱即用就完美——混说是个公认的难题，能接受「大部分对、个别词错」就用，不能接受就得投入做优化。

## 落地的真实难点

**模型大小是个权衡。** Whisper 从 tiny 到 large-v3，越大越准但越慢越吃显存。实时场景可能得用小模型 + 接受精度损失，或上 GPU。

**口音和方言。** 训练数据里某语言的口音覆盖不全时，重口音识别会掉。这个目前没有银弹。

**先做 VAD 再识别。** 把静音和噪声段先用 [VAD 检测](/tutorials/voice-activity-detection-python-guide-2026) 切掉，只识别人声段——又快又省又准。这是标准做法。

**专有名词、术语。** 通用模型对行业黑话、人名、产品名容易错。可以用 prompt 提示（Whisper 支持传 initial_prompt 给点上下文词）或后处理纠正。

## 一条务实的落地路径

\`\`\`
音频 → VAD 切人声段 → Whisper 识别（自动/指定语言）→ 后处理纠错 → 文本
\`\`\`

## 小结

多语种 ASR 在 Whisper 之后门槛大降，一套方案识别几十种语言已经是现实。但中英混说、口音、术语这些「最后一公里」仍然难。先用 Whisper 把大盘子搭起来，针对你的具体痛点再优化，是最务实的路子。`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['多语种ASR', 'Multilingual ASR', '语音识别', 'Whisper', 'speech recognition'],
  related_tools: ['Whisper', 'OpenAI', 'Silero VAD', 'Azure Speech'],
  estimated_minutes: 10,
  published_at: '2026-05-23T09:00:00Z'
},
{
  slug: 'notebooklm-obsidian-integration-workflow-2026',
  title: 'NotebookLM + Obsidian：把 AI 问答接进你的笔记库',
  subtitle: '一个管「永久知识沉淀」，一个管「基于资料深度问答」，搭起来很香',
  summary: 'NotebookLM 擅长基于你上传的资料做问答和总结，Obsidian 擅长长期的本地知识管理。这篇讲清两者的定位差异，以及怎么把它们组合成一套「输入→问答→沉淀」的个人知识工作流。',
  content: `# NotebookLM + Obsidian：搭一套知识工作流

这俩工具经常被一起提，但它们其实管的是知识流程的不同环节。搞清各自定位，组合起来用才顺。

- **NotebookLM**（Google）：你上传一堆资料（PDF、文档、网页、视频），它基于这些资料问答、总结、生成概览，答案带出处。强在「**基于特定资料的深度问答**」。
- **Obsidian**：本地优先的笔记软件，Markdown 文件 + 双向链接，建你自己的知识网络。强在「**长期的、结构化的知识沉淀**」。

一个偏「临时研究一批资料」，一个偏「永久积累自己的知识」。

## 为什么要组合

单用各有短板：

- NotebookLM 的资料是「一个 notebook 一摊」，不沉淀、不互联，研究完就散了。
- Obsidian 笔记多了之后，自己翻找费劲，它本身没有强的 AI 问答（虽有插件）。

组合起来就互补了：**用 NotebookLM 快速消化新资料、问出洞见，再把有价值的结论沉淀进 Obsidian 长期保存。**

## 一套实用工作流

\`\`\`
新资料（论文/报告/课程）
  → 丢进 NotebookLM 问答、总结、提炼要点
  → 把有价值的结论 / 笔记整理成 Markdown
  → 存进 Obsidian，加双向链接，并入知识网络
  → 以后回顾、关联、复用
\`\`\`

具体点说：

**1. 用 NotebookLM 做「消化」**
把一篇长论文或一批文档传进去，让它生成概览、列关键观点，你再追问细节。它带出处，方便核实。这一步是「快速搞懂一摊新资料」。

**2. 把精华导出成 Markdown**
NotebookLM 里整理出的要点、你问出来的好结论，复制成 Markdown 笔记。这是从「临时问答」到「永久笔记」的关键一跳。

**3. 在 Obsidian 里沉淀和联网**
存进 Obsidian，用双向链接把它和已有笔记连起来。比如这篇讲 RAG 的论文笔记，链到你之前关于「向量数据库」的笔记。时间一长，这张网就是你的第二大脑。

## 现实一点说

**两者目前没有官方打通**，中间的「导出—整理—存入」这步是手动的。别期待一键同步——它更像是「两个好工具配合一个手动流程」，而不是一个无缝产品。

**NotebookLM 的资料不是你的长期库。** 它适合「这一批资料」的研究，研究完精华要主动搬走，否则散在各个 notebook 里等于没沉淀。

**Obsidian 想要 AI 问答**，社区有不少插件（接 GPT/Claude 对笔记问答），如果你更想「在自己的笔记库里直接问」，这些插件 + NotebookLM 可以并用。

## 适合谁

- 研究者、学生：大量读资料 + 要长期积累，这套很贴。
- 知识工作者：经常消化新信息又想沉淀的。
- 重度笔记用户：已经在用 Obsidian，想给「读新资料」这步加个 AI 加速器。

## 小结

NotebookLM 管「快速读懂一批资料」，Obsidian 管「长期攒成自己的知识」。中间手动搭一道「把精华搬过去」的流程，你就有了一套「输入→问答→沉淀」的闭环。工具不在多，在于让它们各司其职。`,
  level: 'beginner',
  category: 'workflow',
  tags: ['NotebookLM', 'Obsidian', 'AI笔记', '知识管理', 'AI工作流'],
  related_tools: ['NotebookLM', 'Obsidian', 'Claude', 'ChatGPT'],
  estimated_minutes: 8,
  published_at: '2026-05-22T09:00:00Z'
}
];

await upsert('tutorials', TUTORIALS);
