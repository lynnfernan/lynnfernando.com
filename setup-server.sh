#!/bin/bash
# =====================================================
# Lynn Fernando — Lightsail Server Setup
# Run once on a fresh Ubuntu 22.04 Lightsail instance
# Usage: bash setup-server.sh yourdomain.com
# =====================================================

DOMAIN=${1:-"lynnfernando.com"}

echo "==> Updating system..."
sudo apt-get update -y && sudo apt-get upgrade -y

echo "==> Installing Nginx..."
sudo apt-get install -y nginx

echo "==> Installing Certbot (SSL)..."
sudo apt-get install -y certbot python3-certbot-nginx

echo "==> Creating web root..."
sudo mkdir -p /var/www/${DOMAIN}
sudo chown -R $USER:$USER /var/www/${DOMAIN}

echo "==> Writing Nginx config..."
sudo tee /etc/nginx/sites-available/${DOMAIN} > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root /var/www/${DOMAIN};
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript image/svg+xml;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Redirect www to non-www
    if (\$host = www.${DOMAIN}) {
        return 301 https://${DOMAIN}\$request_uri;
    }
}
EOF

echo "==> Enabling site..."
sudo ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "==> Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Upload site files:  bash deploy.sh yourdomain.com"
echo "  2. Get SSL cert:       sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
