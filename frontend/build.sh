#!/usr/bin/env bash
set -e
echo "=== EuroMatchTickets Frontend Build ==="
echo "Node: $(node --version)"
echo "Yarn: $(yarn --version)"
yarn install --no-frozen-lockfile
CI=false yarn build
echo "=== Build Complete ==="
