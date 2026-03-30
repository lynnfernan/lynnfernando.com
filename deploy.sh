#!/bin/bash
# =====================================================
# Lynn Fernando — Deploy Script
# Uploads site files from your Mac to Lightsail
# Usage: bash deploy.sh yourdomain.com your-lightsail-ip
# =====================================================

DOMAIN=${1:-"lynnfernando.com"}
SERVER_IP=${2}
SSH_KEY=${3:-"~/.ssh/lightsail-key.pem"}
REMOTE_USER="admin"
REMOTE_PATH="/usr/share/nginx/html"
LOCAL_PATH="$(dirname "$0")"

if [ -z "$SERVER_IP" ]; then
  echo "Error: Please provide your Lightsail IP address."
  echo "Usage: bash deploy.sh yourdomain.com YOUR_IP"
  exit 1
fi

echo "==> Deploying to ${SERVER_IP}:${REMOTE_PATH}"

# Upload site files (excludes shell scripts and hidden files)
rsync -avz --progress \
  --exclude='*.sh' \
  --exclude='.DS_Store' \
  --exclude='*.md' \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  "${LOCAL_PATH}/" \
  "${REMOTE_USER}@${SERVER_IP}:${REMOTE_PATH}/"

echo ""
echo "==> Deploy complete! Visit: http://${DOMAIN}"
echo "==> After SSL is set up, it will redirect to https://${DOMAIN}"
