import {
  getMatchedSignals,
  type DiagnosticAnswers,
  type ProductScore,
} from "./diagnostic";
import type { BaseProject } from "./products";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "tencent/hy3";
const OPENROUTER_SITE_URL =
  process.env.OPENROUTER_SITE_URL || "https://persidian.com";
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || "Persidian";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL =
  process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";
const NVIDIA_BASE_URL =
  process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

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

async function callOpenRouter(prompt: string): Promise<string | null> {
  if (!OPENROUTER_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": OPENROUTER_SITE_URL,
          "X-Title": OPENROUTER_SITE_NAME,
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You write concise, confident product-fit explanations for Persidian's business concierge. One sentence, max 30 words. Mention specific signals. No questions.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 80,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };

    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

async function callNvidia(prompt: string): Promise<string | null> {
  if (!NVIDIA_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You write concise, confident product-fit explanations for Persidian's business concierge. One sentence, max 30 words. Mention specific signals. No questions.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 80,
        temperature: 0.7,
        top_p: 0.9,
        chat_template_kwargs: { enable_thinking: false },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };

    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function generateReasoning(
  answers: DiagnosticAnswers,
  product: BaseProject,
  top: ProductScore,
  runnerUp: ProductScore | undefined
): Promise<string | null> {
  const prompt = buildPrompt(answers, product, top, runnerUp);

  const openRouterContent = await callOpenRouter(prompt);
  if (openRouterContent) return openRouterContent;

  return callNvidia(prompt);
}
