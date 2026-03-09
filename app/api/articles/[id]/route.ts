import { NextResponse } from "next/server";
import { fetchArticleById } from "@/lib/data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
}
