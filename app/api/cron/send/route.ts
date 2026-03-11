import { NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/cron";
import { listSubscribers } from "@/lib/subscribers";
import { sendDigestEmail } from "@/lib/email";
import {
  acquireSendCronLock,
  fetchPendingArticlesForSubscriber,
  recordArticleDeliveries,
  releaseSendCronLock
} from "@/lib/email-deliveries";

export async function GET(request: Request) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locked = await acquireSendCronLock();

  if (!locked) {
    return NextResponse.json({ sent: 0, reason: "Send already in progress" });
  }

  try {
    const subscribers = await listSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json({ sent: 0, reason: "No subscribers" });
    }

    let sent = 0;
    let deliveredArticles = 0;

    for (const subscriber of subscribers) {
      const articles = await fetchPendingArticlesForSubscriber(subscriber.id);

      if (articles.length === 0) {
        continue;
      }

      const result = await sendDigestEmail([subscriber.email], articles);

      if ((result as { error?: unknown }).error) {
        throw new Error(`Failed to send digest to ${subscriber.email}`);
      }

      await recordArticleDeliveries(
        subscriber.id,
        articles.map((article) => article.id)
      );

      sent += 1;
      deliveredArticles += articles.length;
    }

    return NextResponse.json({
      sent,
      articles: deliveredArticles,
      reason: sent === 0 ? "No new articles to send" : undefined
    });
  } finally {
    await releaseSendCronLock();
  }
}
