# Architecture

## Flow

1. Vercel Cron hits `/api/cron/fetch` every day.
2. The route fetches source feeds and upserts them into PostgreSQL.
3. Homepage reads the latest records from PostgreSQL.
4. `/api/cron/send` checks for unsent articles from the last 24 hours and emails each subscriber at most once per article via Resend.

## Schedules

- `/api/cron/fetch`: every day
- `/api/cron/send`: every day

## Delivery Safety

- `email_deliveries` stores which subscriber already received which article.
- The send cron uses a PostgreSQL advisory lock to avoid overlapping runs.

## Sources

- Twitter/X: mirror RSS with multi-instance fallback
- waytoagi: homepage news links
- OpenAI: official RSS feed
- Anthropic: official `/news` page

## Notes

- The Node fetcher is used in production cron routes for Vercel compatibility.
- The Python crawler mirrors the same source list for local collection, debugging, and future Playwright expansion.
- Twitter mirrors are unstable by nature. Production should override `TWITTER_RSS_URLS` with a known-good mirror list.
