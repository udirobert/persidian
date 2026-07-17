import { createReport } from "@/lib/reports/store";
import type { CreateReportInput } from "@/lib/reports/types";
import { getClientIp, RateLimiter } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const reportLimiter = new RateLimiter(5, 60 * 1000);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCreateInput(body: unknown): CreateReportInput | null {
  if (!isRecord(body) || body.consent !== true) return null;

  const raw = body as Record<string, unknown>;
  if (!isRecord(raw.answers) || !isRecord(raw.recommendation)) return null;

  const answers = raw.answers as CreateReportInput["answers"];
  const recommendation = raw.recommendation as unknown as CreateReportInput["recommendation"];

  if (
    typeof recommendation.reasoning !== "string" ||
    typeof recommendation.confidence !== "string"
  ) {
    return null;
  }

  const path = raw.path === "manual" ? "manual" : raw.path === "url" ? "url" : null;
  if (!path) return null;

  return {
    consent: true,
    email: typeof raw.email === "string" ? raw.email : undefined,
    path,
    scannedUrl: typeof raw.scannedUrl === "string" ? raw.scannedUrl : undefined,
    scanDomain: typeof raw.scanDomain === "string" ? raw.scanDomain : undefined,
    facts: Array.isArray(raw.facts) ? (raw.facts as CreateReportInput["facts"]) : [],
    confirmedFactIds: Array.isArray(raw.confirmedFactIds)
      ? raw.confirmedFactIds.filter((id): id is string => typeof id === "string")
      : [],
    answers,
    recommendation,
  };
}

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = parseCreateInput(body);
  if (!input) {
    return NextResponse.json(
      { error: "Consent and a valid report payload are required" },
      { status: 400 }
    );
  }

  const result = await createReport(input);
  return NextResponse.json(result);
}
