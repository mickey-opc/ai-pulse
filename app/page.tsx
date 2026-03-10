import { headers } from "next/headers";
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

  // Get initial locale from cookie header
  const cookieHeader = headers().get("cookie") || "";
  const localeCookie = cookieHeader.split(";").find(c => c.trim().startsWith("locale="));
  const initialLang = localeCookie ? localeCookie.split("=")[1] : "en";

  return (
    <HomeClient 
      articles={articles} 
      sourceCount={sourceCount}
      initialLang={initialLang}
    />
  );
}
