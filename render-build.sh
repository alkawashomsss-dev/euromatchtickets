#!/usr/bin/env bash
set -e

echo "=== Python Version ==="
python3 --version

echo "=== Installing backend dependencies ==="
cd /opt/render/project/src/backend
pip install --upgrade pip
pip install -r requirements.txt

echo "=== Installing frontend dependencies ==="
cd /opt/render/project/src/frontend
npm ci --legacy-peer-deps

echo "=== Building frontend ==="
CI=false npx craco build

echo "=== Copying frontend build to backend/static ==="
rm -rf /opt/render/project/src/backend/static
cp -r build /opt/render/project/src/backend/static

echo "=== Build complete! ==="
ls -la /opt/render/project/src/backend/static/ | head -10
