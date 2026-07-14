import {
  recommend,
  generateAgentSays,
  type DiagnosticAnswers,
} from "@/lib/diagnostic";
import { generateReasoning } from "@/lib/llm";
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

  let agentSays = "";
  if (result.product) {
    const llmReasoning = await generateReasoning(
      answers,
      result.product,
      result.scores[0],
      result.scores[1]
    );
    if (llmReasoning) {
      result.reasoning = llmReasoning;
    }
    agentSays = generateAgentSays(answers, result.product, result.confidence);
  }

  return NextResponse.json({
    product: result.product,
    reasoning: result.reasoning,
    agentSays,
    confidence: result.confidence,
    scores: result.scores.map((s) => ({
      key: s.key,
      name: s.name,
      percentage: s.percentage,
      score: s.score,
    })),
  });
}
