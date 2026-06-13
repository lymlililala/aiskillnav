// 发布前质量闸门 —— 移植 final-quality-sweep-0612.mjs 的指纹 + 薄内容检测，
// 外加 FAQ 段校验。命中任一硬性问题 → 不过线（进草稿）。

// 已知劣质模板指纹（历史上被 noindex 的批量文特征），新内容绝不能命中
const KNOWN_FINGERPRINTS = [
  [/covers everything you need to know for production implementation/i, 'FP2-comprehensive'],
  [/This guide provides practical, production-ready implementations/i, 'FP3-productionready'],
  [/"""Handles /, 'FP4-handler'],
  [/cuts through the marketing|Bottom line upfront/i, 'FP1-comparison'],
  [/demonstrate_concept|\.replace\(\/-\/g/, 'BROKEN-code'],
  [/pip install (gpt|claude|gemini)-/i, 'FAKE-pip']
]

/** 极简 FAQ 对计数（对齐 src/features/tutorials/faq.ts 的判定：≥2 对，问≥4 字，答≥10 字） */
export function countFaqPairs(markdown) {
  if (!markdown) return 0
  const m = markdown.match(/^##\s*(?:FAQ|常见问题)[^\n]*\n([\s\S]*?)(?=^##\s|^---\s*$|(?![\s\S]))/m)
  if (!m) return 0
  const blocks = m[1].split(/\n{2,}/)
  const pairs = []
  let cur = null
  for (const block of blocks) {
    const b = block.trim()
    if (!b) continue
    const qm = b.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/)
    if (qm) {
      if (cur && cur.a) pairs.push(cur)
      cur = { q: qm[1].replace(/^Q\s*[:：]\s*/i, '').trim(), a: qm[2].trim() }
    } else if (cur) {
      cur.a = (cur.a ? cur.a + ' ' : '') + b
    }
  }
  if (cur && cur.a) pairs.push(cur)
  return pairs.filter(p => p.q.length >= 4 && p.a.length >= 10).length
}

/**
 * 检查一篇合成文是否达标。
 * @param {object} draft  { title, content, summary }
 * @param {object} [opts] { minChars=2500, requireFaq=true }
 * @returns {{ pass:boolean, reasons:string[], faqPairs:number, len:number }}
 */
export function checkQuality(draft, opts = {}) {
  const minChars = opts.minChars ?? 2500
  const requireFaq = opts.requireFaq ?? true
  const content = draft.content || ''
  const reasons = []

  if (content.length < minChars) reasons.push(`THIN:${content.length}<${minChars}`)
  for (const [re, name] of KNOWN_FINGERPRINTS) if (re.test(content)) reasons.push(`FINGERPRINT:${name}`)

  const faqPairs = countFaqPairs(content)
  if (requireFaq && faqPairs < 2) reasons.push(`FAQ:${faqPairs}<2`)

  if (!draft.title || draft.title.length < 6) reasons.push('TITLE:too-short')
  if (!draft.summary || draft.summary.length < 20) reasons.push('SUMMARY:too-short')

  // 中文正文里混入大量英文套话也可疑：正文应以中文为主
  const cjk = (content.match(/[一-龥]/g) || []).length
  if (cjk < content.length * 0.2) reasons.push('LOW-CJK:疑似非中文正文')

  return { pass: reasons.length === 0, reasons, faqPairs, len: content.length }
}
