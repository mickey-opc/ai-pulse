import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fetchArticleById } from "@/lib/data";

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <main className="shell">
      <div className="detail-card">
        <span className="eyebrow">{article.source}</span>
        <h1>{article.title}</h1>
        <p className="meta">Published {format(new Date(article.publishedAt), "PPP p")}</p>
        <p className="summary">{article.summary}</p>
        <div className="link-row">
          <a className="cta-button" href={article.url} target="_blank" rel="noreferrer">
            Open original
          </a>
          <Link className="ghost-link" href="/">
            Back to feed
          </Link>
        </div>
      </div>
    </main>
  );
}
