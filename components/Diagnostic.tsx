"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DIAGNOSTIC_QUESTIONS,
  generateTransitionQuip,
  scoreAnswers,
  type DiagnosticAnswers,
} from "@/lib/diagnostic";
import {
  deriveAnswersFromFactReview,
  buildFollowUpFromScanResult,
} from "@/lib/site-scan/signals";
import type { FactReviewStatus, ScanFact, ScanResult } from "@/lib/site-scan/types";
import type { BaseProject } from "@/lib/products";
import { ShareReportPanel } from "@/components/ShareReportPanel";

const EMAIL = "hello@persidian.com";

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function smoothScrollToElement(id: string, offset = 80, duration = 1200) {
  if (typeof window === "undefined") return;
  const element = document.getElementById(id);
  if (!element) return;

  const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    window.scrollTo({ top: startY + diff * ease, behavior: "instant" });
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

interface DiagnosticResult {
  product: BaseProject | null;
  reasoning: string;
  agentSays: string;
  confidence: "high" | "medium" | "low";
  scores: { key: string; name: string; percentage: number; score: number }[];
}

interface DiagnosticProps {
  accent?: string;
}

type Flow =
  | "url-input"
  | "scanning"
  | "review"
  | "followup"
  | "manual"
  | "transition";

export function Diagnostic({ accent }: DiagnosticProps) {
  const [flow, setFlow] = useState<Flow>("url-input");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");
  const [factStatuses, setFactStatuses] = useState<Record<string, FactReviewStatus>>({});

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState("");
  const [transition, setTransition] = useState<{ show: boolean; quip: string }>({
    show: false,
    quip: "",
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("time-payoff-active");
    };
  }, []);

  const question = DIAGNOSTIC_QUESTIONS[step];
  const isLast = step === DIAGNOSTIC_QUESTIONS.length - 1;
  const liveScores = useMemo(() => scoreAnswers(answers), [answers]);

  const currentAnswer = answers[question?.id as keyof DiagnosticAnswers] as
    | string
    | string[]
    | undefined;

  const runScan = async () => {
    setScanError("");
    setFlow("scanning");

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      });
      const data = (await response.json()) as ScanResult & { error?: string };

      if (!response.ok) {
        setScanError(data.error || "Could not scan that website.");
        setFlow("url-input");
        return;
      }

      setScanResult(data);
      setFactStatuses(
        Object.fromEntries(
          data.facts
            .filter((f) => f.kind !== "unknown")
            .map((f) => [f.id, "unsure" as FactReviewStatus])
        )
      );
      setAnswers({});
      setFlow("review");
    } catch {
      setScanError("Network error. Please check your connection and try again.");
      setFlow("url-input");
    }
  };

  const submit = async (answersOverride?: DiagnosticAnswers) => {
    const payload = answersOverride ?? answers;
    if (!payload.role && !payload.painPoints?.length && !payload.tools?.length) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as DiagnosticResult & { error?: string };
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const finishWithTransition = async (payload: DiagnosticAnswers) => {
    setTransition({
      show: true,
      quip: generateTransitionQuip(payload.timeline),
    });
    document.documentElement.classList.add("time-payoff-active");
    await Promise.all([submit(payload), wait(1400)]);
    setTransition({ show: false, quip: "" });
    document.documentElement.classList.remove("time-payoff-active");
  };

  const handleManualSelect = async (value: string) => {
    setError("");
    if (question.type === "single") {
      const nextAnswers: DiagnosticAnswers = { ...answers, [question.id]: value };
      setAnswers(nextAnswers);
      if (isLast) {
        setFlow("transition");
        await finishWithTransition(nextAnswers);
      } else {
        setStep((s) => s + 1);
      }
    } else {
      setAnswers((prev) => {
        const arr = ((prev[question.id as keyof DiagnosticAnswers] as string[]) ?? []);
        const next = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
        return { ...prev, [question.id]: next };
      });
    }
  };

  const canAdvance =
    question &&
    (question.type === "single"
      ? typeof currentAnswer === "string"
      : Array.isArray(currentAnswer) && currentAnswer.length > 0);

  const handleManualNext = async () => {
    if (!canAdvance) return;
    if (isLast) {
      setFlow("transition");
      await finishWithTransition(answers);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleFollowUp = async (option: string) => {
    const painMap: Record<string, string> = {
      "Overdue invoices and receivables": "Late invoices & unpaid receivables",
      "Currency exposure across markets": "Cross-currency FX drag",
      "Prospecting and outreach effort": "Low reply rates on cold outreach",
      "Grant milestone verification backlog":
        "Grant milestones claimed but tranche stuck in review",
      "Data quality and metadata trust": "Data nobody reads or trusts",
      "Commit-level security signals":
        "Code changes that affect consensus or security",
    };

    const pain = painMap[option] ?? option;
    const nextAnswers: DiagnosticAnswers = {
      ...answers,
      painPoints: [...new Set([...(answers.painPoints ?? []), pain])],
      timeline: answers.timeline ?? "This quarter",
    };
    setAnswers(nextAnswers);
    setFlow("transition");
    await finishWithTransition(nextAnswers);
  };

  const reset = () => {
    setFlow("url-input");
    setWebsiteUrl("");
    setScanResult(null);
    setScanError("");
    setFactStatuses({});
    setStep(0);
    setAnswers({});
    setResult(null);
    setError("");
  };

  if (result) {
    return (
      <ResultView
        result={result}
        answers={answers}
        scanResult={scanResult}
        factStatuses={factStatuses}
        path={scanResult ? "url" : "manual"}
        accent={accent}
        liveScores={liveScores}
        onRestart={reset}
        cardRef={cardRef}
      />
    );
  }

  if (transition.show) {
    return <TransitionCard cardRef={cardRef} quip={transition.quip} />;
  }

  if (flow === "url-input") {
    return (
      <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter>
        <p className="section-kicker text-muted mb-3">Business X-ray</p>
        <label htmlFor="company-url" className="block text-sm text-muted mb-2">
          Enter your company website
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="company-url"
            type="url"
            inputMode="url"
            placeholder="https://yourcompany.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="flex-1 min-w-0 rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors"
          />
          <button
            type="button"
            onClick={runScan}
            disabled={!websiteUrl.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform disabled:opacity-40"
            style={accent ? { backgroundColor: accent } : undefined}
          >
            Run the X-ray →
          </button>
        </div>
        <p className="mt-4 text-xs text-muted leading-relaxed">
          We read the submitted public page only. No login, no changes, no email required. You review every inference.{" "}
          <Link href="/trust" className="underline underline-offset-4 hover:text-foreground transition-colors">
            How scanning works
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            setFlow("manual");
            setStep(0);
          }}
          className="mt-5 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          No website, or prefer not to share it? Answer four questions instead →
        </button>
        {scanError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {scanError}
          </p>
        )}
      </div>
    );
  }

  if (flow === "scanning") {
    return (
      <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter>
        <p className="section-kicker text-muted mb-5">Analyzing {websiteUrl}</p>
        <p className="text-sm text-muted mb-6">
          Reading the submitted public page and extracting cited facts.
        </p>
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    );
  }

  if (flow === "review" && scanResult) {
    return (
      <FactsReview
        cardRef={cardRef}
        scanResult={scanResult}
        factStatuses={factStatuses}
        onSetStatus={(id, status) =>
          setFactStatuses((prev) => ({ ...prev, [id]: status }))
        }
        onContinue={() => {
          const derived = deriveAnswersFromFactReview(scanResult.facts, factStatuses);
          setAnswers(derived);
          setFlow("followup");
        }}
        onBack={() => setFlow("url-input")}
      />
    );
  }

  if (flow === "followup" && scanResult) {
    const q =
      buildFollowUpFromScanResult(scanResult, answers) ?? scanResult.followUpQuestion;
    if (!q) return null;
    return (
      <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter>
        <p className="section-kicker text-muted mb-3">One question we cannot infer</p>
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight mb-5">
          {q.label}
        </h3>
        <div className="flex flex-wrap gap-2">
          {q.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleFollowUp(option)}
              className="px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFlow("review")}
          className="mt-6 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Back to findings
        </button>
      </div>
    );
  }

  if (flow === "manual") {
    return (
      <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter aria-busy={loading}>
        <div className="flex items-center justify-between mb-6">
          <p className="section-kicker text-muted">
            Question {step + 1} / {DIAGNOSTIC_QUESTIONS.length}
          </p>
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => setFlow("url-input")}
              className="text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              Use website instead
            </button>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight mb-5">
          {question.label}
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {question.options.map((option) => {
            const selected =
              question.type === "single"
                ? currentAnswer === option
                : Array.isArray(currentAnswer) && currentAnswer.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleManualSelect(option)}
                className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-foreground hover:border-foreground/30"
                }`}
                aria-pressed={selected}
              >
                {option}
              </button>
            );
          })}
        </div>

        {question.type === "multi" && (
          <button
            type="button"
            onClick={handleManualNext}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform disabled:opacity-40"
            style={accent ? { backgroundColor: accent } : undefined}
          >
            {isLast ? "Show result" : "Next"}
          </button>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {step >= 1 && (
          <ScoreBoard
            scores={liveScores}
            className="mt-10 pt-8 border-t border-border"
            showTooltips
          />
        )}
      </div>
    );
  }

  return null;
}

function FactsReview({
  cardRef,
  scanResult,
  factStatuses,
  onSetStatus,
  onContinue,
  onBack,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  scanResult: ScanResult;
  factStatuses: Record<string, FactReviewStatus>;
  onSetStatus: (id: string, status: FactReviewStatus) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const groups: { title: string; kind: ScanFact["kind"] }[] = [
    { title: "What we found", kind: "found" },
    { title: "What we inferred", kind: "inferred" },
    { title: "What we cannot know", kind: "unknown" },
  ];

  const statusButton = (factId: string, status: FactReviewStatus, label: string) => {
    const active = factStatuses[factId] === status;
    return (
      <button
        key={status}
        type="button"
        onClick={() => onSetStatus(factId, status)}
        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
          active ? "border-foreground text-foreground" : "border-border text-muted"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter>
      <p className="section-kicker text-muted mb-2">Review findings</p>
      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight mb-1">
        {scanResult.title ?? scanResult.domain}
      </h3>
      {scanResult.description && (
        <p className="text-sm text-muted mb-6">{scanResult.description}</p>
      )}

      <div className="space-y-6">
        {groups.map(({ title, kind }) => {
          const items = scanResult.facts.filter((f) => f.kind === kind);
          if (!items.length) return null;
          return (
            <section key={kind}>
              <p className="section-label text-muted mb-3">{title}</p>
              <ul className="space-y-3">
                {items.map((fact) => (
                  <li key={fact.id} className="rounded-xl border border-border p-4">
                    <p className="text-sm leading-relaxed">{fact.text}</p>
                    {kind !== "unknown" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {statusButton(fact.id, "confirmed", "Confirmed")}
                        {statusButton(fact.id, "incorrect", "Incorrect")}
                        {statusButton(fact.id, "unsure", "Unsure")}
                      </div>
                    )}
                    {fact.sources.length > 0 && (
                      <p className="mt-2 text-xs text-muted">
                        Sources:{" "}
                        {fact.sources.map((s, i) => (
                          <span key={s.url}>
                            {i > 0 && ", "}
                            <a
                              href={s.url}
                              className="underline underline-offset-4 hover:text-foreground transition-colors"
                              rel="noopener noreferrer"
                            >
                              {s.label}
                            </a>
                          </span>
                        ))}
                        {fact.confidence !== "high" && ` · Confidence: ${fact.confidence}`}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
        >
          Continue →
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          Try a different URL
        </button>
      </div>
    </div>
  );
}

function ScoreBoard({
  scores,
  className = "",
  limit,
  showTooltips = false,
}: {
  scores: ReturnType<typeof scoreAnswers>;
  className?: string;
  limit?: number;
  showTooltips?: boolean;
}) {
  const displayScores = limit ? scores.slice(0, limit).filter((s) => s.score > 0) : scores;
  const maxScore = Math.max(1, ...displayScores.map((s) => s.score));
  return (
    <div className={className}>
      <p className="section-label text-muted mb-4">Live risk fit</p>
      <div className="space-y-3">
        {displayScores.map((s) => (
          <div
            key={s.key}
            className="space-y-1"
            title={showTooltips ? s.product.tagline : undefined}
          >
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="font-mono text-muted">{s.percentage}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(2, (s.score / maxScore) * 100)}%`,
                  backgroundColor: s.product.accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultView({
  result,
  answers,
  scanResult,
  factStatuses,
  path,
  accent,
  liveScores,
  onRestart,
  cardRef,
}: {
  result: DiagnosticResult;
  answers: DiagnosticAnswers;
  scanResult: ScanResult | null;
  factStatuses: Record<string, FactReviewStatus>;
  path: "url" | "manual";
  accent?: string;
  liveScores: ReturnType<typeof scoreAnswers>;
  onRestart: () => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const product = result.product;

  const confidenceLabel: Record<string, string> = {
    high: "High-confidence match",
    medium: "Solid match",
    low: "Possible match",
  };

  return (
    <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter>
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="section-kicker text-muted">Recommendation</p>
        {product && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] sm:text-xs font-medium uppercase tracking-wider"
            style={{ borderColor: product.accent, color: product.accent }}
          >
            {confidenceLabel[result.confidence] ?? "Match"}
          </span>
        )}
      </div>

      {scanResult && (
        <p className="text-xs text-muted mb-4">
          Based on public signals from {scanResult.domain}
          {scanResult.escalatedToBrowser ? " (browser-assisted read)" : ""}.
        </p>
      )}

      {product ? (
        <div className="space-y-5">
          <div
            className="rounded-2xl border border-border p-5 sm:p-6"
            style={{ borderTop: `3px solid ${product.accent}` }}
          >
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
              {product.name}{" "}
              <span className="text-muted">— {product.thesisLabel}</span>
            </h3>
            <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
              {product.tagline}
            </p>
          </div>

          <div
            className="rounded-xl bg-border/30 p-5 border-l-4"
            style={{ borderLeftColor: product.accent }}
          >
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Why this fits
            </p>
            <p className="text-foreground font-medium leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {result.agentSays && (
            <ChatPanel
              product={product}
              answers={answers}
              accent={accent}
              initialMessage={result.agentSays}
              className="rounded-2xl border border-border bg-border/20 p-4 sm:p-5"
            />
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => smoothScrollToElement("contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
              style={{ backgroundColor: accent || product.accent }}
            >
              Book a demo →
            </button>
            <Link
              href={product.entityHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
            >
              See proof
            </Link>
            <a
              href={product.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
            >
              Visit {product.name}
            </a>
            <button
              type="button"
              onClick={onRestart}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Start over
            </button>
          </div>

          <ScoreBoard
            scores={liveScores}
            className="pt-6 border-t border-border"
            limit={3}
            showTooltips
          />

          <ShareReportPanel
            answers={answers}
            scanResult={
              scanResult
                ? { url: scanResult.url, domain: scanResult.domain, facts: scanResult.facts }
                : null
            }
            factStatuses={factStatuses}
            path={path}
          />
        </div>
      ) : (
        <>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
            No single product is a clear match yet.
          </h3>
          <p className="mt-2 text-muted leading-relaxed">{result.reasoning}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => smoothScrollToElement("contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
            >
              Book a demo →
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Start over
            </button>
          </div>

          <ShareReportPanel
            answers={answers}
            scanResult={null}
            factStatuses={factStatuses}
            path={path}
          />
        </>
      )}

      <p className="mt-6 text-xs text-muted">
        Or email directly at{" "}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
      </p>
    </div>
  );
}

function ChatPanel({
  product,
  answers,
  accent,
  initialMessage,
  className = "",
}: {
  product: BaseProject;
  answers: DiagnosticAnswers;
  accent?: string;
  initialMessage?: string;
  className?: string;
}) {
  const MESSAGE_LIMIT = 10;

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >(initialMessage ? [{ role: "assistant", content: initialMessage }] : []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const limitReached = messages.length >= MESSAGE_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || limitReached) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          answers,
          productKey: product.iconName,
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        throw new Error(data.error || "No response");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't reach the concierge. Please try again or email hello@persidian.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <p className="section-label text-muted mb-4">Ask the concierge</p>
      {messages.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-3 mb-4 pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm ${
                m.role === "user" ? "font-medium text-foreground" : "text-muted"
              }`}
            >
              <span className="font-mono text-xs uppercase tracking-wider text-muted mr-2">
                {m.role === "user" ? "You" : "Concierge"}
              </span>
              {m.content}
            </div>
          ))}
          {loading && <p className="text-sm text-muted">Concierge is typing...</p>}
          <div ref={messagesEndRef} />
        </div>
      )}
      {limitReached ? (
        <p className="text-sm text-muted leading-relaxed">
          You have reached the concierge message limit. Want to keep going?{" "}
          <a
            href={`mailto:${EMAIL}?subject=Persidian follow-up`}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Email hello@persidian.com
          </a>{" "}
          or book a demo above.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to know about this recommendation?"
            className="flex-1 min-w-0 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform disabled:opacity-40"
            style={accent ? { backgroundColor: accent } : undefined}
          >
            Ask →
          </button>
        </form>
      )}
      <p className="mt-3 text-xs text-muted">
        We only use what you share to arrange a demo. No spam, no third parties.
      </p>
    </div>
  );
}

function TransitionCard({
  cardRef,
  quip,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  quip: string;
}) {
  return (
    <div ref={cardRef} className="rounded-2xl border border-border bg-background p-6 sm:p-8" data-enter>
      <div className="flex flex-col items-center justify-center py-10 sm:py-14 text-center">
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight max-w-md">
          {quip}
        </p>
        <p className="mt-4 text-sm text-muted">Asking the concierge...</p>
        <div className="mt-6 h-1 w-24 rounded-full bg-border overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
