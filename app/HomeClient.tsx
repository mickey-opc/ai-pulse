"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ArticleGrid } from "@/components/article-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Article } from "@/lib/types";

interface HomeClientProps {
  articles: Article[];
  sourceCount: number;
}

export default function HomeClient({ articles, sourceCount }: HomeClientProps) {
  const { language, t } = useLanguage();

  const getSourceLabel = (source: string) => {
    const labels: Record<string, Record<string, string>> = {
      twitter: { en: "Twitter/X", zh: "Twitter/X" },
      waytoagi: { en: "waytoagi", zh: "waytoagi" },
      openai: { en: "OpenAI", zh: "OpenAI" },
      anthropic: { en: "Anthropic", zh: "Anthropic" },
    };
    return labels[source]?.[language] || source;
  };

  return (
    <main className="shell">
      <LanguageSwitcher />
      <div className="frame">
        <section className="hero">
          <div className="hero-card">
            <span className="eyebrow">
              {language === "zh" ? "AI 资讯" : "AI Pulse"}
            </span>
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
          <ArticleGrid articles={articles} locale={language} />
        </section>
        <p className="footer-note">{t("footerNote")}</p>
      </div>
    </main>
  );
}
