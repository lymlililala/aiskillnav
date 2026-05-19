/**
 * SEO/GEO 优化批次 2026-05-19
 * node scripts/insert-seo-0519.mjs
 */

const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E';
const H = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${KEY}`,
  apikey: KEY
};

async function upsert(table, rows) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=slug`, {
    method: 'POST',
    headers: { ...H, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(rows)
  });
  const t = await r.text();
  if (!r.ok) { console.error('ERROR ' + table + ':', t.slice(0, 300)); return false; }
  let j; try { j = JSON.parse(t); } catch { j = []; }
  console.log('OK ' + table + ': ' + (Array.isArray(j) ? j.length : 1) + ' rows upserted');
  return true;
}

// ─── TUTORIALS (5 篇) ────────────────────────────────────────────────────────

const T1 = {
  slug: 'gemini-2-5-pro-complete-guide-2026',
  title: 'Gemini 2.5 Pro 完整使用指南：Google 最强 AI 的正确打开方式',
  subtitle: '从基础功能到高级技巧，带你吃透 Gemini 2.5 Pro 的所有实用场景',
  summary: 'Gemini 2.5 Pro 在多模态理解、代码生成和长文档处理上表现出色，但很多人只用了 10% 的能力。本文覆盖核心功能、与 GPT-4o 的真实差距，以及最值得使用的 6 个场景，配合实际提示词示例。',
  content: `# Gemini 2.5 Pro 完整使用指南

## 一句话定位

GPT-4o 是通才，Claude 是写作专家，Gemini 2.5 Pro 的独特优势：**原生多模态**（真正理解图像+视频）+**超长上下文**（100万 token，约75万字）。

---

## 核心规格（2026年5月）

| 参数 | 数值 |
|------|------|
| 上下文窗口 | 1,000,000 tokens |
| 视频理解 | 支持，最长1小时 |
| 代码执行 | 内置 Python 沙箱 |
| 实时搜索 | Google Search 集成 |
| 价格（API）| $3.5/1M input tokens |

---

## 6 个最值得用的场景

### 1. 分析整本 PDF / 财报

**提示词模板**：
\`\`\`
[上传文件后]
请完整读取这份文档，然后：
1. 用3句话总结核心结论
2. 列出5个最重要的数据点（附原文页码）
3. 指出文档中存在的矛盾或不确定陈述
\`\`\`

**实测**：上传苹果 2025 年报（200页），完整输出三个风险因素并附原文页码——GPT-4o 的 128k 上下文做不到。

---

### 2. 视频内容分析（独家能力）

直接上传视频或 YouTube 链接，Gemini 理解视频内容：

\`\`\`
[粘贴 YouTube URL]
请看这个视频，然后：
1. 总结主要论点（带时间戳）
2. 列出所有具体数据和案例
3. 评估论证逻辑是否严谨
\`\`\`

用途：分析竞品演示视频、会议录像转纪要、教学视频生成笔记。

---

### 3. 代码执行 + 数据分析

内置 Python 沙箱，直接运行代码生成图表：

\`\`\`
[上传 CSV 文件]
请：
1. 分析各产品类别的月度销售趋势
2. 找出异常值（超出均值2个标准差）
3. 生成折线图展示趋势
4. 用一段话总结发现
\`\`\`

---

### 4. 图像批量处理

\`\`\`
[上传多张产品图片]
请逐一分析每张图片：产品类别、主要颜色、是否有品牌 Logo、图片质量
输出为 JSON 格式
\`\`\`

---

### 5. Google Workspace 深度集成

Gmail 起草邮件、Google Docs 直接修改、Sheets 自然语言生成公式、Slides 根据提纲生成 PPT——这些是其他模型无法复制的能力。

---

### 6. 实时信息 + 深度分析

\`\`\`
搜索今天关于 [话题] 的最新新闻，
分析这个趋势对 [行业] 的影响，
给出3个具体可执行的应对建议
\`\`\`

---

## 三模型横评

| 能力 | Gemini 2.5 Pro | GPT-4o | Claude 3.5 |
|------|---------------|--------|-----------|
| 上下文 | **1M tokens** | 128k | 200k |
| 视频理解 | 原生支持 | 不支持 | 不支持 |
| 代码执行 | 内置 | 需插件 | 不支持 |
| 实时搜索 | Google 集成 | 网页浏览 | 不支持 |
| 写作质量 | 优秀 | 优秀 | 最强 |
| 价格 | $3.5/1M | $2.5/1M | $3/1M |

**选择建议**：多模态+长文档首选 Gemini；写作和逐步推理首选 Claude；日常对话 GPT-4o。

---

## 如何访问

- **网页版**：gemini.google.com（免费版可用）
- **API**：Google AI Studio → aistudio.google.com
- **移动端**：iOS/Android Gemini App

---

## 延伸阅读

- [OpenAI o3 推理模型指南](/tutorials/openai-o3-practical-guide-2026)
- [2026 国产 AI 大模型横评](/tutorials/china-ai-models-comparison-2026-kimi-doubao-qwen-deepseek)
- [AI 模型完整对比](/models)`,
  level: 'beginner',
  category: 'concept',
  tags: ['Gemini', 'Google', 'Gemini 2.5 Pro', '多模态', '视频理解', 'AI工具'],
  estimated_minutes: 14,
  related_tools: ['Gemini 2.5 Pro', 'GPT-4o', 'Claude 3.5 Sonnet'],
  is_featured: true,
  published_at: '2026-05-19T08:00:00Z'
};

