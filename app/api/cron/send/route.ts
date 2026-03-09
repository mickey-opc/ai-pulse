import { NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/cron";
import { fetchDigestArticles } from "@/lib/data";
import { listSubscribers } from "@/lib/subscribers";
import { sendDigestEmail } from "@/lib/email";

export async function GET(request: Request) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [articles, subscribers] = await Promise.all([fetchDigestArticles(), listSubscribers()]);

  if (articles.length === 0 || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, reason: "No articles or subscribers" });
  }

  await sendDigestEmail(subscribers.map((item) => item.email), articles);

  return NextResponse.json({
    sent: subscribers.length,
    articles: articles.length
  });
}
