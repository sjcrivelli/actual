#!/bin/bash
# --------------------------------------------
# debug-tsc.sh — Diagnose TypeScript config behavior
# --------------------------------------------

set -e

# 🧭 Determine working directory
PROJECT_PATH=${1:-"packages/loot-core/tsconfig.sync.json"}
ABS_PATH=$(realpath "$PROJECT_PATH")
OUTPUT_FILE="/tmp/final-tsconfig.json"
TRACE_FILE="/tmp/ts-trace.log"

echo ""
echo "🔍 Analyzing TypeScript config..."
echo "📁 Project file: $ABS_PATH"
echo ""

# 🧹 Clean old logs
rm -f "$OUTPUT_FILE" "$TRACE_FILE"

# 🧩 Step 1: Dump merged config
echo "➡️  Running: tsc --showConfig"
if ! npx tsc --showConfig --project "$ABS_PATH" > "$OUTPUT_FILE" 2>/dev/null; then
  echo "❌ Failed to dump config. Check if path exists: $ABS_PATH"
  exit 1
fi

# 🧠 Step 2: Print summary
echo ""
echo "--------------------------------------------"
echo "📋 TypeScript Config Summary"
echo "--------------------------------------------"
grep -E '"extends"|rootDir|outDir|"include"|strict|typescript-strict-plugin' "$OUTPUT_FILE" || echo "No matching keys found."

echo ""
echo "--------------------------------------------"
echo "🔍 Checking which tsconfig files were used"
echo "--------------------------------------------"
npx tsc --traceResolution --project "$ABS_PATH" > "$TRACE_FILE" 2>/dev/null
grep "tsconfig.json" "$TRACE_FILE" | sort | uniq || echo "No trace info found."

echo ""
echo "--------------------------------------------"
echo "🧩 Diagnostic summary"
echo "--------------------------------------------"

if grep -q '"typescript-strict-plugin"' "$OUTPUT_FILE"; then
  echo "⚠️  Detected 'typescript-strict-plugin' — strict rules are being injected globally."
fi

if grep -q '"strict": true' "$OUTPUT_FILE"; then
  echo "⚠️  'strict' mode is ENABLED in the merged config."
else
  echo "✅  'strict' mode is disabled."
fi

ROOT_DIR=$(grep "rootDir" "$OUTPUT_FILE" | head -1 | sed 's/.*: "\(.*\)".*/\1/')
echo "📂 rootDir: ${ROOT_DIR:-not set}"

INCLUDE_COUNT=$(grep -c '"include"' "$OUTPUT_FILE" || true)
echo "📄 include sections: $INCLUDE_COUNT"

echo ""
echo "Full merged config: $OUTPUT_FILE"
echo "Full trace log: $TRACE_FILE"
echo ""
echo "✅ Done."
echo "--------------------------------------------"
