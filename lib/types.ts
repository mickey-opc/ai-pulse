export type Source = "twitter" | "waytoagi" | "openai" | "anthropic" | "yahoo-finance";

export type Article = {
  id: string;
  title: string;
  title_zh?: string;
  url: string;
  source: Source;
  summary: string;
  summary_zh?: string;
  publishedAt: string;
  createdAt: string;
};

export type Subscriber = {
  id: string;
  email: string;
  verified: boolean;
  createdAt: string;
};

export type IngestArticle = Omit<Article, "id" | "createdAt">;
