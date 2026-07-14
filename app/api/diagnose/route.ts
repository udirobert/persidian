import { recommend, type DiagnosticAnswers } from "@/lib/diagnostic";
import { NextResponse } from "next/server";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function sanitize(value: string): string {
  return value.trim().slice(0, 200);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  const answers: DiagnosticAnswers = {};

  if (typeof raw.role === "string") {
    answers.role = sanitize(raw.role);
  }

  if (isStringArray(raw.painPoints)) {
    answers.painPoints = raw.painPoints.map(sanitize);
  }

  if (isStringArray(raw.tools)) {
    answers.tools = raw.tools.map(sanitize);
  }

  if (typeof raw.timeline === "string") {
    answers.timeline = sanitize(raw.timeline);
  }

  if (!answers.role && !answers.painPoints?.length && !answers.tools?.length) {
    return NextResponse.json(
      { error: "At least one diagnostic signal is required" },
      { status: 400 }
    );
  }

  const result = recommend(answers);

  return NextResponse.json({
    product: result.product,
    reasoning: result.reasoning,
    confidence: result.confidence,
    scores: result.scores.map((s) => ({
      key: s.key,
      name: s.name,
      percentage: s.percentage,
      score: s.score,
    })),
  });
}
