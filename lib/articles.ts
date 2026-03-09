import { getSql } from "@/lib/db";
import type { IngestArticle } from "@/lib/types";

export async function upsertArticles(articles: IngestArticle[]) {
  if (articles.length === 0) {
    return 0;
  }

  let count = 0;
  const sql = getSql();

  for (const article of articles) {
    const result = await sql`
      insert into articles (title, url, source, summary, published_at)
      values (${article.title}, ${article.url}, ${article.source}, ${article.summary}, ${article.publishedAt})
      on conflict (url) do update
        set title = excluded.title,
            summary = excluded.summary,
            published_at = excluded.published_at
    `;

    count += result.count;
  }

  return count;
}
