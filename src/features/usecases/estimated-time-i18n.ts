// use_cases.estimated_time 是自由文本中文（如「30分钟」「2小时搭建」「1-2个月」
// 「1小时配置，之后每次提交自动运行」），英文站做轻量本地化：替换时间单位与常见动词。
// 非穷举翻译，目标是去中文 + 可读，覆盖绝大多数模式。

const REPLACEMENTS: [RegExp, string][] = [
  // 复合短语优先（前后留空格，避免与相邻词粘连）
  [/每次提交自动运行/g, ' auto-runs on each commit'],
  [/每周自动运行/g, ' auto-runs weekly'],
  [/长期自动运行/g, ' runs continuously'],
  [/自动运行/g, ' auto-runs'],
  [/初次搭建/g, ' initial setup'],
  [/搭建基础框架/g, ' to set up the base'],
  [/搭建/g, ' setup'],
  [/配置/g, ' config'],
  [/落地/g, ' to ship'],
  [/之后/g, ' then '],
  // 单位（紧贴数字，不加前导空格）
  [/个月/g, 'mo'],
  [/小时/g, 'h'],
  [/分钟/g, 'min'],
  [/周/g, 'wk'],
  [/月/g, 'mo'],
  [/天/g, 'd'],
  // 量词 / 连接词
  [/每次/g, ' per '],
  [/\/篇/g, '/article'],
  [/\/份合同/g, '/contract'],
  [/\/份/g, '/doc'],
  [/\/次会议/g, '/meeting'],
  [/\/次/g, '/run'],
  [/\/批次/g, '/batch'],
  [/，/g, ', '],
  [/（/g, ' ('],
  [/）/g, ')']
];

export function enEstimatedTime(raw?: string | null): string {
  if (!raw) return '';
  let s = String(raw);
  for (const [re, rep] of REPLACEMENTS) s = s.replace(re, rep);
  // 收尾：括号/逗号内侧空格规整 + 合并多余空格
  return s
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
