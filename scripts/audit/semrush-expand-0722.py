#!/usr/bin/env python3
"""SEMrush 批量取数：候选词 volume/CPC/竞争度 + TOP 词的相关词扩展。
用法: SEMRUSH_KEY=xxx python3 scripts/audit/semrush-expand-0722.py
结果落 gsc/0715-0722/semrush-0722.csv（不含 key，可入 git）。
"""
import os, sys, csv, time
from urllib.request import urlopen
from urllib.parse import quote

KEY = os.environ.get('SEMRUSH_KEY')
if not KEY:
    sys.exit('缺少 SEMRUSH_KEY 环境变量')

SEEDS = [
    'llm cost optimization', 'llm fallback', 'llm fallback routing',
    'ai data loss prevention', 'ai dlp',
    'ai clinical documentation', 'ambient clinical documentation',
    'enterprise generative ai', 'generative ai for enterprise',
    'ai chip architecture', 'mistral large', 'groq api',
    'ai credit risk', 'ai cloud cost optimization',
    'notion knowledge management', 'voice activity detection',
    'firecrawl mcp', 'hospital operations technology',
    'technology for hospital operations optimization',
    'fields medal leak', 'fields medal 2026'
]
# 对这些种子做 related 扩展（预计最有文章价值的方向）
EXPAND = [
    'ai data loss prevention', 'ai clinical documentation',
    'enterprise generative ai', 'llm cost optimization',
    'ai credit risk', 'hospital operations technology'
]

def call(params):
    url = f'https://api.semrush.com/?key={KEY}&{params}'
    for attempt in range(3):
        try:
            return urlopen(url, timeout=60).read().decode('utf-8', 'replace')
        except Exception as e:
            print(f'  retry {attempt+1}: {e}', file=sys.stderr)
            time.sleep(3)
    return ''

out = []
print('== phrase_this (database=us) ==')
for ph in SEEDS:
    txt = call(f'type=phrase_this&phrase={quote(ph)}&database=us&export_columns=Ph,Nq,Cp,Co,Nr')
    lines = [l for l in txt.strip().split('\n') if l and not l.startswith('ERROR')]
    if len(lines) >= 2:
        parts = lines[1].split(';')
        row = {'type': 'seed', 'keyword': parts[0], 'volume': parts[1], 'cpc': parts[2], 'comp': parts[3], 'results': parts[4]}
        out.append(row)
        print(f'  {parts[0]:45s} vol={parts[1]:>8s} cpc={parts[2]:>6s} comp={parts[3]}')
    else:
        out.append({'type': 'seed', 'keyword': ph, 'volume': '0', 'cpc': '', 'comp': '', 'results': ''})
        print(f'  {ph:45s} vol=       0 (无数据)')
    time.sleep(0.3)

print('\n== phrase_related (top 10 by volume) ==')
for ph in EXPAND:
    txt = call(f'type=phrase_related&phrase={quote(ph)}&database=us&export_columns=Ph,Nq,Cp,Co&display_limit=10')
    lines = [l for l in txt.strip().split('\n') if l and not l.startswith('ERROR')]
    print(f'  [{ph}]')
    for l in lines[1:11]:
        p = l.split(';')
        if len(p) >= 4:
            out.append({'type': f'related:{ph}', 'keyword': p[0], 'volume': p[1], 'cpc': p[2], 'comp': p[3], 'results': ''})
            print(f'    {p[0]:50s} vol={p[1]:>8s}')
    time.sleep(0.3)

with open('gsc/0715-0722/semrush-0722.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['type', 'keyword', 'volume', 'cpc', 'comp', 'results'])
    w.writeheader()
    w.writerows(out)
print('\n已写入 gsc/0715-0722/semrush-0722.csv')
