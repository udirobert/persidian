import { scanWebsite, UrlValidationError } from "@/lib/site-scan";
import { checkTargetDomainScanLimit } from "@/lib/site-scan/limits";
import { getClientIp, RateLimiter } from "@/lib/rate-limit";
import { validatePublicUrl } from "@/lib/site-scan/url";
import { NextResponse } from "next/server";

const scanLimiter = new RateLimiter(8, 60 * 1000);

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = scanLimiter.allow(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many scan requests. Please try again in a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = typeof (body as { url?: unknown }).url === "string" ? (body as { url: string }).url.trim() : "";
  if (!url) {
    return NextResponse.json({ error: "A company website URL is required" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = await validatePublicUrl(url.startsWith("http") ? url : `https://${url}`);
  } catch (error) {
    if (error instanceof UrlValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not validate that URL" }, { status: 400 });
  }

  const domainLimit = checkTargetDomainScanLimit(parsed.hostname);
  if (!domainLimit.allowed) {
    return NextResponse.json(
      { error: "This website was scanned recently. Please wait before scanning it again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(domainLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

  try {
    const result = await scanWebsite(parsed.toString());
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UrlValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Could not scan that website";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
