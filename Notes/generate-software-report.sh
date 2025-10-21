#!/bin/bash
# 🧠 Kai Provenance Script — Full Software + Library Version Report
# Generates a complete snapshot of all software, libraries, and tool versions
# for the ActualFork project.

OUTPUT="Notes/Software_Provenance_Report.md"
DATE=$(date +"%Y-%m-%d %H:%M:%S")

echo "# 🧠 ActualFork Software Provenance Report" > "$OUTPUT"
echo "_Generated automatically on ${DATE}_  " >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## 🧩 Summary" >> "$OUTPUT"
echo "- Generated on: ${DATE}" >> "$OUTPUT"
echo "- Host: $(hostname)" >> "$OUTPUT"
echo "- User: $(whoami)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ─────────────────────────────────────────────
# 📦 NPM/Yarn Dependencies
# ─────────────────────────────────────────────
echo "## 📦 Node.js Packages (Monorepo)" >> "$OUTPUT"
echo "| Package | Type | Version | Source |" >> "$OUTPUT"
echo "|----------|------|----------|--------|" >> "$OUTPUT"

find packages -name "package.json" | while read -r pkg; do
  jq -r --arg pkg "$pkg" '
    (.dependencies // {} + .devDependencies // {})
    | to_entries[]
    | "| \(.key) | dep | \(.value) | \($pkg) |"
  ' "$pkg" 2>/dev/null >> "$OUTPUT"
done

# Root-level package.json
if [ -f package.json ]; then
  jq -r '
    (.dependencies // {} + .devDependencies // {})
    | to_entries[]
    | "| \(.key) | root | \(.value) | package.json |"
  ' package.json 2>/dev/null >> "$OUTPUT"
fi

echo "" >> "$OUTPUT"

# ─────────────────────────────────────────────
# 🧰 Toolchain Versions
# ─────────────────────────────────────────────
echo "## 🧰 Toolchain Versions" >> "$OUTPUT"
echo '```bash' >> "$OUTPUT"
{
  echo "Node: $(node -v 2>/dev/null || echo 'not installed')"
  echo "npm: $(npm -v 2>/dev/null || echo 'not installed')"
  echo "Yarn: $(yarn -v 2>/dev/null || echo 'not installed')"
  echo "TypeScript: $(yarn list --pattern typescript | grep typescript@ | head -n 1 | awk '{print $2}' || echo 'unknown')"
  echo "Python: $(python3 --version 2>/dev/null || echo 'not installed')"
  echo "Git: $(git --version 2>/dev/null || echo 'not installed')"
} >> "$OUTPUT"
echo '```' >> "$OUTPUT"

# ─────────────────────────────────────────────
# 🧱 System & OS Info
# ─────────────────────────────────────────────
echo "" >> "$OUTPUT"
echo "## 🧱 System Environment" >> "$OUTPUT"
echo '```bash' >> "$OUTPUT"
if [ -f /etc/os-release ]; then
  grep -E 'NAME=|VERSION=' /etc/os-release | sed 's/^/OS: /'
fi
uname -a
df -h | head -n 5
echo '```' >> "$OUTPUT"

# ─────────────────────────────────────────────
# 🐳 Docker / Dev Container Info
# ─────────────────────────────────────────────
if [ -f Dockerfile ]; then
  echo "" >> "$OUTPUT"
  echo "## 🐳 Dockerfile Base Images" >> "$OUTPUT"
  grep -i "FROM " Dockerfile | awk '{print "- " $2}' >> "$OUTPUT"
fi

# Devcontainer file
if [ -f .devcontainer/devcontainer.json ]; then
  echo "" >> "$OUTPUT"
  echo "## 🧩 Devcontainer Info" >> "$OUTPUT"
  grep -E '"image":|"name":' .devcontainer/devcontainer.json | sed 's/^/  /' >> "$OUTPUT"
fi

# ─────────────────────────────────────────────
# 🧰 Global Tools
# ─────────────────────────────────────────────
echo "" >> "$OUTPUT"
echo "## 🌍 Global Tools Installed" >> "$OUTPUT"
echo '```bash' >> "$OUTPUT"
npm list -g --depth=0 2>/dev/null | tail -n +2
echo '```' >> "$OUTPUT"

# ─────────────────────────────────────────────
# 🧾 Git Information
# ─────────────────────────────────────────────
echo "" >> "$OUTPUT"
echo "## �� Git Information" >> "$OUTPUT"
echo '```bash' >> "$OUTPUT"
git remote -v
git branch --show-current
git rev-parse HEAD
git status -sb
echo '```' >> "$OUTPUT"

# ─────────────────────────────────────────────
# 🧠 Summary Footer
# ─────────────────────────────────────────────
echo "" >> "$OUTPUT"
echo "> Generated by Kai Memory System — A+ Provenance Mode" >> "$OUTPUT"
echo "> “Everything that runs should be traceable.” — Kai" >> "$OUTPUT"

echo "✅ Software Provenance Report saved to $OUTPUT"