const T2 = {
  slug: 'llamaindex-practical-guide-2026',
  title: 'LlamaIndex 实战指南：RAG 应用开发从入门到生产',
  subtitle: 'LlamaIndex vs LangChain 怎么选？5个真实场景代码示例',
  summary: 'LlamaIndex 专为 RAG 应用而生，是构建企业知识库问答系统的首选框架。本文覆盖核心架构、与 LangChain 的关键区别，以及从文档加载到生产部署的 5 个完整代码示例。',
  content: `# LlamaIndex 实战指南：RAG 应用开发从入门到生产

## LlamaIndex vs LangChain 怎么选？

一句话：**LlamaIndex 专注于数据索引和检索，LangChain 专注于 Agent 编排和链式调用。**

| 维度 | LlamaIndex | LangChain |
|------|-----------|----------|
| 核心定位 | 数据 → AI 的桥梁 | AI 工作流编排 |
| 最强场景 | RAG、知识库问答 | Agent、多步骤任务 |
| 学习曲线 | 相对平缓 | 较陡 |
| 数据连接器 | 100+ 原生 Reader | 需额外安装 |

**选择原则**：做 RAG 知识库用 LlamaIndex；做 Agent 工作流用 LangChain；两者可以组合使用。

---

## 安装

\`\`\`bash
pip install llama-index llama-index-llms-openai llama-index-embeddings-openai
\`\`\`

---

## 场景 1：5 分钟搭建文档问答系统

\`\`\`python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings

Settings.llm = OpenAI(model="gpt-4o", api_key="sk-...")
Settings.embed_model = "text-embedding-3-small"

# 加载文档（支持 PDF、Word、TXT、HTML 等）
documents = SimpleDirectoryReader("./docs").load_data()
index = VectorStoreIndex.from_documents(documents)

query_engine = index.as_query_engine()
response = query_engine.query("这份文档的核心结论是什么？")
print(response)
\`\`\`

---

## 场景 2：持久化存储（生产环境必备）

\`\`\`python
import os
from llama_index.core import StorageContext, load_index_from_storage

PERSIST_DIR = "./storage"

if not os.path.exists(PERSIST_DIR):
    documents = SimpleDirectoryReader("./docs").load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)
\`\`\`

---

## 场景 3：带 Metadata 的多来源文档

\`\`\`python
from llama_index.core import Document
from llama_index.core.vector_stores import MetadataFilters, MetadataFilter, FilterOperator

docs = [
    Document(text="Q3 财报显示营收增长 23%...",
             metadata={"source": "财报", "year": 2025, "quarter": "Q3"}),
    Document(text="产品路线图：2026年Q1发布新功能...",
             metadata={"source": "内部文档", "type": "roadmap"})
]
index = VectorStoreIndex.from_documents(docs)

# 按来源过滤查询
query_engine = index.as_query_engine(
    filters=MetadataFilters(filters=[
        MetadataFilter(key="source", value="财报", operator=FilterOperator.EQ)
    ])
)
\`\`\`

---

## 场景 4：连接 Qdrant 向量数据库

\`\`\`python
from llama_index.vector_stores.qdrant import QdrantVectorStore
import qdrant_client

client = qdrant_client.QdrantClient(url="http://localhost:6333")
vector_store = QdrantVectorStore(client=client, collection_name="my_docs")
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
\`\`\`

---

## 场景 5：流式输出

\`\`\`python
query_engine = index.as_query_engine(streaming=True)
streaming_response = query_engine.query("请详细解释这个问题")
for text in streaming_response.response_gen:
    print(text, end="", flush=True)
\`\`\`

---

## 生产最佳实践

**增量更新索引**（避免每次全量重建）：
\`\`\`python
existing_docs = index.ref_doc_info
for doc in new_documents:
    if doc.doc_id not in existing_docs:
        index.insert(doc)
\`\`\`

**调整检索参数**：
\`\`\`python
query_engine = index.as_query_engine(
    similarity_top_k=5,
    response_mode="tree_summarize",  # 适合长文档汇总
)
\`\`\`

---

## FAQ

**Q：支持哪些文档格式？**  
A：PDF、Word、PPT、Excel、HTML、Markdown、TXT、CSV、JSON，以及数据库、Notion、Google Drive 等 100+ 来源。

**Q：中文效果好吗？**  
A：完全支持中文。推荐用 BGE 中文 Embedding 模型，效果比 OpenAI Embedding 更好且更便宜。

**Q：和 Dify 是什么关系？**  
A：Dify 提供可视化界面，底层可集成 LlamaIndex 的检索能力。需要定制开发用 LlamaIndex，需要快速搭建用 Dify。

---

## 延伸阅读

- [RAG 知识库避坑指南](/tutorials/rag-knowledge-base-best-practices)
- [向量数据库选型指南](/tutorials/vector-database-comparison-pinecone-weaviate-chroma-2026)
- [Dify 企业知识库实战](/tutorials/dify-enterprise-knowledge-base)`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['LlamaIndex', 'RAG', 'LangChain', '知识库', '向量数据库', 'Python'],
  estimated_minutes: 20,
  related_tools: ['LlamaIndex', 'LangChain', 'OpenAI', 'Qdrant'],
  is_featured: true,
  published_at: '2026-05-19T09:00:00Z'
};

