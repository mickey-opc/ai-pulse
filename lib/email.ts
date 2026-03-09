import { Resend } from "@resend/node";
import type { Article } from "@/lib/types";
import { env } from "@/lib/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function buildDigestHtml(articles: Article[]) {
  const items = articles
    .map(
      (article) =>
        `<li><strong>${article.source.toUpperCase()}</strong> - <a href="${article.url}">${article.title}</a><br/>${article.summary}</li>`
    )
    .join("");

  return `<h1>AI Pulse Digest</h1><p>Latest AI updates from the last 24 hours.</p><ul>${items}</ul>`;
}

export async function sendDigestEmail(to: string[], articles: Article[]) {
  if (!resend || !env.RESEND_AUDIENCE_FROM) {
    return { skipped: true };
  }

  return resend.emails.send({
    from: env.RESEND_AUDIENCE_FROM,
    to,
    subject: `AI Pulse digest: ${articles.length} updates`,
    html: buildDigestHtml(articles)
  });
}
