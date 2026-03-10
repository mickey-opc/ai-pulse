"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import type { Article } from "@/lib/types";

const translations = {
  en: {
    heroTitle: "Track the AI web every five hours.",
    heroDescription: "AI Pulse aggregates the most relevant updates from X/Twitter mirrors, waytoagi, OpenAI, and Anthropic into a single fast feed built for operators, founders, and researchers.",
    latestArticles: "Latest articles",
    activeSources: "Active sources",
    emailBrief: "Email brief",
    emailDescription: "Subscribe for a daily digest while the crawler refreshes the database every five hours.",
    latestSignal: "Latest signal",
    filterDescription: "Sorted by publish time. Filter by source without leaving the page.",
    allSources: "All sources",
    footerNote: "Cron schedule: fetch every 5 hours, email digest daily at 08:00 UTC.",
  },
  zh: {
    heroTitle: "每五小时追踪AI动态",
    heroDescription: "AI Pulse 聚合了 X/Twitter、waytoagi、OpenAI 和 Anthropic 的最新资讯，为创业者、研究者打造的高效信息流。",
    latestArticles: "最新文章",
    activeSources: "活跃来源",
    emailBrief: "邮件简报",
    emailDescription: "订阅每日简报，爬虫每5小时刷新数据库",
    latestSignal: "最新资讯",
    filterDescription: "按发布时间排序，可按来源筛选",
    allSources: "全部来源",
    footerNote: "爬虫：每5小时抓取，邮件简报：每天 08:00 UTC",
  }
};

function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const [lang, setLang] = useState(currentLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLang = (newLang: string) => {
    setLang(newLang);
    document.cookie = `locale=${newLang}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8, zIndex: 50 }}>
      <button 
        onClick={() => switchLang("en")}
        style={{ 
          background: lang === "en" ? "#000" : "transparent", 
          color: lang === "en" ? "#fff" : "#000",
          border: "1px solid #000",
          padding: "4px 12px",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 14
        }}
      >
        EN
      </button>
      <button 
        onClick={() => switchLang("zh")}
        style={{ 
          background: lang === "zh" ? "#000" : "transparent", 
          color: lang === "zh" ? "#fff" : "#000",
          border: "1px solid #000",
          padding: "4px 12px",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 14
        }}
      >
        中文
      </button>
    </div>
  );
}

export default function HomeClient({ articles, sourceCount, initialLang }: { articles: Article[]; sourceCount: number; initialLang: string }) {
  const [language, setLanguage] = useState(initialLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get language from cookie
    const cookies = document.cookie.split("; ");
    const localeCookie = cookies.find(c => c.startsWith("locale="));
    if (localeCookie) {
      const lang = localeCookie.split("=")[1];
      if (lang === "zh" || lang === "en") {
        setLanguage(lang);
      }
    }
    setMounted(true);
  }, []);

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  const getTitle = (article: Article) => {
    return language === "zh" && article.title_zh ? article.title_zh : article.title;
  };

  const getSummary = (article: Article) => {
    return language === "zh" && article.summary_zh ? article.summary_zh : article.summary;
  };

  // Return a simple loading state until mounted
  if (!mounted) {
    return (
      <main className="shell">
        <div className="frame">
          <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <LanguageSwitcher currentLang={language} />
      <div className="frame">
        <section className="hero">
          <div className="hero-card">
            <span className="eyebrow">{language === "zh" ? "AI 资讯" : "AI Pulse"}</span>
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
        </section>

        <section className="panel" style={{ padding: 24 }}>
          <div className="section-header">
            <div>
              <h2>{t("latestSignal")}</h2>
              <p>{t("filterDescription")}</p>
            </div>
            <div className="filter-bar">
              <Link className="ghost-link" href="/">{t("allSources")}</Link>
              <Link className="ghost-link" href="/?source=twitter">Twitter/X</Link>
              <Link className="ghost-link" href="/?source=waytoagi">waytoagi</Link>
              <Link className="ghost-link" href="/?source=openai">OpenAI</Link>
              <Link className="ghost-link" href="/?source=anthropic">Anthropic</Link>
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
        <p className="footer-note">{t("footerNote")}</p>
      </div>
    </main>
  );
}
