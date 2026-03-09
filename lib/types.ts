export type Source = "twitter" | "waytoagi" | "openai" | "anthropic";

export type Article = {
  id: string;
  title: string;
  url: string;
  source: Source;
  summary: string;
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
