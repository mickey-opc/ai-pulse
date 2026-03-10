import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { ArticleGrid } from "@/components/article-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <main className="shell">
      <LanguageSwitcher />
      <div className="frame">
        <section className="hero">
          <div className="hero-card">
            <span className="eyebrow">{t("subtitle")}</span>
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroDescription")}</p>
            <div className="hero-stats">
              <div className="stat">
                <strong>{articles.length}</strong>
                {t("latestArticles")}
              </div>
              <div className="stat">
                <strong>{sourceCount}</strong>
                {t("activeSources")}
              </div>
            </div>
          </div>
          <aside className="hero-card aside-card">
            <h2>{t("emailBrief")}</h2>
            <p>{t("emailDescription")}</p>
            <SubscribeForm />
          </aside>
        </section>

        <section className="panel" style={{ padding: 24 }}>
          <div className="section-header">
            <div>
              <h2>{t("latestSignal")}</h2>
              <p>{t("filterDescription")}</p>
            </div>
            <div className="filter-bar">
              <Link className="ghost-link" href="/">
                {t("allSources")}
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
          <ArticleGrid articles={articles} locale={locale} />
        </section>
        <p className="footer-note">{t("footerNote")}</p>
      </div>
    </main>
  );
}
