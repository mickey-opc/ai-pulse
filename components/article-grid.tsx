import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import type { Article } from "@/lib/types";

export function ArticleGrid({ articles, locale = "en" }: { articles: Article[]; locale?: string }) {
  if (articles.length === 0) {
    return <div className="empty-state">No articles yet. Run the fetch cron to ingest content.</div>;
  }

  const getTitle = (article: Article) => {
    return locale === "zh" && article.title_zh ? article.title_zh : article.title;
  };

  const getSummary = (article: Article) => {
    return locale === "zh" && article.summary_zh ? article.summary_zh : article.summary;
  };

  return (
    <div className="articles-grid">
      {articles.map((article) => (
        <Link className="article-card" href={`/articles/${article.id}`} key={article.id}>
          <span className="source-pill">{article.source}</span>
          <h3>{getTitle(article)}</h3>
          <p>{getSummary(article)}</p>
          <div className="meta-row">
            <span>{formatDistanceToNowStrict(new Date(article.publishedAt), { addSuffix: true })}</span>
            <span>Read more</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