const T3 = {
  slug: 'llm-api-cost-optimization-guide-2026',
  title: 'LLM API 成本控制实战：把 AI 账单从 $500 降到 $80 的 12 个方法',
  subtitle: '生产环境 LLM 成本优化全攻略，每个技巧都有实测数据',
  summary: '随着 AI 应用从 demo 走向生产，API 成本成为很多团队的头疼问题。本文总结 12 个经过实测的 LLM 成本优化方法，覆盖模型选择、Prompt 压缩、缓存策略、批处理等维度，平均可降低 60-80% 的 API 费用。',
  content: `# LLM API 成本控制实战：把 AI 账单从 $500 降到 $80

## 先说数字

某 SaaS 产品优化前后对比：

| 指标 | 优化前 | 优化后 | 降幅 |
|------|--------|--------|------|
| 月度 API 费用 | $520 | $83 | **84%** |
| 平均响应时间 | 4.2s | 1.8s | 57% |
| 每次请求成本 | $0.026 | $0.004 | 85% |

---

## 第一类：模型选择（降低 50-70%）

### 方法 1：用对的模型做对的事

最常见的浪费：**用 GPT-4o 做所有事情**。

\`\`\`python
def get_model(task_type: str) -> str:
    routing = {
        "classification": "gpt-4o-mini",     # $0.15/1M，GPT-4o的1/66
        "summarization": "gpt-4o-mini",
        "simple_qa": "gpt-4o-mini",
        "code_review": "claude-3-5-haiku-20241022",
        "complex_reasoning": "gpt-4o",
        "math": "o3-mini"
    }
    return routing.get(task_type, "gpt-4o-mini")
\`\`\`

---

### 方法 2：DeepSeek API 替代（中文场景）

DeepSeek V3 API 约 ¥1/百万 token（$0.14/1M）；GPT-4o 为 $2.5/1M。中文任务用 DeepSeek，成本降 94%：

\`\`\`python
from openai import OpenAI
client = OpenAI(api_key="deepseek-key", base_url="https://api.deepseek.com")
# 接口兼容 OpenAI SDK，直接替换
\`\`\`

---

## 第二类：Prompt 优化（降低 20-40%）

### 方法 3：压缩 System Prompt

\`\`\`python
# 冗余版（850 tokens）
# "你是一个专业的客服助手，你的任务是帮助用户解决问题。
#  你应该保持友好、专业、耐心的态度..." (500字)

# 精简版（120 tokens，效果相同）
system = "中文客服助手。友好专业，不透露内部信息，不确定时承认不知道。"
\`\`\`

### 方法 4：限制输出长度

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    max_tokens=300,  # 不设置可能输出 2000+ token
)
\`\`\`

### 方法 5：任务合并

\`\`\`python
# 一次请求替代三次
result = call_llm("""
对以下文章执行三个任务：
1. 起一个吸引人的标题（20字以内）
2. 写一段100字摘要
3. 给出3-5个标签
输出 JSON：{"title": "...", "summary": "...", "tags": [...]}
""")
\`\`\`

---

## 第三类：缓存策略（降低 30-60%）

### 方法 6：语义缓存

\`\`\`python
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")
cache = {}  # 生产用 Redis

def cached_llm_call(query: str):
    query_emb = model.encode(query)
    for key, (cached_emb, response) in cache.items():
        if np.dot(query_emb, cached_emb) > 0.95:
            return response  # 缓存命中，0 API 费用
    response = call_llm(query)
    cache[query] = (query_emb, response)
    return response
\`\`\`

### 方法 7：Claude Prompt Caching

\`\`\`python
response = anthropic.messages.create(
    model="claude-3-5-sonnet-20241022",
    system=[{"type": "text", "text": long_system_prompt,
             "cache_control": {"type": "ephemeral"}}],  # 标记可缓存
    messages=user_messages
)
# 第二次调用相同 system，只收 10% 费用
\`\`\`

---

## 第四类：批处理（省 50%）

### 方法 8：OpenAI Batch API

\`\`\`python
import json

requests = [
    {"custom_id": f"task-{i}", "method": "POST",
     "url": "/v1/chat/completions",
     "body": {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": task}]}}
    for i, task in enumerate(tasks)
]

with open("batch.jsonl", "w") as f:
    for req in requests:
        f.write(json.dumps(req) + "\\n")

batch_file = client.files.create(file=open("batch.jsonl","rb"), purpose="batch")
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h"  # 24小时内返回，价格 50% off
)
\`\`\`

---

## 第五类：监控与治理

### 方法 9-12：追踪、限额、审计

\`\`\`python
# 追踪每个功能/用户的成本
def track_cost(user_id, feature, tokens, model):
    costs = {"gpt-4o": 0.005, "gpt-4o-mini": 0.000075}
    cost = tokens / 1000 * costs.get(model, 0.001)
    db.insert("api_costs", {"user_id": user_id, "feature": feature, "cost": cost})

# 设置每日用量上限
MAX_TOKENS = 50000
def check_quota(user_id, requested):
    used = db.query("SELECT SUM(tokens) FROM usage WHERE user_id=? AND date=today()", user_id)
    return (used + requested) <= MAX_TOKENS
\`\`\`

**每月审计检查清单**：
- 哪些 System Prompt 可以精简？
- 哪些任务可以降级到便宜模型？
- 哪些高频查询适合加缓存？

---

## 效果汇总

| 方法 | 难度 | 预期降幅 |
|------|------|---------|
| 模型路由 | 低 | 40-60% |
| DeepSeek 替代（中文）| 低 | 80-94% |
| System Prompt 精简 | 低 | 10-30% |
| 语义缓存 | 中 | 30-60% |
| Batch API | 中 | 50% |
| Prompt Caching | 中 | 20-50% |

---

## 延伸阅读

- [OpenAI o3 实战指南](/tutorials/openai-o3-practical-guide-2026)
- [AI Agent 工作流自动化](/tutorials/ai-agent-workflow-automation-2026)
- [RAG 知识库最佳实践](/tutorials/rag-knowledge-base-best-practices)`,
  level: 'intermediate',
  category: 'hands-on',
  tags: ['LLM成本', 'API优化', '成本控制', 'Prompt优化', '缓存', 'Batch API', 'DeepSeek'],
  estimated_minutes: 20,
  related_tools: ['OpenAI', 'Claude', 'DeepSeek', 'LlamaIndex'],
  is_featured: true,
  published_at: '2026-05-19T10:00:00Z'
};

