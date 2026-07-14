import { generateChatResponse } from "@/lib/llm";
import { type DiagnosticAnswers } from "@/lib/diagnostic";
import { PRODUCTS } from "@/lib/products";
import { NextResponse } from "next/server";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function sanitize(value: string): string {
  return value.trim().slice(0, 1000);
}

export async function POST(request: Request) {
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

  const reply = await generateChatResponse(message, product, answers);

  if (!reply) {
    return NextResponse.json(
      { error: "The concierge is unavailable right now. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json({ reply });
}
