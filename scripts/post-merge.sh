#!/bin/bash
set -e

# Guard Sprint 19: refuse to start when Link Intelligence is enabled but its
# schema is not fully applied. A single-table probe is NOT enough: an interrupted
# migration can create blog_links while the enabled code also queries the
# sources, join, audit and check tables plus the new topic-candidates column,
# which would surface as runtime database errors instead of a clean refusal.
if [[ "${BLOG_LINK_ENABLED:-false}" == "true" ]]; then
  missing=""

  for table in blog_link_sources blog_links blog_post_links blog_link_audit_runs blog_link_checks; do
    present="$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.$table') IS NOT NULL" 2>/dev/null || true)"
    if [[ "$(echo "$present" | tr -d '[:space:]')" != "t" ]]; then
      missing="$missing $table"
    fi
  done

  column_present="$(psql "$DATABASE_URL" -tAc "SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_topic_candidates' AND column_name='internal_link_target_ids'" 2>/dev/null || true)"
  if [[ "$(echo "$column_present" | tr -d '[:space:]')" != "1" ]]; then
    missing="$missing blog_topic_candidates.internal_link_target_ids"
  fi

  if [[ -n "$missing" ]]; then
    echo "Refusing post-merge startup: BLOG_LINK_ENABLED=true but the Link Intelligence schema is incomplete."
    echo "Missing:$missing"
    echo "Set BLOG_LINK_ENABLED=false, run npm run db:push, then seed + backfill before enabling it again."
    exit 1
  fi

  # Schema presence is not the whole cutover. A database with the tables created
  # but no seed/backfill starts happily and reports that no links exist, which
  # looks like healthy data instead of an unfinished migration. So require the
  # durable evidence each step leaves behind: seeded sources, and the cutover
  # marker that a full `--apply` backfill pass writes into blog_link_audit_runs
  # (key kept in sync with BLOG_LINK_CUTOVER_MARKER_KEY in
  # server/blog/links/config.ts).
  incomplete=""

  seeded_sources="$(psql "$DATABASE_URL" -tAc "SELECT count(*) FROM blog_link_sources" 2>/dev/null || true)"
  if [[ ! "$(echo "$seeded_sources" | tr -d '[:space:]')" =~ ^[0-9]+$ ]] \
    || [[ "$(echo "$seeded_sources" | tr -d '[:space:]')" == "0" ]]; then
    incomplete="$incomplete link-library-seed(npm_run_blog:link-seed)"
  fi

  # Validate the marker's whole signature, not just its key: only a full apply
  # pass that started from the beginning and finished without failures proves
  # every post was scanned. (The key is reserved in code too, so a normal audit
  # run cannot occupy it, but this guard does not depend on that.)
  marker_key="link-intelligence-cutover-backfill"
  marker_sql="SELECT count(*) FROM blog_link_audit_runs"
  marker_sql="$marker_sql WHERE idempotency_key = '$marker_key' AND status = 'completed'"
  marker_sql="$marker_sql AND completed_at IS NOT NULL AND lease_token IS NULL"
  marker_sql="$marker_sql AND input->>'marker' = 'link-intelligence-cutover'"
  marker_sql="$marker_sql AND input->>'mode' = 'apply' AND input->>'resumedAfterId' = '0'"
  marker_sql="$marker_sql AND result ? 'totals'"
  marker_sql="$marker_sql AND coalesce(jsonb_array_length(result->'failures'), 1) = 0"
  cutover_marker="$(psql "$DATABASE_URL" -tAc "$marker_sql" 2>/dev/null || true)"
  if [[ "$(echo "$cutover_marker" | tr -d '[:space:]')" != "1" ]]; then
    incomplete="$incomplete full-backfill-pass(npm_run_blog:link-backfill_--_--apply)"
  fi

  if [[ -n "$incomplete" ]]; then
    echo "Refusing post-merge startup: BLOG_LINK_ENABLED=true but the cutover is not complete."
    echo "Pending:$incomplete"
    echo "Set BLOG_LINK_ENABLED=false, finish the cutover in order (db:push, seed, full backfill), then enable it again."
    exit 1
  fi

  # Freshness is a different question from completeness, and it gets a warning
  # rather than a refusal: link reconciliation only runs while the flag is on, so
  # posts edited with it off can carry link rows nobody rescanned. Refusing to
  # boot for that would turn an edited blog post into an outage, and the link
  # pipeline already fails open by design elsewhere.
  stale_sql="SELECT count(*) FROM blog_posts p, blog_link_audit_runs r"
  stale_sql="$stale_sql WHERE r.idempotency_key = '$marker_key' AND p.status = 'published'"
  # Compare against when the pass STARTED, not when it finished: a post edited
  # after its own batch was processed but before the run completed was never
  # rescanned, yet its updated_at is older than completed_at. Using started_at
  # can only over-report (a post edited during the run may have been picked up
  # anyway), which is the right way round for a warning.
  stale_sql="$stale_sql AND p.updated_at > coalesce(r.started_at, r.completed_at)"
  stale_posts="$(psql "$DATABASE_URL" -tAc "$stale_sql" 2>/dev/null | tr -d '[:space:]' || true)"
  if [[ "$stale_posts" =~ ^[1-9][0-9]*$ ]]; then
    echo "Warning: $stale_posts published post(s) changed after the last full link backfill."
    echo "Their link rows may be stale. Re-run npm run blog:link-backfill -- --apply when convenient."
  fi
fi

npm install

echo "Database changes are intentionally manual. Run npm run db:push only after the flag-off preflight, then seed/backfill before enabling Link Intelligence."
