#!/bin/bash
# Deploy Persidian to the VPS (nuncio-vultr).
#
# git pull on the VPS is the primary sync mechanism — if the repo is
# pushed to origin/main, this mirrors it exactly and rebuilds.
#
# Usage:
#   ./deploy.sh          # git pull + rebuild (default)
#   ./deploy.sh build    # rebuild only, no pull (for manual fixes on VPS)

set -euo pipefail

REMOTE="${REMOTE:-nuncio-vultr}"
REMOTE_DIR="${REMOTE_DIR:-~/persidian}"
COMPOSE_FILE="docker-compose.vps.yml"
TARGET="${1:-all}"

echo "Deploying to $REMOTE:$REMOTE_DIR (target: $TARGET)"
echo ""

git_pull_vps() {
  echo "→ git pull on VPS..."
  ssh "$REMOTE" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && (git remote -v | grep -q origin || git clone https://github.com/udirobert/persidian.git .) && git fetch origin main && git reset --hard origin/main" 2>&1
  echo "  ✓ VPS repo synced to origin/main"
}

rebuild() {
  echo ""
  echo "→ Rebuilding on $REMOTE..."
  ssh "$REMOTE" "cd $REMOTE_DIR && sudo docker compose -f $COMPOSE_FILE up -d --build" 2>&1 | tail -12
}

health_check() {
  echo ""
  echo "✓ Deploy complete!"
  echo ""
  echo "Health check:"
  sleep 3
  for host in persidian.com www.persidian.com; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://${host}/")
    echo "  https://${host}/ → ${HTTP_CODE}"
  done
}

cleanup() {
  echo ""
  echo "→ Cleaning up old Docker images and build cache..."
  ssh "$REMOTE" "sudo docker image prune -f --filter dangling=true >/dev/null 2>&1 || true"
  ssh "$REMOTE" "sudo docker builder prune -f --keep-storage 5GB >/dev/null 2>&1 || true"
  echo "  ✓ Cleanup complete"
}

case "$TARGET" in
  build)
    rebuild
    health_check
    cleanup
    ;;
  all|*)
    git_pull_vps
    rebuild
    health_check
    cleanup
    ;;
esac
