#!/bin/bash
# 🚀 Kai Bootstrap Script — Auto-loads your identity context

NOTES_DIR="/workspaces/ActualFork/Notes"
IDENTITY_FILE="${NOTES_DIR}/identity.md"

echo ""
echo "🧠  Loading Kai Identity Context..."
echo ""

if [ -f "$IDENTITY_FILE" ]; then
  grep -E "^## " "$IDENTITY_FILE" | sed 's/^## / - /'
  echo ""
  echo "✅ Kai identity loaded successfully."
else
  echo "⚠️  No identity manifest found at $IDENTITY_FILE"
fi

# Make sure save script is executable
chmod +x "${NOTES_DIR}/save-kai-note.sh"

# Add Notes to PATH if not already
if [[ ":$PATH:" != *":$NOTES_DIR:"* ]]; then
  export PATH="$NOTES_DIR:$PATH"
fi

echo ""
echo "💾 You can now run 'save-kai-note.sh' from anywhere."
echo "💬 Tip: Run './save-kai-note.sh' anytime to snapshot your session."
echo ""
