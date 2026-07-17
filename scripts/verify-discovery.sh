#!/usr/bin/env bash
set -euo pipefail

SITE="${SITE:-https://persidian.com}"
FAIL=0

pass() { echo "✓ $1"; }
fail() { echo "✗ $1"; FAIL=1; }

echo "Verifying discovery surfaces for ${SITE}"
echo

robots="$(curl -fsSL "${SITE}/robots.txt")"
if echo "$robots" | grep -qi 'Sitemap:'; then
  pass "robots.txt includes Sitemap directive"
else
  fail "robots.txt missing Sitemap: (Cloudflare managed robots may be overriding origin — see docs/discovery-cloudflare.md)"
fi

if echo "$robots" | grep -qi 'OAI-SearchBot\|Claude-SearchBot'; then
  pass "robots.txt mentions explicit search-agent rules"
else
  fail "robots.txt missing OAI-SearchBot / Claude-SearchBot rules (disable Cloudflare managed robots or append origin rules)"
fi

if curl -fsSL "${SITE}/sitemap.xml" | grep -q '<loc>'; then
  pass "sitemap.xml returns URL entries"
else
  fail "sitemap.xml missing <loc> entries"
fi

if curl -fsSL "${SITE}/llms.txt" | grep -qi 'Persidian'; then
  pass "llms.txt is reachable"
else
  fail "llms.txt missing or empty"
fi

if curl -fsSL "${SITE}/.well-known/agent.json" | grep -q '"name"'; then
  pass "agent.json is reachable"
else
  fail "agent.json missing or invalid"
fi

echo
if [[ "$FAIL" -ne 0 ]]; then
  echo "Discovery verification failed."
  exit 1
fi

echo "Discovery verification passed."
