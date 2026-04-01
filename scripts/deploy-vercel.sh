#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGE_DIR="$ROOT_DIR/.vercel-deploy"

cd "$ROOT_DIR"

# Build the web component so demo assets exist in dist/.
npm run build

# Prepare a clean staging folder containing only deployable static files.
rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"

cp -R "$ROOT_DIR/dist" "$STAGE_DIR/dist"
cp "$ROOT_DIR/demo/index.html" "$STAGE_DIR/index.html"

# The demo page points to ../dist in local dev; for deploy root it should point to ./dist.
sed -i 's|../dist/src/|./dist/src/|g' "$STAGE_DIR/index.html"

# Deploy static files to Vercel production.
npx vercel deploy "$STAGE_DIR" --prod
