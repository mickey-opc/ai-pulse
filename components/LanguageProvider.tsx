"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

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
    noArticles: "No articles yet. Run the fetch cron to ingest content.",
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
    noArticles: "暂无文章，请运行爬虫获取内容",
    footerNote: "爬虫：每5小时抓取，邮件简报：每天 08:00 UTC",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get language from cookie on client side
    const cookies = document.cookie.split("; ");
    const localeCookie = cookies.find(c => c.startsWith("locale="));
    if (localeCookie) {
      const lang = localeCookie.split("=")[1] as Language;
      if (lang === "zh" || lang === "en") {
        setLanguageState(lang);
      }
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `locale=${lang}; path=/; max-age=31536000`;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  // Return placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
