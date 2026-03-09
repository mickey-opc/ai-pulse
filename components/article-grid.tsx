import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import type { Article } from "@/lib/types";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <div className="empty-state">No articles yet. Run the fetch cron to ingest content.</div>;
  }

  return (
    <div className="articles-grid">
      {articles.map((article) => (
        <Link className="article-card" href={`/articles/${article.id}`} key={article.id}>
          <span className="source-pill">{article.source}</span>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <div className="meta-row">
            <span>{formatDistanceToNowStrict(new Date(article.publishedAt), { addSuffix: true })}</span>
            <span>Read more</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
