"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { Article } from "@/lib/types";

function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const [lang, setLang] = useState(currentLang);

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

export default function ArticleDetailClient({ article, initialLang }: { article: Article; initialLang: string }) {
  const [language, setLanguage] = useState(initialLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

  const labels = language === "zh" 
    ? { published: "发布于", openOriginal: "查看原文", backToFeed: "返回列表" }
    : { published: "Published", openOriginal: "Open original", backToFeed: "Back to feed" };

  const title = language === "zh" && article.title_zh ? article.title_zh : article.title;
  const summary = language === "zh" && article.summary_zh ? article.summary_zh : article.summary;

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
