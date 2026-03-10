import Link from "next/link";
import { ArticleGrid } from "@/components/article-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageProvider } from "@/components/LanguageProvider";
import { fetchArticles } from "@/lib/data";
import HomeClient from "./HomeClient";

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
    <LanguageProvider>
      <HomeClient 
        articles={articles} 
        sourceCount={sourceCount} 
      />
    </LanguageProvider>
  );
}
