#!/bin/bash
set -e

if [[ "${BLOG_LINK_ENABLED:-false}" == "true" ]]; then
  echo "Refusing post-merge startup: set BLOG_LINK_ENABLED=false before applying the Sprint 19 schema."
  exit 1
fi

npm install

echo "Database changes are intentionally manual. Run npm run db:push only after the flag-off preflight, then seed/backfill before enabling Link Intelligence."
