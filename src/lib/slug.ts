/** 把名称转成 URL slug：小写、非 a-z0-9 段转连字符、去首尾连字符。 */
export function slugify(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
