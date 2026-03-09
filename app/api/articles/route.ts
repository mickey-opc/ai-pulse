import { NextResponse } from "next/server";
import { fetchArticles } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "50");
  const articles = await fetchArticles(source, Number.isNaN(limit) ? 50 : limit);

  return NextResponse.json({ articles });
}
