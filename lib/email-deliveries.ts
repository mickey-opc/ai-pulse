import { getSql } from "@/lib/db";
import type { Article } from "@/lib/types";

type LockRow = {
  locked: boolean;
};

type ArticleRow = {
  id: string;
  title: string;
  title_zh: string | null;
  url: string;
  source: Article["source"];
  summary: string;
  summary_zh: string | null;
  published_at: string;
  created_at: string;
};

const SEND_CRON_LOCK_ID = 4_246_001;

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    title_zh: row.title_zh || undefined,
    url: row.url,
    source: row.source,
    summary: row.summary,
    summary_zh: row.summary_zh || undefined,
    publishedAt: row.published_at,
    createdAt: row.created_at
  };
}

export async function acquireSendCronLock() {
  const sql = getSql();
  const [row] = await sql<LockRow[]>`select pg_try_advisory_lock(${SEND_CRON_LOCK_ID}) as locked`;

  return Boolean(row?.locked);
}

export async function releaseSendCronLock() {
  const sql = getSql();
  await sql`select pg_advisory_unlock(${SEND_CRON_LOCK_ID})`;
}

export async function fetchPendingArticlesForSubscriber(subscriberId: string, limit = 12): Promise<Article[]> {
  const sql = getSql();
  const rows = await sql<ArticleRow[]>`
    select a.id, a.title, a.title_zh, a.url, a.source, a.summary, a.summary_zh, a.published_at, a.created_at
    from articles a
    where a.published_at >= now() - interval '24 hours'
      and not exists (
        select 1
        from email_deliveries d
        where d.subscriber_id = ${subscriberId}
          and d.article_id = a.id
      )
    order by a.published_at desc
    limit ${limit}
  `;

  return rows.map(mapArticle);
}

export async function recordArticleDeliveries(subscriberId: string, articleIds: string[]) {
  if (articleIds.length === 0) {
    return;
  }

  const sql = getSql();
  await sql`
    insert into email_deliveries (subscriber_id, article_id)
    select ${subscriberId}, unnest(${sql.array(articleIds)}::uuid[])
    on conflict (subscriber_id, article_id) do nothing
  `;
}