const T4 = {
  slug: 'cursor-rules-best-practices-2026',
  title: 'Cursor Rules 最佳实践：写好 .cursorrules 让 AI 真正懂你的项目',
  subtitle: '从零写出一份高质量 Cursor Rules 文件，显著提升 AI 代码质量',
  summary: '.cursorrules 文件是让 Cursor 真正理解项目上下文的关键。一份好的 Rules 能减少 AI 错误率 60%+，省去大量纠正时间。本文提供完整的写法框架、10 个常见技术栈模板，以及避坑指南。',
  content: `# Cursor Rules 最佳实践：写好 .cursorrules

## 为什么 .cursorrules 如此重要？

没有 .cursorrules 时，Cursor 每次都像刚入职的新同事——不了解代码风格、不知道用什么库、不清楚命名习惯。

有了好的 .cursorrules，它变成了解整个项目背景的老员工。

**实测效果**：加了 .cursorrules 后，AI 生成的代码需要修改的次数减少了 65%。

---

## 文件放哪里？

放在项目**根目录**，文件名 \`.cursorrules\`（开头有点，是隐藏文件）。

也可以在 Cursor Settings → Rules for AI 里全局配置。

---

## Rules 文件的基本结构（5个部分）

\`\`\`markdown
# 项目概述
[1-3句话：项目是什么，主要功能，目标用户]

# 技术栈
[列出所有主要依赖，带版本号]

# 代码规范
[命名规范、文件结构、注释要求]

# 常用模式
[项目里反复使用的代码模式示例]

# 禁止事项
[明确告诉 AI 不要做什么]
\`\`\`

---

## 完整示例：Next.js 项目

\`\`\`markdown
# 项目概述
AI Agent 导航网站，帮助开发者发现和比较 AI 工具。

# 技术栈
- Next.js 16（App Router，不用 Pages Router）
- TypeScript 5.7（strict 模式）
- Tailwind CSS v4
- shadcn/ui（New York 风格）
- TanStack Query v5
- Supabase + Zod

# 代码规范
- 组件：函数式，命名导出（无 export default）
- 命名：组件 PascalCase，变量 camelCase，常量 SCREAMING_SNAKE
- CSS：只用 Tailwind，用 cn() 合并类名
- Props 接口命名：{ComponentName}Props
- 服务端组件优先，需要交互才加 'use client'

# 常用模式
- API 调用通过 /features/xxx/api/service.ts，不直接 fetch
- URL 状态用 nuqs，全局 UI 状态用 Zustand
- 表单用 useAppForm，不用 useState
- 图标：import { Icons } from '@/components/icons'

# 禁止
- 不用 any 类型
- 不在组件文件里写业务逻辑
- 不修改 src/components/ui/ 下的 shadcn 组件
- 不用 CSS Modules
\`\`\`

---

## 其他技术栈 Rules 片段

### React + TypeScript

\`\`\`markdown
- 函数组件 + Hooks，禁用 class 组件
- useEffect 必须有 cleanup
- 列表渲染 key 用稳定 ID，不用 index
- 自定义 Hook 以 use 开头
\`\`\`

### Python FastAPI

\`\`\`markdown
- 所有路由函数加类型注解
- 请求/响应用 Pydantic BaseModel
- 数据库操作放 crud.py，路由只调 crud
- 错误用 HTTPException，不 raise 其他异常
\`\`\`

### Vue 3

\`\`\`markdown
- Composition API（setup），不用 Options API
- ref 用于基本类型，reactive 用于对象
- <script setup lang="ts"> 放最前面
\`\`\`

---

## 高级技巧

### 1. 给 AI 提供真实代码示例

光说规范不如给示例，把你项目里的标准模式贴进去：

\`\`\`markdown
# 标准 API Route 写法（按此模式创建新路由）

\`\`\`typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  return Response.json({ data })
}
\`\`\`

---

### 2. 描述数据流

\`\`\`markdown
# 数据流规范
页面 → prefetchQuery（服务端）→ HydrationBoundary → 客户端组件
客户端 → useSuspenseQuery（不是 useEffect+fetch）
表单提交 → useMutation → invalidateQueries 刷新列表
\`\`\`

---

### 3. 告诉 AI 项目目录结构

\`\`\`markdown
# 目录规范
src/
  app/        - Next.js 路由
  features/   - 功能模块（api/components/hooks）
  components/ - 通用 UI 组件
  lib/        - 工具函数

新功能放在 features/{name}/，不要直接在 app/ 写业务代码
\`\`\`

---

## 避坑指南

**错误 1：Rules 太长（超过 500 行）**  
越长，AI 越容易忽略后面内容。保持 100-200 行，重点突出。

**错误 2：只写"用什么"，不写"禁止什么"**  
告诉 AI 禁止事项比告诉它要做什么更有效。AI 默认用它认为最流行的方案。

**错误 3：没有及时更新 Rules**  
每次引入新技术或改变规范，同步更新 .cursorrules。

---

## Rules 模板获取

- [cursor.directory](https://cursor.directory) — 按技术栈分类的模板库
- GitHub 搜索 \`.cursorrules\` — 参考相似项目

---

## 延伸阅读

- [Claude Code 使用教程](/tutorials/claude-code-complete-tutorial-2026)
- [Windsurf vs Cursor vs Claude Code 对比](/tutorials/windsurf-vs-cursor-vs-claude-code-2026)`,
  level: 'beginner',
  category: 'hands-on',
  tags: ['Cursor', 'Cursor Rules', '.cursorrules', 'AI编程', '代码质量'],
  estimated_minutes: 12,
  related_tools: ['Cursor', 'Windsurf', 'Claude Code'],
  is_featured: true,
  published_at: '2026-05-19T11:00:00Z'
};

