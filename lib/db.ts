import postgres from "postgres";
import { env } from "@/lib/env";

let client: postgres.Sql | null = null;

export function getSql() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!client) {
    client = postgres(env.DATABASE_URL, {
      ssl: "require",
      prepare: false
    });
  }

  return client;
}
