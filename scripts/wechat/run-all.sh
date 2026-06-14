#!/usr/bin/env bash
# 本地一键跑公众号内容流水线。解锁 GitHub Actions 前用它手动发内容。
#
# 用法：
#   ./scripts/wechat/run-all.sh news           # 仅日更：采集增量 + 生成热点 news
#   ./scripts/wechat/run-all.sh evergreen      # 周更：采集 + tutorials + usecases
#   ./scripts/wechat/run-all.sh all            # 两者都跑
#   ./scripts/wechat/run-all.sh news --dry     # dry-run：只生成不写库
#
# 依赖：Node 18+（脚本零依赖）；凭证读 scripts/wechat/.env（已 gitignore）。

set -euo pipefail
cd "$(dirname "$0")/../.."   # 切到仓库根目录

MODE="${1:-news}"
DRY=""
[[ "${2:-}" == "--dry" || "${1:-}" == "--dry" ]] && DRY="--dry-run"

# 计算增量起始日期（跨平台：优先 GNU date，回退 BSD/macOS date）
since_days() {
  local n="$1"
  date -u -d "$n days ago" +%Y-%m-%d 2>/dev/null || date -u -v-"${n}"d +%Y-%m-%d
}

run() { echo; echo "▶ $*"; node "$@"; }

run_news() {
  echo "════════ NEWS 日更 ════════"
  run scripts/wechat/1-crawl.mjs --since "$(since_days 7)" --max-pages 2
  run scripts/wechat/news.mjs --days 3 $DRY
}

run_evergreen() {
  echo "════════ EVERGREEN 周更（tutorials + usecases）════════"
  run scripts/wechat/1-crawl.mjs --since "$(since_days 14)" --max-pages 3
  run scripts/wechat/2-cluster.mjs
  run scripts/wechat/3-synthesize.mjs
  run scripts/wechat/4-publish.mjs --threshold 75 $DRY
  run scripts/wechat/usecases.mjs $DRY
}

case "$MODE" in
  news)       run_news ;;
  evergreen)  run_evergreen ;;
  all)        run_news; run_evergreen ;;
  --dry)      run_news ;;   # `run-all.sh --dry` 等价于 news --dry
  *) echo "未知模式：$MODE（可用 news | evergreen | all，加 --dry 试跑）"; exit 1 ;;
esac

echo; echo "✅ 完成${DRY:+（DRY-RUN，未写库）}"
