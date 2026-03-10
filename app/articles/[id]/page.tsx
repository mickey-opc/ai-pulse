import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { format } from "date-fns";
import { fetchArticleById } from "@/lib/data";

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Get locale from cookie header
  const cookieHeader = headers().get("cookie") || "";
  const localeCookie = cookieHeader.split(";").find(c => c.trim().startsWith("locale="));
  const lang = (localeCookie ? localeCookie.split("=")[1] : "en") as "en" | "zh";
  
  const labels = lang === "zh" 
    ? { published: "发布于", openOriginal: "查看原文", backToFeed: "返回列表" }
    : { published: "Published", openOriginal: "Open original", backToFeed: "Back to feed" };

  const title = lang === "zh" && article.title_zh ? article.title_zh : article.title;
  const summary = lang === "zh" && article.summary_zh ? article.summary_zh : article.summary;

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
            background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            zIndex: 50
          }}
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
      </form>
      <div className="detail-card">
        <span className="eyebrow">{article.source}</span>
        <h1>{title}</h1>
        <p className="meta">{labels.published} {format(new Date(article.publishedAt), "PPP p")}</p>
        <p className="summary">{summary}</p>
        <div className="link-row">
          <a className="cta-button" href={article.url} target="_blank" rel="noreferrer">
            {labels.openOriginal}
          </a>
          <Link className="ghost-link" href="/">
            {labels.backToFeed}
          </Link>
        </div>
      </div>
    </main>
  );
}
