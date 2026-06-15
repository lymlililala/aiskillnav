// AI 模型系列定义：按 name 前缀把模型归入厂商系列，用于「按系列分组」与「系列对比页」。
// 不改 DB schema，纯应用层推断（系列固定约 10 个）。

export type ModelSeries = {
  slug: string;
  label: string;
  labelEn: string;
  vendor: string;
  match: RegExp;
  description: string;
  descriptionEn: string;
};

export const MODEL_SERIES: ModelSeries[] = [
  {
    slug: 'claude', label: 'Claude', labelEn: 'Claude', vendor: 'Anthropic', match: /^claude/i,
    description: 'Anthropic Claude 系列：Opus 主打最强推理与长周期 Agentic 编码，Sonnet 速度与智能均衡，Haiku 极速近前沿。',
    descriptionEn: "Anthropic's Claude family: Opus for top-tier reasoning and long-horizon agentic coding, Sonnet balancing speed and intelligence, Haiku for near-frontier speed."
  },
  {
    slug: 'gpt', label: 'GPT / OpenAI', labelEn: 'GPT / OpenAI', vendor: 'OpenAI', match: /^(gpt|o\d|chatgpt)/i,
    description: 'OpenAI GPT 与 o 系列：GPT 为通用旗舰，o 系列专注深度推理，生态最完善。',
    descriptionEn: "OpenAI's GPT and o-series: GPT as the general flagship, the o-series focused on deep reasoning, with the most mature ecosystem."
  },
  {
    slug: 'gemini', label: 'Gemini', labelEn: 'Gemini', vendor: 'Google', match: /^gemini/i,
    description: 'Google Gemini 系列：Pro 旗舰、Flash 快速款，超长上下文与原生多模态、工具调用。',
    descriptionEn: "Google's Gemini family: Pro flagship and Flash speed tier, with very long context, native multimodality and tool calling."
  },
  {
    slug: 'deepseek', label: 'DeepSeek', labelEn: 'DeepSeek', vendor: 'DeepSeek', match: /^deepseek/i,
    description: 'DeepSeek 系列：国产开源、高性价比，V 系列通用、R 系列专注推理，价格仅为闭源旗舰的零头。',
    descriptionEn: 'DeepSeek family: open-source and highly cost-effective — the V-series for general use, the R-series for reasoning, at a fraction of closed-flagship pricing.'
  },
  {
    slug: 'llama', label: 'Llama', labelEn: 'Llama', vendor: 'Meta', match: /^llama/i,
    description: 'Meta Llama 系列：开源可自托管、商业友好，覆盖多种参数规模与超长上下文。',
    descriptionEn: "Meta's Llama family: open-source, self-hostable and commercially friendly, spanning many parameter sizes and long context."
  },
  {
    slug: 'qwen', label: 'Qwen 通义千问', labelEn: 'Qwen', vendor: 'Alibaba', match: /^qwen/i,
    description: '阿里通义千问系列：开源、多尺寸、价格极低，含代码与推理专项模型。',
    descriptionEn: "Alibaba's Qwen family: open-source, many sizes and very low pricing, including dedicated code and reasoning models."
  },
  {
    slug: 'glm', label: 'GLM 智谱', labelEn: 'GLM (Zhipu)', vendor: 'Zhipu', match: /^glm/i,
    description: '智谱 GLM 系列：国产开源，长上下文，综合能力对标主流闭源旗舰。',
    descriptionEn: "Zhipu's GLM family: open-source with long context and overall capability rivaling mainstream closed flagships."
  },
  {
    slug: 'kimi', label: 'Kimi', labelEn: 'Kimi', vendor: 'Moonshot', match: /^kimi/i,
    description: 'Moonshot Kimi 系列：超长上下文，在开源权重模型中排名靠前。',
    descriptionEn: "Moonshot's Kimi family: very long context, ranking among the top open-weight models."
  },
  {
    slug: 'step', label: 'Step 阶跃星辰', labelEn: 'Step (StepFun)', vendor: 'StepFun', match: /^step/i,
    description: '阶跃星辰 Step 系列：主打多模态与超大参数规模模型。',
    descriptionEn: "StepFun's Step family: focused on multimodality and very large-scale models."
  },
  {
    slug: 'mistral', label: 'Mistral', labelEn: 'Mistral', vendor: 'Mistral', match: /^(mistral|mixtral|codestral|magistral)/i,
    description: 'Mistral 系列：欧洲开源旗舰，MoE 架构，效率与开放并重。',
    descriptionEn: "Mistral family: Europe's open-source flagship, MoE architecture balancing efficiency and openness."
  }
];

/** 按模型 name 推断所属系列。 */
export function getModelSeries(name: string): ModelSeries | undefined {
  return MODEL_SERIES.find((s) => s.match.test(name ?? ''));
}

export function getModelSeriesBySlug(slug: string): ModelSeries | undefined {
  return MODEL_SERIES.find((s) => s.slug === slug);
}
