import { NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/cron";
import { fetchAllSources } from "@/lib/sources";
import { upsertArticles } from "@/lib/articles";

export async function GET(request: Request) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await fetchAllSources();
  const inserted = await upsertArticles(articles);

  return NextResponse.json({
    fetched: articles.length,
    inserted
  });
}
