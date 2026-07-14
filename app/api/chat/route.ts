import { generateChatResponse, toShortReply } from "@/lib/llm";
import { type DiagnosticAnswers } from "@/lib/diagnostic";
import { PRODUCTS } from "@/lib/products";
import { getClientIp, RateLimiter } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const chatLimiter = new RateLimiter(20, 60 * 1000);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function sanitize(value: string): string {
  return value.trim().slice(0, 1000);
}

function isDemoIntent(message: string): boolean {
  return /\b(demo|book|schedule|walkthrough|call|meeting|interested|set up|sign up|talk|speak|contact|reach out)\b/i.test(
    message
  );
}

function demoReply(productName?: string): string {
  return `Happy to arrange a ${productName ?? "Persidian"} demo. Share your name, email, company, and role, and the Persidian team will reach out to book a time that works for you.`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = chatLimiter.allow(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
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

  const raw = body as Record<string, unknown>;

  const message =
    typeof raw.message === "string" ? sanitize(raw.message) : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const answers: DiagnosticAnswers = {};
  if (typeof raw.role === "string") answers.role = sanitize(raw.role);
  if (isStringArray(raw.painPoints)) {
    answers.painPoints = raw.painPoints.map(sanitize);
  }
  if (isStringArray(raw.tools)) {
    answers.tools = raw.tools.map(sanitize);
  }
  if (typeof raw.timeline === "string") answers.timeline = sanitize(raw.timeline);

  const productKey = typeof raw.productKey === "string" ? raw.productKey : "";
  const product = PRODUCTS.find(
    (p) => p.iconName === productKey || p.name.toLowerCase() === productKey.toLowerCase()
  ) ?? null;

  if (isDemoIntent(message)) {
    return NextResponse.json({ reply: demoReply(product?.name) });
  }

  const rawReply = await generateChatResponse(message, product, answers);

  if (!rawReply) {
    return NextResponse.json(
      { error: "The concierge is unavailable right now. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json({ reply: toShortReply(rawReply) });
}
