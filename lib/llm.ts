import {
  getMatchedSignals,
  type DiagnosticAnswers,
  type ProductScore,
} from "./diagnostic";
import type { BaseProject } from "./products";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

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

async function callOpenRouter(
  messages: LLMMessage[],
  maxTokens = 120
): Promise<string | null> {
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
          messages,
          max_tokens: maxTokens,
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

async function callNvidia(
  messages: LLMMessage[],
  maxTokens = 120
): Promise<string | null> {
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
        messages,
        max_tokens: maxTokens,
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

export async function callLLM(
  messages: LLMMessage[],
  maxTokens = 120
): Promise<string | null> {
  return (await callOpenRouter(messages, maxTokens)) || callNvidia(messages, maxTokens);
}

function buildReasoningPrompt(
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
  const prompt = buildReasoningPrompt(answers, product, top, runnerUp);

  return callLLM([
    {
      role: "system",
      content:
        "You write concise, confident product-fit explanations for Persidian's business concierge. One sentence, max 30 words. Mention specific signals. No questions.",
    },
    { role: "user", content: prompt },
  ]);
}

export function sanitizeChatReply(reply: string): string {
  return reply
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^[\-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/\n+/g, " ")
    .trim();
}

export function toShortReply(reply: string, maxChars = 280): string {
  const cleaned = sanitizeChatReply(reply);
  if (cleaned.length <= maxChars) return cleaned;
  const truncated = cleaned.slice(0, maxChars);
  const lastPeriod = truncated.lastIndexOf(".");
  return lastPeriod > 0
    ? truncated.slice(0, lastPeriod + 1)
    : truncated.trimEnd() + "…";
}

export async function generateChatResponse(
  message: string,
  product: BaseProject | null,
  answers: DiagnosticAnswers
): Promise<string | null> {
  const productContext = product
    ? `Recommended product: ${product.name} — ${product.thesisLabel}. Short description: ${product.tagline}. Product page: ${product.href}`
    : "No specific product was recommended yet.";

  const diagnosticContext = `- Function: ${answers.role || "not provided"}
- Pain points: ${(answers.painPoints ?? []).join(", ") || "not provided"}
- Tools: ${(answers.tools ?? []).join(", ") || "not provided"}
- Timeline: ${answers.timeline || "not provided"}`;

  return callLLM(
    [
      {
        role: "system",
        content: `You are Persidian's business concierge. You help a visitor understand which Persidian agent fits their business.

Rules:
- Be concise: reply in 1-3 short sentences. Never use Markdown (no **bold**, no bullet points, no headings).
- Do not repeat the product description from the prompt.
- If they ask about the product, explain the fit in plain language.
- When they show interest in a demo, do NOT ask for a preferred date/time. Instead, collect their contact details (name, email, company, role) so the Persidian team can reach out to arrange a time that suits them.
- If asked something unrelated to Persidian or its products, politely decline and redirect to Persidian.

${productContext}

Diagnostic context:
${diagnosticContext}`,
      },
      { role: "user", content: message },
    ],
    180
  );
}
