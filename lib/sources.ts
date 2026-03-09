import type { IngestArticle, Source } from "@/lib/types";
import { env } from "@/lib/env";

type FeedDefinition = {
  source: Source;
  url: string;
  parser: (responseText: string) => IngestArticle[];
};

function stripTags(input: string) {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractRssItems(xml: string, source: Source) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  return items.slice(0, 8).map((match) => {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] ??
      block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[2] ??
      "Untitled";
    const url = block.match(/<link>(.*?)<\/link>/)?.[1] ?? "";
    const summaryRaw =
      block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[1] ??
      block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[2] ??
      "";
    const publishedAt =
      block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ??
      block.match(/<dc:date>(.*?)<\/dc:date>/)?.[1] ??
      new Date().toISOString();

    return {
      title: stripTags(title),
      url: url.trim(),
      source,
      summary: stripTags(summaryRaw).slice(0, 280),
      publishedAt: new Date(publishedAt).toISOString()
    };
  });
}

const feeds: FeedDefinition[] = [
  {
    source: "openai",
    url: "https://openai.com/news/rss.xml",
    parser: (text) => extractRssItems(text, "openai")
  },
];

async function fetchAnthropicArticles() {
  const response = await fetch("https://www.anthropic.com/news", {
    headers: {
      "User-Agent": "AI Pulse Bot/1.0"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    return [];
  }

  const html = await response.text();
  const slugs = [...new Set([...html.matchAll(/\/news\/([a-z0-9-]+)/g)].map((match) => match[1]))]
    .filter((slug) => slug !== "not-found")
    .slice(0, 8);

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const articleUrl = `https://www.anthropic.com/news/${slug}`;

      try {
        const articleResponse = await fetch(articleUrl, {
          headers: {
            "User-Agent": "AI Pulse Bot/1.0"
          },
          next: { revalidate: 0 }
        });

        if (!articleResponse.ok) {
          return null;
        }

        const articleHtml = await articleResponse.text();
        const title =
          articleHtml.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ??
          articleHtml.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/\s*\\ Anthropic$/, "") ??
          titleFromSlug(slug);
        const summary =
          articleHtml.match(/<meta name="description" content="([^"]+)"/)?.[1] ??
          `Anthropic update: ${titleFromSlug(slug)}`;
        const publishedAt =
          articleHtml.match(/"datePublished":"([^"]+)"/)?.[1] ??
          new Date().toISOString();

        return {
          title: stripTags(title),
          url: articleUrl,
          source: "anthropic" as const,
          summary: stripTags(summary).slice(0, 280),
          publishedAt: new Date(publishedAt).toISOString()
        };
      } catch {
        return null;
      }
    })
  );

  return items.filter((item): item is IngestArticle => item !== null);
}

async function fetchWaytoagiArticles() {
  const response = await fetch("https://www.waytoagi.com", {
    headers: {
      "User-Agent": "AI Pulse Bot/1.0"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    return [];
  }

  const html = await response.text();
  const matches = [
    ...html.matchAll(
      /<a[^>]+href="(https:\/\/blog\.waytoagi\.com\/article\/news-(\d{8}))"[^>]*>([\s\S]*?)<\/a>/g
    )
  ].slice(0, 8);

  return matches.map((match) => {
    const [, url, dateCode, content] = match;
    const summary = stripTags(content);
    const year = dateCode.slice(0, 4);
    const month = dateCode.slice(4, 6);
    const day = dateCode.slice(6, 8);

    return {
      title: summary.split(/\s{2,}| {2,}/)[0].slice(0, 120) || `WaytoAGI update ${dateCode}`,
      url,
      source: "waytoagi" as const,
      summary: summary.slice(0, 280),
      publishedAt: new Date(`${year}-${month}-${day}T08:00:00.000Z`).toISOString()
    };
  });
}

async function fetchTwitterArticles() {
  const urls = env.TWITTER_RSS_URLS.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "AI Pulse Bot/1.0"
        },
        next: { revalidate: 0 }
      });

      if (!response.ok) {
        continue;
      }

      const text = await response.text();
      const items = extractRssItems(text, "twitter").filter((article) => article.url && article.title);

      if (items.length > 0) {
        return items;
      }
    } catch {
      continue;
    }
  }

  return [];
}

export async function fetchAllSources(): Promise<IngestArticle[]> {
  const rssResults = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: {
            "User-Agent": "AI Pulse Bot/1.0"
          },
          next: { revalidate: 0 }
        });

        if (!response.ok) {
          return [];
        }

        const text = await response.text();
        return feed.parser(text).filter((article) => article.url && article.title);
      } catch {
        return [];
      }
    })
  );

  const [anthropicArticles, waytoagiArticles, twitterArticles] = await Promise.all([
    fetchAnthropicArticles(),
    fetchWaytoagiArticles(),
    fetchTwitterArticles()
  ]);

  return [...rssResults.flat(), ...anthropicArticles, ...waytoagiArticles, ...twitterArticles];
}
