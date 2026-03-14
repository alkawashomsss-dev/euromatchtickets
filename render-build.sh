#!/usr/bin/env bash
set -e

echo "=== Installing backend dependencies ==="
cd /opt/render/project/src/backend
pip install -r requirements.txt
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ || echo "Warning: emergentintegrations not installed (content generation will be unavailable)"

echo "=== Installing frontend dependencies ==="
cd /opt/render/project/src/frontend
yarn install --frozen-lockfile || yarn install

echo "=== Building frontend ==="
yarn build

echo "=== Copying frontend build to backend/static ==="
rm -rf /opt/render/project/src/backend/static
cp -r build /opt/render/project/src/backend/static

echo "=== Build complete! ==="
ls -la /opt/render/project/src/backend/static/ | head -10
