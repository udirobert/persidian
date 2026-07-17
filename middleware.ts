import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AI_CRAWLERS = [
  "OAI-SearchBot",
  "Claude-SearchBot",
  "Claude-User",
  "GPTBot",
  "ClaudeBot",
  "Googlebot",
  "bingbot",
  "Applebot",
  "PerplexityBot",
] as const;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const matched = AI_CRAWLERS.find((bot) => userAgent.includes(bot));

  if (matched) {
    console.log(
      JSON.stringify({
        event: "crawler_visit",
        bot: matched,
        path: request.nextUrl.pathname,
        method: request.method,
        timestamp: new Date().toISOString(),
      })
    );
  }

  const response = NextResponse.next();
  if (matched) {
    response.headers.set("X-Persidian-Crawler-Logged", matched);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|opengraph-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
