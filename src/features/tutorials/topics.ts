// 主题集群（pillar-cluster）清单：基于 tutorials slug/tags 词频分析归纳出的强聚类主题。
// 每个主题生成一个可索引的中心页 /tutorials/topic/{slug}，聚合该主题全部教程，
// 双向内链集中权重，帮助 Google 判定主题权威、提升 cluster 详情页的收录。
// matchTokens 用于在 tags / title 上做 DB 端过滤（见 getTutorialsByTopic）。

export type PillarTopic = {
  slug: string;
  title: string;
  description: string;
  matchTokens: string[];
};

export const PILLAR_TOPICS: PillarTopic[] = [
  {
    slug: 'rag',
    title: 'RAG 检索增强生成',
    description:
      '检索增强生成（RAG）从入门到生产：向量数据库选型、Embedding、分块与重排、多向量与混合检索，以及 Pinecone / Weaviate / Qdrant / pgvector 等实战。',
    matchTokens: ['rag', 'retrieval', 'vector', 'embedding', 'embeddings', 'pinecone', 'weaviate', 'qdrant', 'chroma', 'pgvector', 'milvus']
  },
  {
    slug: 'agent',
    title: 'AI Agent 与多智能体',
    description:
      'AI Agent 与多智能体系统：单体到层级化编排、工具调用、记忆与规划，以及 CrewAI / AutoGen 等多智能体框架的构建实战。',
    matchTokens: ['agent', 'agents', 'multi-agent', 'crewai', 'autogen', 'autonomous', 'react-agent']
  },
  {
    slug: 'model-deployment',
    title: '模型部署与生产化',
    description:
      '把大模型送上生产：推理服务、扩缩容、容器化与本地/云部署，涵盖 vLLM、Docker、Kubernetes 与成本优化的工程实践。',
    matchTokens: ['deploy', 'deployment', 'serving', 'inference', 'vllm', 'docker', 'kubernetes', 'scaling', 'production']
  },
  {
    slug: 'workflow',
    title: '工作流与自动化',
    description:
      '用 AI 编排自动化工作流：从 Pipeline 设计到 n8n 等低代码编排，把重复任务交给 Agent 与工作流引擎。',
    matchTokens: ['workflow', 'automation', 'pipeline', 'n8n', 'orchestration', 'zapier']
  },
  {
    slug: 'openai',
    title: 'OpenAI 开发实战',
    description:
      'OpenAI 平台开发：GPT 系列 API、函数调用、Assistants、Whisper 与多模态能力的集成与最佳实践。',
    matchTokens: ['openai', 'gpt', 'gpt-4', 'gpt-4o', 'whisper', 'dall-e', 'assistants']
  },
  {
    slug: 'claude',
    title: 'Claude / Anthropic 开发',
    description:
      'Claude 与 Anthropic 生态开发：Messages API、工具使用、长上下文与提示缓存等实战技巧。',
    matchTokens: ['claude', 'anthropic']
  },
  {
    slug: 'langchain',
    title: 'LangChain / LangGraph',
    description:
      'LangChain 与 LangGraph 框架：链式编排、LCEL、状态图 Agent、LangSmith 可观测的端到端实战。',
    matchTokens: ['langchain', 'langgraph', 'langsmith', 'lcel', 'llamaindex']
  },
  {
    slug: 'fine-tuning',
    title: '模型微调与训练',
    description:
      '模型微调与训练：LoRA / QLoRA、RLHF、量化与分布式训练，让模型贴合你的领域任务。',
    matchTokens: ['fine-tuning', 'finetuning', 'fine-tune', 'lora', 'qlora', 'rlhf', 'quantization', 'distillation']
  },
  {
    slug: 'prompt-engineering',
    title: 'Prompt 工程',
    description:
      'Prompt 工程系统方法：Few-shot、思维链（CoT）、结构化输出与提示优化，稳定提升模型表现。',
    matchTokens: ['prompt', 'prompting', 'few-shot', 'chain-of-thought', 'cot', 'reflexion', 'maieutic']
  },
  {
    slug: 'mcp',
    title: 'MCP（Model Context Protocol）',
    description:
      'Model Context Protocol（MCP）：协议原理、Server 开发、与 Function Calling 的对比，以及在 Cursor / Claude Desktop 中的接入。',
    matchTokens: ['mcp']
  },
  {
    slug: 'evaluation',
    title: '评估、测试与可观测',
    description:
      'LLM 应用的评估与可观测：基准测试、RAG 评估、Tracing 与监控、Guardrails，建立可量化的质量闭环。',
    matchTokens: ['eval', 'evaluation', 'benchmark', 'monitoring', 'tracing', 'observability', 'ragas', 'guardrail', 'guardrails']
  },
  {
    slug: 'security',
    title: 'AI 安全与合规',
    description:
      'AI 安全与合规：Prompt 注入防护、越狱防御、输入输出安全、数据脱敏与合规落地。',
    matchTokens: ['security', 'safety', 'prompt-injection', 'jailbreak', 'sanitization', 'anonymization', 'compliance']
  },
  {
    slug: 'api-integration',
    title: 'API 与集成开发',
    description:
      '把 AI 接入你的应用：API 集成、函数/工具调用、Webhook 与多语言/多框架（Next.js、Django、Vue 等）实战。',
    matchTokens: ['api', 'integration', 'function-calling', 'tool-calling', 'webhook', 'streaming', 'sdk']
  }
];

export function getPillarTopic(slug: string): PillarTopic | undefined {
  return PILLAR_TOPICS.find((t) => t.slug === slug);
}

/** 给定一篇内容的 tags + title，返回它命中的 pillar 主题（用于详情页"所属主题"回流链）。 */
export function matchPillarTopics(tags: string[], title: string, max = 3): PillarTopic[] {
  const hay = new Set<string>([
    ...(tags ?? []).map((t) => t.toLowerCase()),
    ...title.toLowerCase().split(/[^a-z0-9+]+/)
  ]);
  const lowerTitle = title.toLowerCase();
  return PILLAR_TOPICS.filter((topic) =>
    topic.matchTokens.some((tok) => hay.has(tok) || (tok.includes('-') && lowerTitle.includes(tok)))
  ).slice(0, max);
}
