#!/bin/bash
# Script to update sitemap.xml before deployment
# Run this before building the frontend

BACKEND_URL="${REACT_APP_BACKEND_URL:-https://ticket-checkout-fix.preview.emergentagent.com}"

echo "📥 Fetching latest sitemap from backend..."
curl -s "$BACKEND_URL/api/sitemap.xml" > /app/frontend/public/sitemap.xml

if [ $? -eq 0 ]; then
    URL_COUNT=$(grep -c "<url>" /app/frontend/public/sitemap.xml)
    echo "✅ Sitemap updated successfully! ($URL_COUNT URLs)"
else
    echo "❌ Failed to fetch sitemap"
    exit 1
fi
