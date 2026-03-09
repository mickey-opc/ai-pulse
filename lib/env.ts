import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  CRON_SECRET: z.string().min(1).default("dev-secret"),
  RESEND_API_KEY: z.string().optional(),
  RESEND_AUDIENCE_FROM: z.string().email().optional(),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  TWITTER_NITTER_BASE: z.string().url().default("https://nitter.poast.org"),
  TWITTER_RSS_URLS: z.string().default("https://nitter.poast.org/OpenAI/rss,https://xcancel.com/OpenAI/rss")
});

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  CRON_SECRET: process.env.CRON_SECRET ?? "dev-secret",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_AUDIENCE_FROM: process.env.RESEND_AUDIENCE_FROM,
  SITE_URL: process.env.SITE_URL ?? "http://localhost:3000",
  TWITTER_NITTER_BASE: process.env.TWITTER_NITTER_BASE ?? "https://nitter.poast.org",
  TWITTER_RSS_URLS:
    process.env.TWITTER_RSS_URLS ??
    "https://nitter.poast.org/OpenAI/rss,https://xcancel.com/OpenAI/rss"
};

export function validateEnv() {
  return envSchema.parse(env);
}