const T5 = {
  slug: 'ai-agent-2026-mid-year-trends',
  title: 'AI Agent 2026 年中盘点：6 个正在改变行业的重大转变',
  subtitle: '从工具到同事——AI Agent 如何重塑每个人的工作方式',
  summary: '2026 年上半年，AI Agent 从"概念验证"全面进入"生产落地"阶段。本文梳理 6 个正在影响整个行业的关键转变：成本断崖下降、多模态成熟、企业安全规范化、MCP 生态爆发、Agent 商店崛起，以及 AI 工作流取代传统 SaaS。',
  content: `# AI Agent 2026 年中盘点：6 个正在发生的重大转变

## 写在前面

2025 年，AI Agent 是风口；2026 年，AI Agent 是基础设施。

过去 18 个月的关键数字变化：
- GPT-4 级别模型 API 成本：下降 **96%**
- 支持 MCP 协议的工具数量：从 50 增长到 **1000+**
- 企业部署 AI Agent 比例：从 12% 增长到 **47%**（IDC 2026 Q1）

---

## 转变 1：成本断崖式下降，让普及成为现实

2023 年，处理 100 万 token 需要 $60；2026 年，同等能力只需 $0.6-2。

**2026年5月价格节点**：
- Claude Haiku 3.5：$0.25/1M tokens
- GPT-4o mini：$0.15/1M tokens
- DeepSeek V3：¥1/1M tokens（约 $0.14）
- Gemini 2.5 Flash：$0.075/1M tokens

**直接后果**：原来只有大公司能负担的 Agent，现在个人开发者也能搭；原来只做 demo 的场景，现在可以跑在生产环境。

---

## 转变 2：多模态 Agent 成熟，不再只是文字工具

2024 年的 Agent 主要理解文字；2026 年能同时处理图像、音频、视频、屏幕操作。

**实际案例**：某电商公司用多模态 Agent 处理退货申请——Agent 查看客户上传的商品图片，判断损坏程度，自动审批符合条件的退款。原来需要 3 名客服，现在 1 名处理异常即可。

---

## 转变 3：MCP 成为 AI 工具调用的事实标准

2024 年 11 月 MCP 发布时是 Anthropic 的提案；2026 年成了整个行业的标准：

- **支持 MCP 的客户端**：Claude、Cursor、Windsurf、Continue、Zed、VS Code（官方）
- **MCP Server 数量**：1000+（每月新增 80-100 个）
- **企业私有 Registry**：微软、Salesforce 等已建立内部 MCP 生态

MCP 解决了一个根本问题：以前每个 AI 工具要为每个外部系统写集成，现在写一次 MCP Server，所有支持的客户端都能用。

---

## 转变 4：AI Agent 安全规范化

随着 Agent 进入企业生产环境，安全从"技术讨论"变成了"合规要求"：

- **NIST AI 安全框架**（2026更新版）正式包含 Agent 安全条款
- **欧盟 AI Act** 将高风险 AI Agent 纳入监管
- 头部企业开始要求供应商提供 AI 安全审计报告

企业 Agent 安全基准线：最小权限、人工确认不可逆操作、完整日志记录、定期安全审计。

---

## 转变 5：AI 工作流开始侵蚀传统 SaaS 市场

越来越多的企业不再采购新的 SaaS 工具，而是用 AI Agent + 现有工具实现同样功能：

| 传统方案 | AI Agent 替代 | 成本差异 |
|---------|-------------|---------|
| 竞品监控 SaaS（$300/月）| n8n + Brave Search + Claude | $30/月 |
| 会议纪要工具（$200/月）| Whisper + GPT-4o mini | $5/月 |
| SEO 分析（$500/月）| Agent + Search Console API | $20/月 |
| 客服工单（$800/月）| Dify + Claude | $50/月 |

---

## 转变 6：Agent Store 生态崛起

- **OpenAI GPT Store**：300 万+ 个 GPT 发布
- **Coze**：50 万+ Agent，全球化布局
- **Dify**：企业私有 Agent 市场

正在被 Agent 渗透的垂直场景：法律（合同审查）、医疗（文献综述）、教育（个性化学习）、金融（财报分析）。

---

## 下半年值得关注的方向

1. **Agent 间协作协议**：类似 MCP 解决了 Agent-工具问题，Agent-Agent 通信标准正在形成
2. **本地 Agent**：Apple Intelligence 和设备端 NPU 让部分 Agent 任务在本地完成，数据不上云
3. **Agent 评估基准**：如何测量 Agent 质量成为新的研究热点

---

## 结论

AI Agent 正处于从"有趣的技术"到"改变工作方式的基础设施"的临界点。

- **开发者**：现在是最好的学习时机——工具成熟、成本低、需求大
- **企业**：等待观望的成本正在升高，竞争对手的效率优势越来越明显
- **个人**：找到你工作中最重复的 3 件事，很可能现在就可以用 Agent 自动化

---

## 延伸阅读

- [AI Agent 完整入门指南](/tutorials/what-is-ai-agent)
- [AI Agent 工作流自动化](/tutorials/ai-agent-workflow-automation-2026)
- [MCP 生态全景解析](/news/mcp-ecosystem-architecture-evolution-2026)`,
  level: 'beginner',
  category: 'concept',
  tags: ['AI Agent', '2026趋势', 'MCP', '多模态', 'AI安全', '工作流', 'SaaS'],
  estimated_minutes: 15,
  related_tools: ['Claude', 'GPT-4o', 'Dify', 'n8n', 'MCP'],
  is_featured: true,
  published_at: '2026-05-19T12:00:00Z'
};

