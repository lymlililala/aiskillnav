#!/usr/bin/env python3
# 写库：把 /tmp/rw_<tag>_{zh,en}.md 写进 tutorials，附 summary。
# 用法: python3 write_article.py <tag> <slug> "<zh_summary>" "<en_summary>"
import re, json, time, sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
env={}
for ln in open('.env.local'):
    m=re.match(r'^([A-Z_]+)="?([^"]*)"?$',ln.strip())
    if m: env[m[1]]=m[2]
BASE=env['NEXT_PUBLIC_SUPABASE_URL']; SK=env['SUPABASE_SERVICE_ROLE_KEY']
H={'apikey':SK,'Authorization':f'Bearer {SK}','Content-Type':'application/json'}
tag, slug, zh_sum, en_sum = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
def strip_title(md):
    L=md.strip().split('\n')
    if L and L[0].lstrip().startswith('#'): L=L[1:]
    return '\n'.join(L).strip()
zh=strip_title(open(f'/tmp/rw_{tag}_zh.md').read()); en=strip_title(open(f'/tmp/rw_{tag}_en.md').read())
payload=json.dumps({'content':zh,'content_en':en,'summary':zh_sum,'summary_en':en_sum}).encode()
ok=False
for a in range(5):
    try:
        urlopen(Request(f"{BASE}/rest/v1/tutorials?slug=eq.{slug}",data=payload,method='PATCH',headers={**H,'Prefer':'return=minimal'}),timeout=60); ok=True; break
    except (HTTPError,URLError) as e: print("  retry",a+1,e); time.sleep(4)
v=json.loads(urlopen(Request(f"{BASE}/rest/v1/tutorials?select=content,content_en&slug=eq.{slug}",headers=H)).read())[0]
print(f"[{tag}] 写库={ok} content={len(v['content'])} en={len(v['content_en'])}")
