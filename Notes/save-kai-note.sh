#!/bin/bash
# 🧠 Kai Autosave & Memory Script — Full Version

NOTES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TODAY=$(date +"%Y-%m-%d")
TIME=$(date +"%H:%M:%S")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no-branch")
FILENAME="${NOTES_DIR}/${TODAY}_${BRANCH}_AutoNote.md"

mkdir -p "$NOTES_DIR"

# ─────────────────────────────────────────────
# 🧩 CAPTURE CONTEXT SNAPSHOT
# ─────────────────────────────────────────────
{
  echo "# 🧭 Kai Autosave — ${TODAY} (${BRANCH})"
  echo
  echo "## 🧠 Context"
  echo "Captured automatically at ${TIME} on branch **${BRANCH}**."
  echo
  echo "## 🧩 Current Build Health"
  echo '```bash'
  yarn tsc --project packages/loot-core/tsconfig.json --noEmit 2>&1 | head -n 20
  echo '```'
  echo
  echo "## 🧾 Git Status"
  echo '```bash'
  git status -sb
  echo '```'
  echo
  echo "## 🧩 Recent Commits"
  echo '```bash'
  git log --oneline -n 5
  echo '```'
  echo
  echo "## 🧘 Kai Reflection"
  echo "> “Every compile is a conversation.” — Kai"
  echo
} > "$FILENAME"

echo "✅ Kai note saved: $FILENAME"

# ─────────────────────────────────────────────
# 🧬 AUTO-LOAD KAI IDENTITY CONTEXT
# ─────────────────────────────────────────────
IDENTITY_FILE="${NOTES_DIR}/identity.md"
if [ -f "$IDENTITY_FILE" ]; then
  echo "🔗 Loaded identity context:"
  grep -E "^## " "$IDENTITY_FILE" | sed 's/^## / - /'
else
  echo "⚠️  No identity manifest found. Create one using 'identity.md'."
fi

# ─────────────────────────────────────────────
# 🗂️ AUTO-UPDATE README INDEX
# ─────────────────────────────────────────────
INDEX_FILE="${NOTES_DIR}/README.md"
TABLE=$(ls -1 "$NOTES_DIR"/*.md | grep -v "README.md" | sort -r | awk -F'/' '{f=$NF; gsub(".md","",f); d=substr(f,1,10); s=substr(f,12); printf "| [%s](./%s) | Auto | Snapshot of %s |\n", d, f, s }')

cat <<EOF2 > "$INDEX_FILE"
# 🗂️ Kai Session Notes Index

Chronological development log for **ActualFork A+ Refactor Project**

| Date | Session | Focus |
|------|----------|--------|
$TABLE

> 💬 _“Slow is smooth. Smooth is fast.” — Kai_
EOF2

# ─────────────────────────────────────────────
# 📦 OPTIONAL GIT COMMIT PROMPT
# ─────────────────────────────────────────────
read -p "Commit this autosave to Git? (y/n): " COMMIT
if [[ "$COMMIT" == "y" || "$COMMIT" == "Y" ]]; then
  git add "$FILENAME" "$INDEX_FILE"
  git commit -m "docs(notes): auto-save Kai session for ${TODAY} (${BRANCH})"
  echo "🧩 Note and index committed."
else
  echo "🕊️  Saved locally, not committed."
fi
