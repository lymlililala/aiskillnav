# 公众号采集 → DeepSeek 多源合成 → 发布到 tutorials

离线内容流水线：从 20 个 AI/科技公众号采集文章正文，DeepSeek 语义聚类后**多源合成原创**中文常青教程，经质量闸门 + AI 自评分后写入 Supabase `tutorials` 表。

> ⚠️ **只在本地/小服务器跑，绝不上 Vercel**（数据中心 IP 会被采集源封、函数时长不够）。站点只读库。

## 前置

1. Node 18+（零依赖，原生 fetch）。
2. 凭证（均在 gitignored `.env`，勿提交）：
   - `scripts/wechat/cimidata/.env` — `CIMIDATA_APP_ID` / `CIMIDATA_APP_SECRET`（采集，见 `cimidata/README.md`）
   - `scripts/wechat/.env` — `DEEPSEEK_API_KEY`、`NEXT_PUBLIC_SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`

## 流水线（顺序跑）

```bash
# 0) 解析 20 个号名 → wxid（一次性，含限频重试）。产物 data/accounts.json
node scripts/wechat/accounts.mjs

# 1) 采集历史文章 + 正文（按 sn 去重，增量）。产物 data/sources.json
node scripts/wechat/1-crawl.mjs --max-pages 1          # 试跑省钱
node scripts/wechat/1-crawl.mjs --max-pages 3 --since 2026-05-01
node scripts/wechat/1-crawl.mjs --no-body             # 只看列表不拉正文

# 2) DeepSeek 语义聚类（3-6 篇/簇）。产物 data/clusters.json —— 跑完人工审一遍
node scripts/wechat/2-cluster.mjs --max-clusters 8

# 3) 逐簇合成原创 Markdown 教程。产物 data/drafts.json —— 抽查质量
node scripts/wechat/3-synthesize.mjs --limit 2        # 先试 2 篇
node scripts/wechat/3-synthesize.mjs                  # 全部

# 4) 质量闸门 + AI 自评分 → 写库（过线 published_at=now，否则草稿 null）
node scripts/wechat/4-publish.mjs --dry-run           # 先只看判定
node scripts/wechat/4-publish.mjs --threshold 80      # 实际入库
```

每阶段产物落 `data/`（gitignored），可单独重跑、增量、人工审。

## 质量与合规设计

- **多源合成而非洗稿**：每篇综合 3-6 篇源文重新组织，避免重复内容被搜索引擎判罚（参见项目 memory `templated-garbage-comparison-articles` 的前车之鉴）。
- **双闸门**（`lib/quality.mjs` + AI 自评分）：命中历史劣质指纹 / 正文 <2500 字 / FAQ <2 对 / 非中文为主 → 进草稿不发布。
- **草稿机制**：不过线的文 `published_at=null`，站内列表/sitemap 不可见，但详情页可渲染（便于人工复核后手动放行）。
- **provenance**：`data/drafts.json` / `published.json` 记录每篇由哪些源文合成，备查与合规追溯；源正文不入库、不外传。
- 合成文含 `## FAQ` 段（≥3 对）驱动 FAQPage 结构化数据，并内链到 `/tutorials/topic/{slug}` 支柱页强化站内链接。

## 文件

```
scripts/wechat/
├── cimidata/         采集 API 客户端（可独立复制，见其 README）
├── deepseek.mjs      DeepSeek 客户端（OpenAI 兼容，零依赖，含 JSON 容错解析）
├── lib/
│   ├── env.mjs        共享 .env 加载 + DATA_DIR
│   ├── clean-html.mjs 正文 HTML → 纯文本
│   ├── supabase.mjs   PostgREST 幂等 upsert tutorials
│   ├── slug.mjs       slug 生成 + 站内查重
│   └── quality.mjs    指纹/薄内容/FAQ 闸门
├── accounts.mjs      0) 解析 wxid
├── 1-crawl.mjs       1) 采集
├── 2-cluster.mjs     2) 聚类
├── 3-synthesize.mjs  3) 合成
├── 4-publish.mjs     4) 发布
└── data/             产物（gitignored）
```

## 成本（参考）

采集：历史列表 0.05/次、正文 0.01/篇；DeepSeek：聚类约 0.03、合成约 0.05/篇、评分约 0.01/篇。试跑（20 号 1 页 ≈ 280 篇正文 + 8 篇合成）约 3-4 元。
