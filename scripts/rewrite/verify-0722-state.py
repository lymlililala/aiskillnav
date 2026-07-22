#!/usr/bin/env python3
# 只读核查：0722 报告声称已处理的文章，线上真实状态如何
import re, json, sys
from urllib.request import Request, urlopen

env = {}
for ln in open('.env.local'):
    m = re.match(r'^([A-Z_]+)="?([^"]*)"?$', ln.strip())
    if m: env[m[1]] = m[2]
BASE = env['NEXT_PUBLIC_SUPABASE_URL']; SK = env['SUPABASE_SERVICE_ROLE_KEY']
H = {'apikey': SK, 'Authorization': f'Bearer {SK}'}

SLUGS = [
    'groq-api-developer-guide-and-quick-start-2026-pv6asd',
    'llm-api-cost-optimization-guide-2026',
    'voice-activity-detection-python-guide-2026',
    'llm-fallback-strategy-production-2026',
    'notion-ai-knowledge-management-team-workflow',
    'ai-cloud-cost-optimization-strategies',
    'ai-clinical-documentation-ambient-scribes-2026',
    'enterprise-generative-ai-adoption-playbook-2026',
    'ai-credit-risk-management-guide-2026',
    'ai-data-loss-prevention-dlp-guide-2026',
]
# mistral slug 含随机后缀，用 like 查
urls = [
    f"{BASE}/rest/v1/tutorials?select=slug,published_at,en_status,content,content_en&slug=in.({','.join(SLUGS)})",
    f"{BASE}/rest/v1/tutorials?select=slug,published_at,en_status,content,content_en&slug=like.mistral-large-3*",
]
rows = []
for u in urls:
    rows += json.loads(urlopen(Request(u, headers=H)).read())

print(f"{'slug':62} {'pub':19} {'en_status':10} {'noindex':7} {'zh_len':>7} {'en_len':>7}")
for r in sorted(rows, key=lambda x: x['slug']):
    print(f"{r['slug'][:62]:62} {str(r.get('published_at'))[:19]:19} {str(r.get('en_status')):10} {str(r.get('noindex')):7} {len(r.get('content') or ''):>7} {len(r.get('content_en') or ''):>7}")
