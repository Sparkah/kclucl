#!/usr/bin/env bash
set -euo pipefail

if lsof -ti:3000 >/dev/null 2>&1; then
  kill $(lsof -ti:3000) || true
  sleep 1
fi

rm -rf .next
npm run dev
