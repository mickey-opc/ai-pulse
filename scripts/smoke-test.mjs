const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

for (const path of ["/api/articles", "/api/cron/fetch", "/api/cron/send"]) {
  const headers =
    path.startsWith("/api/cron/")
      ? {
          "x-cron-secret": process.env.CRON_SECRET ?? "dev-secret"
        }
      : {};

  const response = await fetch(`${baseUrl}${path}`, { headers });
  console.log(path, response.status);
}
