#!/usr/bin/env python3
# 可复用重写器：读源材料 + 旧文元信息 -> DeepSeek 生成中英双版 -> 落到 /tmp/rw_<tag>_{zh,en}.md
# 用法: python3 gen_article.py <tag> <slug> <source_file> "<topic_hint>"
import re, json, time, sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

env={}
for ln in open('.env.local'):
    m=re.match(r'^([A-Z_]+)="?([^"]*)"?$',ln.strip())
    if m: env[m[1]]=m[2]
K=env['DEEPSEEK_API_KEY']
BASE=env['NEXT_PUBLIC_SUPABASE_URL']; SK=env['SUPABASE_SERVICE_ROLE_KEY']
H={'apikey':SK,'Authorization':f'Bearer {SK}'}

tag, slug, src_file, hint = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
src = open(src_file).read()[:22000] if src_file and src_file!='-' else ''

# 备份旧文
cur=json.loads(urlopen(Request(f"{BASE}/rest/v1/tutorials?select=slug,title,summary,content,content_en&slug=eq.{slug}",headers=H)).read())[0]
json.dump({'when':'2026-07-11','slug':slug,'old_content':cur.get('content'),'old_content_en':cur.get('content_en')},
          open(f'output/rewrite-backup-{tag}-20260711.json','w'),ensure_ascii=False)

RULES_ZH=("你是资深技术编辑，为中文 AI 开发者站点重写/扩写教程。铁律：\n"
"1. 事实优先用【参考资料】；资料未覆盖处只写业界公认的通用知识，**绝不编造**具体数字/跑分/版本号/产品名/API。\n"
"2. 严禁：编造 benchmark 跑分表、假包名/仓库/工具名、假‘实测得分’、占位伪代码。举例用真实且广为人知的工具。\n"
"3. 简体中文，Markdown：## 标题、```代码块(标注语言,且必须是可运行真实代码)、必要时表格；专有名词/命令保持英文准确。\n"
"4. 内容要有真实信息密度：概念要讲透、给可操作步骤或真实示例、点出常见坑。不确定的量化结论用定性表述，别编数字。\n"
"5. 结尾加 `## FAQ`（3-5 组真实问答）+ 一行 `*最后更新：2026 年 7 月。请以各工具官方文档为准。*`\n"
"6. 目标 1500-2400 中文字，务实无套话，禁止『综上所述/本指南为你提供了』式空洞结尾。只输出正文 Markdown。")
RULES_EN=("You are a senior technical editor rewriting/expanding a tutorial for an English AI-developer site. Rules:\n"
"1. Prefer facts from the REFERENCE; where uncovered, use only widely-accepted general knowledge. NEVER fabricate specific numbers/benchmarks/versions/product names/APIs.\n"
"2. Forbidden: fabricated benchmark tables, fake package/repo/tool names, fake 'measured scores', placeholder pseudo-code. Use real, well-known tools in examples.\n"
"3. English Markdown: ## headings, fenced code (real runnable code) with language, tables where useful; keep proper nouns/commands accurate.\n"
"4. Real information density: explain concepts fully, give actionable steps or real examples, note common pitfalls. Use qualitative statements where unsure; do not invent figures.\n"
"5. End with `## FAQ` (3-5 real Q&As) + `*Last updated: July 2026. Always verify against each tool's official docs.*`\n"
"6. ~1500-2400 words, practical, no fluff. Output only the Markdown body.")

def gen(system,user):
    body=json.dumps({"model":"deepseek-chat","temperature":0.3,
        "messages":[{"role":"system","content":system},{"role":"user","content":user}]}).encode()
    for a in range(6):
        try:
            r=urlopen(Request("https://api.deepseek.com/chat/completions",data=body,
                headers={"Authorization":f"Bearer {K}","Content-Type":"application/json"}),timeout=240)
            return json.loads(r.read())['choices'][0]['message']['content']
        except Exception as e: print("  retry",a+1,repr(e)); time.sleep(5)
    return None

srcblock=f"\n\n【参考资料】\n{src}" if src else "\n\n(无外部资料，按公认通用知识写，绝不编造具体数字/产品/API)"
zh=gen(RULES_ZH, f"重写主题：{cur['title']}\n方向提示：{hint}{srcblock}")
en=gen(RULES_EN, f"Rewrite topic: {cur['title']}\nGuidance: {hint}"+(f"\n\n【REFERENCE】\n{src}" if src else "\n\n(No external source; use accepted general knowledge, never fabricate specifics)"))
open(f'/tmp/rw_{tag}_zh.md','w').write(zh or ''); open(f'/tmp/rw_{tag}_en.md','w').write(en or '')

# 红旗自检
def redflags(t):
    f=[]
    if re.search(r'\|\s*\d+\s*[-–]\s*\d+\s*%', t): f.append('模糊跑分区间')
    if re.search(r'(MMLU|HumanEval|MATH|GPQA)\s*\|\s*\d', t): f.append('benchmark表')
    if re.search(r'@development/|demonstrate_concept|foo_bar|your-api-key-here', t): f.append('占位/假包')
    if re.search(r'```[a-z]*\s*```', t): f.append('空代码块')
    return f
print(f"[{tag}] zh {len(zh or '')}字 en {len(en or '')}字 | zh红旗={redflags(zh or '')} en红旗={redflags(en or '')}")
