import { getSql } from "@/lib/db";
import type { Article } from "@/lib/types";

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

export async function fetchArticles(source?: string, limit = 30): Promise<Article[]> {
  try {
    const sql = getSql();
    const rows = source
      ? await sql<ArticleRow[]>`
          select id, title, title_zh, url, source, summary, summary_zh, published_at, created_at
          from articles
          where source = ${source}
          order by published_at desc
          limit ${limit}
        `
      : await sql<ArticleRow[]>`
          select id, title, title_zh, url, source, summary, summary_zh, published_at, created_at
          from articles
          order by published_at desc
          limit ${limit}
        `;

    return rows.map(mapArticle);
  } catch {
    return [];
  }
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    const sql = getSql();
    const [row] = await sql<ArticleRow[]>`
      select id, title, title_zh, url, source, summary, summary_zh, published_at, created_at
      from articles
      where id = ${id}
      limit 1
    `;

    return row ? mapArticle(row) : null;
  } catch {
    return null;
  }
}

export async function fetchDigestArticles(): Promise<Article[]> {
  try {
    const sql = getSql();
    const rows = await sql<ArticleRow[]>`
      select id, title, title_zh, url, source, summary, summary_zh, published_at, created_at
      from articles
      where published_at >= now() - interval '24 hours'
      order by published_at desc
      limit 12
    `;

    return rows.map(mapArticle);
  } catch {
    return [];
  }
}
