#!/bin/bash
# =====================================================
# Lynn Fernando — Auto Publish Script
# Checks for scheduled articles, reveals them by
# regenerating index pages, then deploys to server.
# If no pre-written articles exist, falls back to
# writing from queue.
# Runs via cron Wed & Fri at 8:03am
# =====================================================

AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$(dirname "$AGENT_DIR")"
LOG_FILE="$AGENT_DIR/publish.log"
QUEUE_FILE="$AGENT_DIR/articles-queue.txt"

# Full path to node (required for cron — cron has a minimal PATH)
NODE="/usr/local/bin/node"

# Load API key from shell profile
source ~/.zshrc 2>/dev/null

echo "" >> "$LOG_FILE"
echo "=============================" >> "$LOG_FILE"
echo "Run: $(date)" >> "$LOG_FILE"

# Regenerate index pages with date filtering (reveals scheduled articles)
echo "Regenerating index pages..." >> "$LOG_FILE"
(cd "$AGENT_DIR" && $NODE agent.js --index) >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "✗ Index regeneration failed." >> "$LOG_FILE"
  exit 1
fi

echo "✓ Index pages updated with today's articles" >> "$LOG_FILE"

# Check if there are queued articles to write (for future scheduling)
REMAINING=$(grep -c "^TOPIC:" "$QUEUE_FILE" 2>/dev/null || echo 0)
if [ "$REMAINING" -gt 0 ]; then
  echo "Queue: $REMAINING articles remaining for future scheduling" >> "$LOG_FILE"
fi

# Deploy to server
echo "Deploying..." >> "$LOG_FILE"
bash "$SITE_DIR/deploy.sh" lynnfernando.com 35.80.180.230 ~/Downloads/LightsailDefaultKey-us-west-2.pem >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "✓ Published and deployed successfully." >> "$LOG_FILE"
else
  echo "✗ Deploy failed. Index was updated locally but not uploaded." >> "$LOG_FILE"
  exit 1
fi
