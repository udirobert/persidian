import {
  DIAGNOSTIC_QUESTIONS,
  recommend,
  generateAgentSays,
  type DiagnosticAnswers,
} from "@/lib/diagnostic";
import type {
  CreateReportInput,
  StoredRecommendation,
} from "@/lib/reports/types";
import type { FactReviewStatus, ScanFact } from "@/lib/site-scan/types";
import { deriveAnswersFromFactReview } from "@/lib/site-scan/signals";
import { validatePublicUrl, UrlValidationError } from "@/lib/site-scan/url";

const MAX_BODY_BYTES = 32_768;
const MAX_FACTS = 30;
const MAX_FACT_TEXT = 500;
const MAX_SOURCE_URL = 500;
const MAX_SOURCE_LABEL = 100;
const MAX_SOURCES = 5;

const ROLE_OPTIONS = new Set(
  DIAGNOSTIC_QUESTIONS.find((q) => q.id === "role")?.options ?? []
);
const PAIN_OPTIONS = new Set(
  DIAGNOSTIC_QUESTIONS.find((q) => q.id === "painPoints")?.options ?? []
);
const TOOL_OPTIONS = new Set(
  DIAGNOSTIC_QUESTIONS.find((q) => q.id === "tools")?.options ?? []
);
const TIMELINE_OPTIONS = new Set(
  DIAGNOSTIC_QUESTIONS.find((q) => q.id === "timeline")?.options ?? []
);

const VALID_STATUSES = new Set<FactReviewStatus>(["confirmed", "incorrect", "unsure"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeText(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeFact(raw: unknown): ScanFact | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== "string" || !/^[a-z0-9-]{1,64}$/i.test(raw.id)) return null;
  if (raw.kind !== "found" && raw.kind !== "inferred" && raw.kind !== "unknown") return null;
  if (typeof raw.text !== "string") return null;
  if (raw.confidence !== "high" && raw.confidence !== "medium" && raw.confidence !== "low") {
    return null;
  }

  const sources = Array.isArray(raw.sources)
    ? raw.sources
        .slice(0, MAX_SOURCES)
        .map((source) => {
          if (!isRecord(source)) return null;
          if (typeof source.label !== "string" || typeof source.url !== "string") return null;
          if (!isHttpUrl(source.url)) return null;
          return {
            label: sanitizeText(source.label, MAX_SOURCE_LABEL),
            url: sanitizeText(source.url, MAX_SOURCE_URL),
            quote:
              typeof source.quote === "string"
                ? sanitizeText(source.quote, 240)
                : undefined,
          };
        })
        .filter(Boolean) as ScanFact["sources"]
    : [];

  return {
    id: raw.id,
    kind: raw.kind,
    text: sanitizeText(raw.text, MAX_FACT_TEXT),
    confidence: raw.confidence,
    sources,
  };
}

function sanitizeFactStatuses(
  raw: unknown,
  factIds: Set<string>
): Record<string, FactReviewStatus> {
  if (!isRecord(raw)) return {};
  const statuses: Record<string, FactReviewStatus> = {};
  for (const [id, status] of Object.entries(raw)) {
    if (!factIds.has(id)) continue;
    if (typeof status === "string" && VALID_STATUSES.has(status as FactReviewStatus)) {
      statuses[id] = status as FactReviewStatus;
    }
  }
  return statuses;
}

function sanitizeAnswers(raw: unknown): DiagnosticAnswers | null {
  if (!isRecord(raw)) return null;
  const answers: DiagnosticAnswers = {};

  if (typeof raw.role === "string") {
    const role = sanitizeText(raw.role, 120);
    if (!ROLE_OPTIONS.has(role)) return null;
    answers.role = role;
  }

  if (Array.isArray(raw.painPoints)) {
    const pains = raw.painPoints
      .filter((p): p is string => typeof p === "string")
      .map((p) => sanitizeText(p, 120))
      .filter((p) => PAIN_OPTIONS.has(p));
    if (pains.length) answers.painPoints = [...new Set(pains)].slice(0, 6);
  }

  if (Array.isArray(raw.tools)) {
    const tools = raw.tools
      .filter((t): t is string => typeof t === "string")
      .map((t) => sanitizeText(t, 120))
      .filter((t) => TOOL_OPTIONS.has(t));
    if (tools.length) answers.tools = [...new Set(tools)].slice(0, 6);
  }

  if (typeof raw.timeline === "string") {
    const timeline = sanitizeText(raw.timeline, 80);
    if (!TIMELINE_OPTIONS.has(timeline)) return null;
    answers.timeline = timeline;
  }

  return answers;
}

export class ReportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportValidationError";
  }
}

