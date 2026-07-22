#!/usr/bin/env python3
# 只读扫描：当前"可索引"教程中的残留低质文
# 数据源：Supabase tutorials(published) + noindex-slugs.ts + 0711 人工标记
import re, json
from urllib.request import Request, urlopen

env = {}
for ln in open('.env.local'):
    m = re.match(r'^([A-Z_]+)="?([^"]*)"?$', ln.strip())
    if m: env[m[1]] = m[2]
BASE = env['NEXT_PUBLIC_SUPABASE_URL']; SK = env['SUPABASE_SERVICE_ROLE_KEY']
H = {'apikey': SK, 'Authorization': f'Bearer {SK}'}

# 1. 全部已发布教程
u = f"{BASE}/rest/v1/tutorials?select=slug,title,content&published_at=not.is.null"
pub = json.loads(urlopen(Request(u, headers=H)).read())

# 2. 已 noindex 名单
txt = open('src/features/tutorials/noindex-slugs.ts').read()
noindexed = set(re.findall(r"'([^']+)'", txt))

# 3. 0711 人工标记（B 队列 26 篇 ∪ surviving-flagged 33 篇）
flagged = json.load(open('gsc/surviving-flagged-20260711.json'))

FAKE_PAT = re.compile(
    r'replace\(/\-/g|class [A-Z][a-zA-Z]*Tutorial|init_\w+_api\(|preprocess\(\)|call_service\(\)'
    r'|pip install \w+-api\b|占位|TODO: 实现|示例输出略',
)

indexable = [r for r in pub if r['slug'] not in noindexed]
print(f"已发布 {len(pub)}，已 noindex {len(pub)-len(indexable)}，当前可索引 {len(indexable)}")

hits = {'人工标记': [], '过短(<2500字)': [], '假代码指纹': []}
for r in indexable:
    c = r.get('content') or ''
    if r['slug'] in flagged:
        hits['人工标记'].append((r['slug'], ','.join(flagged[r['slug']]['signals']), len(c)))
    elif len(c) < 2500:
        hits['过短(<2500字)'].append((r['slug'], '', len(c)))
    elif FAKE_PAT.search(c):
        hits['假代码指纹'].append((r['slug'], '', len(c)))

total = 0
for k, v in hits.items():
    print(f"\n## {k}: {len(v)}")
    for slug, sig, ln in sorted(v, key=lambda x: x[2]):
        print(f"  {ln:>6}  {slug}  {sig}")
    total += len(v)
print(f"\n合计命中 {total} 篇（可索引剩余 {len(indexable)-total}）")
