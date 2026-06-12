/**
 * 从教程 Markdown 正文提取 FAQ 问答对，用于详情页输出 FAQPage JSON-LD。
 *
 * 支持站内两种 FAQ 写法（重写批次 E-J 的统一格式）：
 *   英文：## FAQ 后跟 "**Question?** Answer..."（粗体问题 + 同段答案）
 *   中文：## FAQ 后跟 "**Q：问题？**\n答案段" 或 "**Q：问题？** 答案"
 *
 * 说明：Google 自 2023 起仅对少数权威站展示 FAQ 富摘要，但 FAQPage 结构化数据
 * 仍有价值——AI 搜索（GEO）与解析器靠它精确抽取问答，成本为零。
 */
export type FaqPair = { question: string; answer: string };

/** 去掉 Markdown 标记，得到适合 JSON-LD 的纯文本 */
function stripMarkdown(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, '') // 代码块整体去掉（JSON-LD 里没意义）
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1') // 链接保留文字
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFaq(markdown: string): FaqPair[] {
  if (!markdown) return [];
  // 取 "## FAQ" / "## 常见问题" 到下一个 "## " 或文末分隔线之间的内容
  const m = markdown.match(/^##\s*(?:FAQ|常见问题)[^\n]*\n([\s\S]*?)(?=^##\s|^---\s*$|(?![\s\S]))/m);
  if (!m) return [];
  const section = m[1];

  const pairs: FaqPair[] = [];
  // 按"粗体开头的段落 = 新问题"切分
  const blocks = section.split(/\n{2,}/);
  let current: FaqPair | null = null;
  for (const block of blocks) {
    const b = block.trim();
    if (!b) continue;
    const qm = b.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
    if (qm) {
      if (current && current.answer) pairs.push(current);
      const question = stripMarkdown(qm[1])
        .replace(/^Q\s*[:：]\s*/i, '')
        .trim();
      current = { question, answer: stripMarkdown(qm[2]) };
    } else if (current) {
      // 问题后的后续段落并入答案
      const text = stripMarkdown(b);
      if (text) current.answer = current.answer ? `${current.answer} ${text}` : text;
    }
  }
  if (current && current.answer) pairs.push(current);

  // 质量门槛：问题要像问题、答案非空；至少 2 对才值得输出
  const valid = pairs.filter((p) => p.question.length >= 4 && p.answer.length >= 10);
  return valid.length >= 2 ? valid : [];
}

export function buildFaqJsonLd(pairs: FaqPair[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer }
    }))
  };
}
