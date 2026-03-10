import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { fetchArticleById } from "@/lib/data";
import ArticleDetailClient from "./ArticleDetailClient";

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Get locale from cookie header
  const cookieHeader = headers().get("cookie") || "";
  const localeCookie = cookieHeader.split(";").find(c => c.trim().startsWith("locale="));
  const initialLang = localeCookie ? localeCookie.split("=")[1] : "en";

  return (
    <ArticleDetailClient article={article} initialLang={initialLang} />
  );
}
