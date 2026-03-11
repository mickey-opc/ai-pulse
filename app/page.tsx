import Link from "next/link";
import { cookies } from "next/headers";
import { formatDistanceToNowStrict } from "date-fns";
import { fetchArticles } from "@/lib/data";
import { SubscribeForm } from "@/components/subscribe-form";
import type { Article } from "@/lib/types";

export const revalidate = 300;

const translations = {
  en: {
    heroTitle: "Track the AI web every five hours.",
    heroDescription: "AI Pulse aggregates the most relevant updates from X/Twitter mirrors, waytoagi, OpenAI, and Anthropic into a single fast feed built for operators, founders, and researchers.",
    latestArticles: "Latest articles",
    activeSources: "Active sources",
    emailBrief: "Email brief",
    emailDescription: "Subscribe for new-article email updates every hour while the crawler refreshes the database every five hours.",
    latestSignal: "Latest signal",
    filterDescription: "Sorted by publish time. Filter by source without leaving the page.",
    allSources: "All sources",
    footerNote: "Cron schedule: fetch every 5 hours, email notifications every hour.",
  },
  zh: {
    heroTitle: "每五小时追踪AI动态",
    heroDescription: "AI Pulse 聚合了 X/Twitter、waytoagi、OpenAI 和 Anthropic 的最新资讯，为创业者、研究者打造的高效信息流。",
    latestArticles: "最新文章",
    activeSources: "活跃来源",
    emailBrief: "邮件简报",
    emailDescription: "订阅每1小时发送的新文章邮件提醒，爬虫每5小时刷新数据库",
    latestSignal: "最新资讯",
    filterDescription: "按发布时间排序，可按来源筛选",
    allSources: "全部来源",
    footerNote: "爬虫：每5小时抓取，邮件提醒：每1小时运行一次",
  }
};

export default async function HomePage({
  searchParams
}: {
  searchParams?: { source?: string };
}) {
  const selectedSource = searchParams?.source;
  const articles = await fetchArticles(selectedSource);
  const sourceCount = new Set(articles.map((article) => article.source)).size;

  // Get locale from cookie
  const cookieStore = cookies();
  const localeCookie = cookieStore.get("locale");
  const lang = (localeCookie?.value || "en") as "en" | "zh";
  
  const t = translations[lang];
  
  const getTitle = (article: Article) => {
    return lang === "zh" && article.title_zh ? article.title_zh : article.title;
  };

  const getSummary = (article: Article) => {
    return lang === "zh" && article.summary_zh ? article.summary_zh : article.summary;
  };

  return (
    <main className="shell">
      <form action="/api/set-locale" method="POST">
        <input type="hidden" name="locale" value={lang === "en" ? "zh" : "en"} />
        <button
          type="submit"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "6px 14px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 14,
            zIndex: 50
          }}
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
      </form>
      <div className="frame">
        <section className="hero">
          <div className="hero-card">
            <span className="eyebrow">{lang === "zh" ? "AI 资讯" : "AI Pulse"}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroDescription}</p>
            <div className="hero-stats">
              <div className="stat">
                <strong>{articles.length}</strong>
                {t.latestArticles}
              </div>
              <div className="stat">
                <strong>{sourceCount}</strong>
                {t.activeSources}
              </div>
            </div>
          </div>
          <aside className="hero-card aside-card">
            <h2>{t.emailBrief}</h2>
            <p>{t.emailDescription}</p>
            <SubscribeForm />
          </aside>
        </section>

        <section className="panel" style={{ padding: 24 }}>
          <div className="section-header">
            <div>
              <h2>{t.latestSignal}</h2>
              <p>{t.filterDescription}</p>
            </div>
            <div className="filter-bar">
              <Link className="ghost-link" href="/">{t.allSources}</Link>
              <Link className="ghost-link" href="/?source=twitter">Twitter/X</Link>
              <Link className="ghost-link" href="/?source=waytoagi">waytoagi</Link>
              <Link className="ghost-link" href="/?source=openai">OpenAI</Link>
              <Link className="ghost-link" href="/?source=anthropic">Anthropic</Link>
              <Link className="ghost-link" href="/?source=techcrunch">TechCrunch</Link>
            </div>
          </div>
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
        </section>
        <p className="footer-note">{t.footerNote}</p>
      </div>
    </main>
  );
}