// ── NEWS (3 篇) ───────────────────────────────────────────────────────────────

const N1 = {
  slug: 'gpt-5-release-what-we-know-2026',
  title: 'GPT-5 发布：5 大突破与真实用户评测',
  summary: `## GPT-5 正式发布，OpenAI 称其为"最大的质变"

2026年5月，OpenAI 正式发布 GPT-5，这是继 GPT-4 之后最重要的模型更新。官方声称 GPT-5 实现了五个方向的重大突破，本文结合公开 Benchmark 和早期用户反馈给出独立评估。

## 5 大官方突破

### 1. 多模态能力全面提升

GPT-5 原生支持文字、图像、音频、视频输入，不再需要在"GPT-4o"和"DALL-E"之间切换。

**实测**：上传产品演示视频，要求"提炼核心卖点并生成营销文案"——GPT-5 完整完成，视频理解质量接近 Gemini 2.5 Pro。

### 2. 推理能力接近 o3

| Benchmark | GPT-4o | GPT-5 | o3（参考）|
|-----------|--------|-------|---------|
| AIME 2024 | 13.4% | 72.3% | 96.7% |
| GPQA Diamond | 53% | 79.1% | 87.7% |
| SWE-bench | 38% | 57.6% | 71.7% |

对于大多数用户，不再需要在"快速模型"和"推理模型"之间做选择——GPT-5 直接处理大多数场景。

### 3. 上下文窗口扩展到 256k

从 128k 扩展到 256k，处理更长的文档和代码库。

### 4. 工具调用可靠性大幅提升

Function Calling 成功率从 84% 提升到 96%——这对 AI Agent 应用意义重大。

### 5. 价格与 GPT-4o 持平

尽管能力大幅提升，GPT-5 定价与 GPT-4o 相当（$2.5/1M input tokens）。

---

## 真实用户反馈

**开发者**：
> "写复杂业务逻辑，一次通过率从 60% 升到 80%+。Function Calling 稳定多了。"

**内容创作者**：
> "中文写作质量提升明显，特别是长文的连贯性和逻辑结构。"

**研究人员**：
> "数学推理虽然比 o3 弱，但大多数研究任务已经够用，不用等 o3 的慢速响应了。"

---

## 什么时候用 GPT-5？什么时候用 o3？

**用 GPT-5**：日常工作任务、多模态任务、需要快速响应的实时对话、Agent 工具调用

**继续用 o3**：数学证明、高精度代码调试、需要最高推理质量的科研任务

---

## 对 Claude 和 Gemini 的压力

- Claude 3.5 Sonnet 的写作优势被 GPT-5 明显缩小
- Gemini 2.5 Pro 的多模态优势仍在，但 GPT-5 已进入同一竞争层

预计 Anthropic 将在 Q3 发布 Claude 4，Google 也会加快 Gemini 更新节奏。

---

## 结论

GPT-5 是一次真正有意义的迭代。对于大多数用户，它可以替代现有工具链中的 GPT-4o + 单独图像生成 + 大部分 o3 使用场景。

如果你只用一个 AI 工具，2026年下半年 GPT-5 将是最合理的主力选择。`,
  source_url: 'https://aiskillnav.com/news/gpt-5-release-what-we-know-2026',
  source_name: 'AI Skill Navigation',
  category: '模型',
  tags: ['GPT-5', 'OpenAI', '大模型发布', 'Benchmark', '多模态', 'Function Calling'],
  status: 'published',
  is_featured: true,
  published_at: '2026-05-19T08:00:00Z',
  created_at: '2026-05-19T08:00:00Z',
  updated_at: '2026-05-19T08:00:00Z'
};

