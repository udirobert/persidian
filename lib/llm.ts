import { getMatchedSignals, type DiagnosticAnswers, type ProductScore } from "./diagnostic";
import type { BaseProject } from "./products";

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "tencent/hy3:free";
const SITE_URL = process.env.OPENROUTER_SITE_URL || "https://persidian.com";
const SITE_NAME = process.env.OPENROUTER_SITE_NAME || "Persidian";

function buildPrompt(
  answers: DiagnosticAnswers,
  product: BaseProject,
  top: ProductScore,
  runnerUp: ProductScore | undefined
): string {
  const matches = getMatchedSignals(answers, top.key);

  const runnerUpLine = runnerUp
    ? `Runner-up: ${runnerUp.product.name} (${runnerUp.percentage}% fit).`
    : "";

  return `You are Persidian's business concierge. Based on a short diagnostic, write one concise, confident sentence (max 30 words) explaining why ${product.name} is the best-fit Persidian agent for this business. Mention the specific signals that matched. Do not ask follow-up questions. Return only the sentence.

Product: ${product.name} — ${product.thesisLabel}
Tagline: ${product.tagline}

Diagnostic answers:
- Function: ${answers.role || "not provided"}
- Pain points: ${(answers.painPoints ?? []).join(", ") || "not provided"}
- Tools: ${(answers.tools ?? []).join(", ") || "not provided"}
- Timeline: ${answers.timeline || "not provided"}

Matched signals for ${product.name}:
- Role: ${matches.role || "none"}
- Pain points: ${matches.pains.join(", ") || "none"}
- Tools: ${matches.tools.join(", ") || "none"}

Fit score: ${top.percentage}%. ${runnerUpLine}`;
}

export async function generateReasoning(
  answers: DiagnosticAnswers,
  product: BaseProject,
  top: ProductScore,
  runnerUp: ProductScore | undefined
): Promise<string | null> {
  if (!API_KEY) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You write concise, confident product-fit explanations for Persidian's business concierge. One sentence, max 30 words. Mention specific signals. No questions.",
          },
          {
            role: "user",
            content: buildPrompt(answers, product, top, runnerUp),
          },
        ],
        max_tokens: 80,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch {
    return null;
  }
}
