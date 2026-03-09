import Link from "next/link";
import { ArticleGrid } from "@/components/article-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { fetchArticles } from "@/lib/data";

export const revalidate = 300;

export default async function HomePage({
  searchParams
}: {
  searchParams?: { source?: string };
}) {
  const selectedSource = searchParams?.source;
  const articles = await fetchArticles(selectedSource);
  const sourceCount = new Set(articles.map((article) => article.source)).size;

  return (
    <main className="shell">
      <div className="frame">
        <section className="hero">
          <div className="hero-card">
            <span className="eyebrow">AI Pulse / Global feed</span>
            <h1>Track the AI web every five hours.</h1>
            <p>
              AI Pulse aggregates the most relevant updates from X/Twitter mirrors, waytoagi,
              OpenAI, and Anthropic into a single fast feed built for operators, founders, and
              researchers.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <strong>{articles.length}</strong>
                Latest articles
              </div>
              <div className="stat">
                <strong>{sourceCount}</strong>
                Active sources
              </div>
            </div>
          </div>
          <aside className="hero-card aside-card">
            <h2>Email brief</h2>
            <p>
              Subscribe for a daily digest while the crawler refreshes the database every five
              hours.
            </p>
            <SubscribeForm />
          </aside>
        </section>

        <section className="panel" style={{ padding: 24 }}>
          <div className="section-header">
            <div>
              <h2>Latest signal</h2>
              <p>Sorted by publish time. Filter by source without leaving the page.</p>
            </div>
            <div className="filter-bar">
              <Link className="ghost-link" href="/">
                All sources
              </Link>
              <Link className="ghost-link" href="/?source=twitter">
                Twitter/X
              </Link>
              <Link className="ghost-link" href="/?source=waytoagi">
                waytoagi
              </Link>
              <Link className="ghost-link" href="/?source=openai">
                OpenAI
              </Link>
              <Link className="ghost-link" href="/?source=anthropic">
                Anthropic
              </Link>
            </div>
          </div>
          <ArticleGrid articles={articles} />
        </section>
        <p className="footer-note">
          Cron schedule: fetch every 5 hours, email digest daily at 08:00 UTC.
        </p>
      </div>
    </main>
  );
}
