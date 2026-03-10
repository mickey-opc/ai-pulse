import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { format } from "date-fns";
import { fetchArticleById } from "@/lib/data";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageProvider } from "@/components/LanguageProvider";

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Get locale from cookie
  const cookieHeader = headers().get("cookie") || "";
  const localeCookie = cookieHeader.split(";").find(c => c.trim().startsWith("locale="));
  const locale = localeCookie ? localeCookie.split("=")[1] : "en";
  
  const title = locale === "zh" && article.title_zh ? article.title_zh : article.title;
  const summary = locale === "zh" && article.summary_zh ? article.summary_zh : article.summary;

  const labels = locale === "zh" 
    ? { published: "发布于", openOriginal: "查看原文", backToFeed: "返回列表" }
    : { published: "Published", openOriginal: "Open original", backToFeed: "Back to feed" };

  return (
    <LanguageProvider>
      <main className="shell">
        <LanguageSwitcher />
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
    </LanguageProvider>
  );
}
