import { getSql } from "@/lib/db";
import { translateArticle } from "@/lib/translate";
import type { IngestArticle } from "@/lib/types";

export async function upsertArticles(articles: IngestArticle[]) {
  if (articles.length === 0) {
    return 0;
  }

  let count = 0;
  const sql = getSql();

  for (const article of articles) {
    // Translate title and summary to Chinese
    const { title_zh, summary_zh } = await translateArticle({
      title: article.title,
      summary: article.summary,
    });

    const result = await sql`
      insert into articles (title, title_zh, url, source, summary, summary_zh, published_at)
      values (${article.title}, ${title_zh}, ${article.url}, ${article.source}, ${article.summary}, ${summary_zh}, ${article.publishedAt})
      on conflict (url) do update
        set title = excluded.title,
            title_zh = excluded.title_zh,
            summary = excluded.summary,
            summary_zh = excluded.summary_zh,
            published_at = excluded.published_at
    `;

    count += result.count;
  }

  return count;
}
