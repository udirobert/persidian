import { createReport } from "@/lib/reports/store";
import {
  assertBodySize,
  parseCreateReportRequest,
  ReportValidationError,
} from "@/lib/reports/validate";
import { ReportPersistenceError } from "@/lib/reports/types";
import { getClientIp, RateLimiter } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const reportLimiter = new RateLimiter(5, 60 * 1000);

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = reportLimiter.allow(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many report requests. Please try again in a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)),
        },
      }
    );
  }

  const rawBody = await request.text();
  assertBodySize(rawBody);

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const input = await parseCreateReportRequest(body);
    const result = await createReport(input);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ReportValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof ReportPersistenceError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not save report" }, { status: 500 });
  }
}
