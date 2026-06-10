/** 把名称转成 URL slug：小写、非字母/数字段转连字符、去首尾连字符。
 *  用 Unicode 字母/数字类（\p{L}\p{N}），保留中文等非 ASCII 名称，
 *  避免纯中文名被整段清空成空 slug（导致链接退化为 /agents/）。 */
export function slugify(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
