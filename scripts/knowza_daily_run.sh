#!/usr/bin/env bash
set -euo pipefail
export PATH="/usr/local/bin:/Users/erdalalp/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

EPISODE="${1:-0}"
MODE="${2:-promo}"
TMP_DIR="$(mktemp -d /tmp/knowza_autopost_XXXXXX)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

WORKSPACE="/Users/erdalalp/başla"
LOG_FILE="$HOME/.knowza-autopost.log"

echo "[$(date)] Starting Knowza autopost mode=$MODE episode=$EPISODE" >> "$LOG_FILE"
python3 "$WORKSPACE/scripts/knowza_daily_generator.py" --mode "$MODE" --episode "$EPISODE" --out-dir "$TMP_DIR" >> "$LOG_FILE" 2>&1

META_PATH="$(find "$TMP_DIR" -name 'meta.json' | head -n 1)"
if [ -n "$META_PATH" ]; then
  python3 "$WORKSPACE/scripts/knowza_auto_uploader.py" --upload --platforms youtube --meta "$META_PATH" >> "$LOG_FILE" 2>&1
fi
echo "[$(date)] Finished & cleaned up $TMP_DIR" >> "$LOG_FILE"