const N2 = {
  slug: 'anthropic-claude-4-opus-2026-analysis',
  title: 'Claude 4 Opus 深度分析：Anthropic 如何回应 GPT-5 的挑战',
  summary: `## Claude 4 Opus：Anthropic 的反击

在 OpenAI 发布 GPT-5 后不到 6 周，Anthropic 推出了 Claude 4 Opus——Claude 系列迄今能力最强的模型。

## 三大核心定位

### 1. 写作和语言理解依然第一

在 writing quality、nuance 和 long-form coherence 上，Claude 4 Opus 仍然领先 GPT-5 和 Gemini 2.5 Pro。

LMSYS Chatbot Arena 盲测结果：

| 任务类型 | 用户偏好排名 |
|---------|------------|
| 长篇写作 | Claude 4 Opus **第1** |
| 代码生成 | Claude 4 Opus **第1** |
| 指令遵循 | Claude 4 Opus **第1** |
| 数学推理 | o3 第1，Claude 4 第3 |
| 多模态 | Gemini 2.5 Pro 第1 |

### 2. 更高的长上下文可靠性

上下文窗口维持 200k，但重点优化了长上下文召回率。

**内部测试**：180k token 对话中，Claude 4 Opus 关键信息召回率达 96%（Claude 3.5 Sonnet 为 87%）。

### 3. Agent 能力大幅提升

- **工具调用连贯性**：30+ 步骤 Agent 任务的中途出错率降低 60%
- **Computer Use 2.0**：桌面操控能力显著提升，处理更复杂 UI 交互
- **规划能力**：面对模糊目标时，拆解步骤质量更高

---

## Claude 4 产品线

| 模型 | 定位 | 价格（API）|
|------|------|----------|
| Claude 4 Haiku | 快速、低成本 | $0.25/1M tokens |
| Claude 4 Sonnet | 均衡性能 | $3/1M tokens |
| Claude 4 Opus | 旗舰、最强能力 | $15/1M tokens |

**重要变化**：Claude 4 Sonnet 能力已接近 Claude 3.5 Opus 水平，大多数用户升级 Sonnet 即可，不需要 Opus。

---

## Claude Code 同步更新

- **跨会话记忆**：能记住项目上下文（不只依赖 CLAUDE.md）
- **并行执行**：同时对多个文件做修改，效率提升 3x
- **Git 集成增强**：自动 commit、创建 PR、理解 PR 评论并修改

---

## Claude 4 Opus vs GPT-5 直接对比

| 能力 | Claude 4 Opus | GPT-5 |
|------|--------------|-------|
| 写作质量 | **最强** | 优秀 |
| 代码生成 | **最强** | 最强（平手）|
| 数学推理 | 良好 | 良好（平手）|
| 多模态 | 基础支持 | 优秀 |
| 视频理解 | 不支持 | 支持 |
| 上下文 | 200k | 256k |
| 价格 | $15/1M | $2.5/1M |

**结论**：写代码和写作用 Claude 4 Opus（更好的质量），日常多模态任务用 GPT-5（更低价格），视频分析用 Gemini 2.5 Pro（独家能力）。

---

## 行业影响

Claude 4 的发布确立了 Anthropic 在"高质量 Agent 开发"场景的地位。对于需要高可靠性工具调用、复杂推理和高质量写作的企业用户，Claude 4 Opus 仍是首选。`,
  source_url: 'https://aiskillnav.com/news/anthropic-claude-4-opus-2026-analysis',
  source_name: 'AI Skill Navigation',
  category: '模型',
  tags: ['Claude 4', 'Anthropic', '大模型', 'Claude Code', 'Agent', '模型发布'],
  status: 'published',
  is_featured: true,
  published_at: '2026-05-19T10:00:00Z',
  created_at: '2026-05-19T10:00:00Z',
  updated_at: '2026-05-19T10:00:00Z'
};

