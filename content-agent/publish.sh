#!/bin/bash
# =====================================================
# Lynn Fernando — Auto Publish Script
# Writes next article from queue and deploys to server
# Runs via cron every Monday at 8am
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

# Count remaining articles
REMAINING=$(grep -c "^TOPIC:" "$QUEUE_FILE" 2>/dev/null || echo 0)

if [ "$REMAINING" -eq 0 ]; then
  echo "Queue is empty — nothing to publish." >> "$LOG_FILE"
  echo "⚠️  Queue empty: Add topics to content-agent/articles-queue.txt" >> "$LOG_FILE"
  exit 0
fi

echo "Queue: $REMAINING articles remaining" >> "$LOG_FILE"

# Write next article
echo "Writing article..." >> "$LOG_FILE"
(cd "$AGENT_DIR" && $NODE agent.js) >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "✗ Article generation failed. Check log." >> "$LOG_FILE"
  exit 1
fi

# Deploy to server
echo "Deploying..." >> "$LOG_FILE"
bash "$SITE_DIR/deploy.sh" lynnfernando.com 35.80.180.230 ~/Downloads/LightsailDefaultKey-us-west-2.pem >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "✓ Published and deployed successfully." >> "$LOG_FILE"
else
  echo "✗ Deploy failed. Article was written locally but not uploaded." >> "$LOG_FILE"
fi

# Generate social media posts
echo "Generating social media posts..." >> "$LOG_FILE"
(cd "$AGENT_DIR" && $NODE social-agent.js) >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "✓ Social posts generated. Check content-agent/social-posts/" >> "$LOG_FILE"
else
  echo "✗ Social post generation failed. Article is still live." >> "$LOG_FILE"
fi

# Warn if queue is getting low
AFTER=$(grep -c "^TOPIC:" "$QUEUE_FILE" 2>/dev/null || echo 0)
if [ "$AFTER" -le 2 ]; then
  echo "⚠️  Only $AFTER article(s) left in queue — time to add more topics." >> "$LOG_FILE"
fi
