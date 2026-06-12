/**
 * 审计 comparison 模板文：从 tutorials 表拉出所有 -vs- / comparison 模式的 slug，
 * 用于与 GSC 数据交叉，决定重写 vs noindex。见 [[templated-garbage-comparison-articles]]。
 * 只读查询。node scripts/audit-comparison-slugs-0612.mjs
 */
const URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const KEY = process.env.SUPABASE_SECRET_KEY;
if (!KEY) {
  console.error('需要环境变量 SUPABASE_SECRET_KEY');
  process.exit(1);
}
const H = { Authorization: 'Bearer ' + KEY, apikey: KEY };

let all = [];
let from = 0;
while (true) {
  const r = await fetch(
    `${URL}/rest/v1/tutorials?select=slug,title&or=(slug.like.*-vs-*,slug.like.*comparison*)&order=slug&offset=${from}&limit=1000`,
    { headers: H }
  );
  const rows = await r.json();
  if (!Array.isArray(rows)) {
    console.error(rows);
    process.exit(1);
  }
  all.push(...rows);
  if (rows.length < 1000) break;
  from += 1000;
}
console.log(JSON.stringify(all));