export async function parseCreateReportRequest(
  body: unknown
): Promise<CreateReportInput> {
  if (!isRecord(body) || body.consent !== true) {
    throw new ReportValidationError("Consent is required to save a report");
  }

  const path = body.path === "manual" ? "manual" : body.path === "url" ? "url" : null;
  if (!path) {
    throw new ReportValidationError("Invalid report path");
  }

  const facts = Array.isArray(body.facts)
    ? body.facts
        .slice(0, MAX_FACTS)
        .map(sanitizeFact)
        .filter(Boolean) as ScanFact[]
    : [];

  const factIds = new Set(facts.map((f) => f.id));
  const factStatuses = sanitizeFactStatuses(body.factStatuses, factIds);

  let answers: DiagnosticAnswers;
  if (path === "url") {
    answers = deriveAnswersFromFactReview(facts, factStatuses);
    const manualAnswers = sanitizeAnswers(body.answers);
    if (manualAnswers?.timeline) answers.timeline = manualAnswers.timeline;
    if (manualAnswers?.painPoints?.length) {
      answers.painPoints = [
        ...new Set([...(answers.painPoints ?? []), ...manualAnswers.painPoints]),
      ];
    }
  } else {
    const manualAnswers = sanitizeAnswers(body.answers);
    if (!manualAnswers) {
      throw new ReportValidationError("Valid diagnostic answers are required");
    }
    answers = manualAnswers;
  }

  if (!answers.role && !answers.painPoints?.length && !answers.tools?.length) {
    throw new ReportValidationError("At least one confirmed diagnostic signal is required");
  }

  let scannedUrl: string | undefined;
  let scanDomain: string | undefined;

  if (typeof body.scannedUrl === "string" && body.scannedUrl.trim()) {
    try {
      const parsed = await validatePublicUrl(body.scannedUrl.trim());
      scannedUrl = parsed.toString();
      scanDomain = parsed.hostname;
    } catch (error) {
      if (error instanceof UrlValidationError) {
        throw new ReportValidationError(error.message);
      }
      throw error;
    }
  } else if (typeof body.scanDomain === "string") {
    scanDomain = sanitizeText(body.scanDomain, 200);
  }

  const email = typeof body.email === "string" ? body.email : undefined;

  return {
    consent: true,
    email,
    path,
    scannedUrl,
    scanDomain,
    facts,
    factStatuses,
    answers,
  };
}

export function buildStoredRecommendation(
  answers: DiagnosticAnswers
): StoredRecommendation {
  const result = recommend(answers);
  const product = result.product;

  return {
    productSlug: product?.slug ?? null,
    productName: product?.name ?? null,
    thesisLabel: product?.thesisLabel ?? null,
    tagline: product?.tagline ?? null,
    entityHref: product?.entityHref ?? null,
    productHref: product?.href ?? null,
    accent: product?.accent ?? null,
    reasoning: result.reasoning,
    agentSays: product ? generateAgentSays(answers, product, result.confidence) : "",
    confidence: result.confidence,
    scores: result.scores.map((s) => ({
      key: s.key,
      name: s.name,
      percentage: s.percentage,
      score: s.score,
    })),
  };
}

export function confirmedFactIdsFromStatuses(
  statuses: Record<string, FactReviewStatus>
): string[] {
  return Object.entries(statuses)
    .filter(([, status]) => status === "confirmed")
    .map(([id]) => id);
}

export function assertBodySize(rawBody: string): void {
  if (rawBody.length > MAX_BODY_BYTES) {
    throw new ReportValidationError("Request body is too large");
  }
}
