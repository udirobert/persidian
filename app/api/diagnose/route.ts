import {
  recommend,
  generateAgentSays,
  type DiagnosticAnswers,
} from "@/lib/diagnostic";
import { withCacheAndDedupe } from "@/lib/cache";
import { generateReasoning } from "@/lib/llm";
import { getClientIp, RateLimiter } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const diagnoseLimiter = new RateLimiter(10, 60 * 1000);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function sanitize(value: string): string {
  return value.trim().slice(0, 200);
}

function parseAnswers(body: unknown): DiagnosticAnswers | null {
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
    return null;
  }

  return answers;
}

interface DiagnoseResponse {
  product: ReturnType<typeof recommend>["product"];
  reasoning: string;
  agentSays: string;
  confidence: "high" | "medium" | "low";
  scores: {
    key: string;
    name: string;
    percentage: number;
    score: number;
  }[];
}

async function performDiagnose(answers: DiagnosticAnswers): Promise<DiagnoseResponse> {
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

  return {
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
  };
}

const cachedDiagnose = withCacheAndDedupe<DiagnosticAnswers, DiagnoseResponse>(
  performDiagnose,
  { maxSize: 500, ttlMs: 5 * 60 * 1000 }
);

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = diagnoseLimiter.allow(ip);
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

  const answers = parseAnswers(body);
  if (!answers) {
    return NextResponse.json(
      { error: "At least one diagnostic signal is required" },
      { status: 400 }
    );
  }

  const result = await cachedDiagnose(answers);
  return NextResponse.json(result);
}