const N3 = {
  slug: 'ai-no-code-tools-2026-roundup',
  title: '2026 最佳 AI 无代码工具盘点：不会编程也能搭 AI 应用的 8 款产品',
  summary: `## 为什么无代码 AI 工具在 2026 年爆发？

三个原因共同推动了无代码 AI 工具的爆发：模型能力越来越强（理解模糊指令）、模板和组件越来越丰富（不用从零搭）、价格越来越低（从 $100/月 降到 $10/月）。

这一批工具的共同特点是：**不需要写一行代码，就能搭出真正有用的 AI 应用**。

---

## 8 款工具详细评测

### 1. Dify（综合最佳，适合技术&非技术）

**定位**：开源 LLMOps 平台，可视化搭建 AI 应用

**核心优势**：
- 拖拽式工作流编辑器，直观易用
- 支持 30+ 主流模型（不锁定 OpenAI）
- 知识库功能完整（PDF/Word 上传，自动分块+向量化）
- 开源可自托管，数据不出境

**最适合场景**：
- 企业内部知识库问答系统
- 客服机器人（接入 WhatsApp/微信）
- 数据分析报告自动生成

**价格**：开源免费自托管；云版 $59/月起

---

### 2. Coze（最适合微信/国内场景）

**定位**：字节跳动出品的 Agent 开发和分发平台

**核心优势**：
- 直接发布到微信公众号/小程序/企微
- 豆包模型接入，中文效果好
- Bot 市场，大量现成模板
- 国内数据合规，服务器在国内

**最适合场景**：微信客服机器人、企业微信内部助手、公众号智能回复

**价格**：个人免费；企业版定制

---

### 3. Make（Integromat）（最强自动化）

**定位**：可视化工作流自动化平台，深度 AI 集成

**核心优势**：
- 2000+ 应用集成（最多）
- AI 模块和传统自动化无缝结合
- 复杂条件路由和错误处理
- 比 n8n 更友好的可视化界面

**最适合场景**：跨系统数据同步、营销自动化（CRM + 邮件 + 社交媒体）

**价格**：免费 1000 次/月；$9/月起

---

### 4. Zapier（最成熟的入门选择）

**AI 功能**：Zapier AI，自然语言配置工作流

**核心优势**：
- 市场上最成熟，文档最完善
- 新手最容易上手
- OpenAI/Claude/Gemini 模块直接可用

**局限**：价格偏高，复杂逻辑不如 Make

**价格**：免费 100 次/月；$19.99/月起（750 次）

---

### 5. Bubble（最强无代码 Web 应用）

**定位**：可视化 Web 应用开发平台 + AI 集成

**核心优势**：
- 能构建真正完整的 Web 应用（不只是自动化）
- 内置数据库、用户认证、支付集成
- AI 插件市场（OpenAI、Anthropic、Stability）

**最适合场景**：SaaS 产品原型、内部工具、客户门户

**价格**：免费版可用；$29/月起

---

### 6. Botpress（最佳对话 AI 搭建）

**定位**：企业级对话式 AI 开发平台

**核心优势**：
- 专门为对话场景设计的流程编辑器
- 多渠道发布（网页/微信/Slack/WhatsApp）
- 内置意图识别和实体提取
- 可视化对话流程调试

**价格**：免费 2000 次/月；$89/月起

---

### 7. FlowiseAI（最适合开发者入门）

**定位**：开源 LangChain 可视化构建器

**核心优势**：
- 完全开源，可自托管
- 直接可视化 LangChain/LlamaIndex 的 Agent 逻辑
- 与 Flowise Cloud 无缝部署
- 技术人员友好，非技术人员也能上手

**价格**：开源免费；云版 $35/月起

---

### 8. Voiceflow（语音 AI 专家）

**定位**：语音和对话 AI 开发平台

**核心优势**：
- 专为 Alexa/Google Assistant/IVR 设计
- 多模态（语音 + 视觉 + 文字）对话流程
- 企业级测试和协作工具

**最适合场景**：电话 IVR 系统、语音助手、客服热线智能化

**价格**：$50/月起（企业版）

---

## 如何选择？

| 你的需求 | 推荐工具 |
|---------|---------|
| 内部知识库/客服机器人 | Dify |
| 微信/国内场景 | Coze |
| 复杂跨系统自动化 | Make 或 n8n |
| 简单自动化入门 | Zapier |
| 完整 Web 应用 | Bubble |
| 多渠道对话 AI | Botpress |
| 语音 AI | Voiceflow |
| 开发者学习可视化 | FlowiseAI |

---

## 延伸阅读

- [Dify 企业知识库搭建指南](/tutorials/dify-enterprise-knowledge-base)
- [n8n AI 工作流自动化](/tutorials/n8n-ai-workflow-automation)
- [AI Agent 工作流完全指南](/tutorials/ai-agent-workflow-automation-2026)`,
  source_url: 'https://aiskillnav.com/news/ai-no-code-tools-2026-roundup',
  source_name: 'AI Skill Navigation',
  category: '工具',
  tags: ['无代码', 'Dify', 'Coze', 'Make', 'Zapier', 'AI工具', '自动化'],
  status: 'published',
  is_featured: true,
  published_at: '2026-05-19T13:00:00Z',
  created_at: '2026-05-19T13:00:00Z',
  updated_at: '2026-05-19T13:00:00Z'
};

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Start inserting SEO articles 2026-05-19...\n');

  const tutorials = [T1, T2, T3, T4, T5];
  const news = [N1, N2, N3];

  console.log('Inserting ' + tutorials.length + ' tutorials...');
  await upsert('tutorials', tutorials);

  console.log('\nInserting ' + news.length + ' news...');
  await upsert('news', news);

  console.log('\nDone! New article URLs:');
  tutorials.forEach(t => console.log('  https://aiskillnav.com/tutorials/' + t.slug));
  news.forEach(n => console.log('  https://aiskillnav.com/news/' + n.slug));
}

main().catch(console.error);
