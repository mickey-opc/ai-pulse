import { env } from "@/lib/env";

export function checkCronSecret(request: Request) {
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.replace("Bearer ", "");
  const headerSecret = request.headers.get("x-cron-secret");
  const secret = bearer ?? headerSecret;

  return secret === env.CRON_SECRET;
}
