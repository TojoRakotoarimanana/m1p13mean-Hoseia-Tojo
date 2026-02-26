#!/bin/bash
set -e

# Vérifie que API_URL est défini (obligatoire sur Cloudflare Pages)
: "${API_URL:?[build.sh] ERROR: API_URL environment variable is not set. Add it in Cloudflare Pages > Settings > Environment Variables.}"

echo "[build.sh] Injecting API_URL: $API_URL"

# Remplace le placeholder dans environment.prod.ts
sed -i "s|%%API_URL%%|$API_URL|g" src/environments/environment.prod.ts

echo "[build.sh] Running ng build..."
npm run build
