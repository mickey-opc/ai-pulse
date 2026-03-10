import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { fetchArticleById } from "@/lib/data";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const t = await getTranslations({ locale, namespace: "ArticleDetail" });

  const title = locale === "zh" && article.title_zh ? article.title_zh : article.title;
  const summary = locale === "zh" && article.summary_zh ? article.summary_zh : article.summary;

  return (
    <main className="shell">
      <LanguageSwitcher />
      <div className="detail-card">
        <span className="eyebrow">{article.source}</span>
        <h1>{title}</h1>
        <p className="meta">{t("published")} {format(new Date(article.publishedAt), "PPP p")}</p>
        <p className="summary">{summary}</p>
        <div className="link-row">
          <a className="cta-button" href={article.url} target="_blank" rel="noreferrer">
            {t("openOriginal")}
          </a>
          <Link className="ghost-link" href="/">
            {t("backToFeed")}
          </Link>
        </div>
      </div>
    </main>
  );
}
