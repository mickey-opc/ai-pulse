import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = formData.get("locale") as string;
  
  const response = NextResponse.redirect(new URL("/", request.url));
  
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  
  return response;
}
