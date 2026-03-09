# Architecture

## Flow

1. Vercel Cron hits `/api/cron/fetch` every 5 hours.
2. The route fetches source feeds and upserts them into PostgreSQL.
3. Homepage reads the latest records from PostgreSQL.
4. `/api/cron/send` builds a 24-hour digest and sends it to subscribers via Resend.

## Sources

- Twitter/X: mirror RSS with multi-instance fallback
- waytoagi: homepage news links
- OpenAI: official RSS feed
- Anthropic: official `/news` page

## Notes

- The Node fetcher is used in production cron routes for Vercel compatibility.
- The Python crawler mirrors the same source list for local collection, debugging, and future Playwright expansion.
- Twitter mirrors are unstable by nature. Production should override `TWITTER_RSS_URLS` with a known-good mirror list.
