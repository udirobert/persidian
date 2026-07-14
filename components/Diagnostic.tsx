"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DIAGNOSTIC_QUESTIONS, scoreAnswers, type DiagnosticAnswers } from "@/lib/diagnostic";
import type { BaseProject } from "@/lib/products";

const EMAIL = "hello@persidian.com";

interface DiagnosticResult {
  product: BaseProject | null;
  reasoning: string;
  confidence: "high" | "medium" | "low";
  scores: { key: string; name: string; percentage: number; score: number }[];
}

interface DiagnosticProps {
  accent?: string;
}

export function Diagnostic({ accent }: DiagnosticProps) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [started, step, result]);

  const question = DIAGNOSTIC_QUESTIONS[step];
  const isLast = step === DIAGNOSTIC_QUESTIONS.length - 1;

  const liveScores = useMemo(() => scoreAnswers(answers), [answers]);

  const currentAnswer = answers[question.id as keyof DiagnosticAnswers] as
    | string
    | string[]
    | undefined;

  const handleSelect = (value: string) => {
    setError("");
    if (question.type === "single") {
      const nextAnswers: DiagnosticAnswers = { ...answers, [question.id]: value };
      setAnswers(nextAnswers);
      if (isLast) {
        submit(nextAnswers);
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
    question.type === "single"
      ? typeof currentAnswer === "string"
      : Array.isArray(currentAnswer) && currentAnswer.length > 0;

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLast) {
      submit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
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

  const reset = () => {
    setStarted(false);
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
        accent={accent}
        liveScores={liveScores}
        onRestart={reset}
        cardRef={cardRef}
      />
    );
  }

  if (!started) {
    return (
      <div
        ref={cardRef}
        className="rounded-2xl border border-border bg-background p-6 sm:p-8"
        data-enter
      >
        <p className="section-kicker text-muted mb-3">Business X-ray</p>
        <p className="text-muted leading-relaxed">
          Tell us what hurts. We will surface the Persidian agent that fixes it.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
            style={accent ? { backgroundColor: accent } : undefined}
          >
            Start the X-ray →
          </button>
          <span className="text-sm text-muted">Takes ~30 seconds</span>
        </div>
        <p className="mt-4 text-xs text-muted">
          Prefer email?{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {EMAIL}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-border bg-background p-6 sm:p-8"
      data-enter
      aria-busy={loading}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="section-kicker text-muted">
          Question {step + 1} / {DIAGNOSTIC_QUESTIONS.length}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="text-xs font-medium text-muted hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
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
              onClick={() => handleSelect(option)}
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
          onClick={handleNext}
          disabled={!canAdvance}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform disabled:opacity-40 disabled:active:scale-100"
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

      <div aria-live="polite" className="sr-only">
        {loading ? "Analyzing your answers..." : ""}
      </div>

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

function getNudge(
  product: BaseProject,
  answers: DiagnosticAnswers,
  confidence: "high" | "medium" | "low"
): string {
  const role = answers.role?.split("/")[0]?.trim().toLowerCase() ?? "your";
  const confidenceClause =
    confidence === "high"
      ? `This is a high-confidence match for ${role} teams.`
      : `This is a ${confidence}-confidence match for ${role} teams.`;

  switch (answers.timeline) {
    case "Now":
      return `${confidenceClause} Because you want to act now, a 15-minute ${product.name} demo this week is the fastest way to stop ${product.thesisLabel.toLowerCase()} from compounding.`;
    case "This quarter":
      return `${confidenceClause} Teams with this profile usually pilot ${product.name} within 30 days.`;
    case "Later / exploring":
      return `${confidenceClause} No rush — the ${product.name} case below is the best next step, and you can book a demo when you are ready.`;
    default:
      return `${confidenceClause} A short demo is the best way to see if ${product.name} fits your workflow.`;
  }
}

function ResultView({
  result,
  answers,
  accent,
  liveScores,
  onRestart,
  cardRef,
}: {
  result: DiagnosticResult;
  answers: DiagnosticAnswers;
  accent?: string;
  liveScores: ReturnType<typeof scoreAnswers>;
  onRestart: () => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const product = result.product;
  const nudge = product ? getNudge(product, answers, result.confidence) : null;

  const confidenceLabel: Record<string, string> = {
    high: "High-confidence match",
    medium: "Solid match",
    low: "Possible match",
  };

  const mailtoSubject = product
    ? `Persidian demo — ${product.name}`
    : "Persidian demo request";
  const mailtoBody = product
    ? `Hi Persidian team,\n\nThe Business X-ray pointed me toward ${product.name}. I'd like to book a demo.\n\nReasoning: ${result.reasoning}`
    : "Hi Persidian team,\n\nI'd like to discuss which Persidian product fits my business.";
  const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(
    mailtoSubject
  )}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-border bg-background p-6 sm:p-8"
      data-enter
    >
      <p className="section-kicker text-muted mb-3">
        Recommendation
        {product && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-border text-[10px] sm:text-xs font-medium uppercase tracking-wider">
            {confidenceLabel[result.confidence] ?? "Match"}
          </span>
        )}
      </p>

      {product ? (
        <>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
            {product.name} — {product.thesisLabel}
          </h3>
          <p className="mt-2 text-muted leading-relaxed">{product.tagline}</p>
          <p className="mt-4 text-foreground font-medium leading-relaxed">
            {result.reasoning}
          </p>
          {nudge && (
            <p className="mt-3 text-sm text-muted leading-relaxed">{nudge}</p>
          )}
        </>
      ) : (
        <>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
            No single product is a clear match yet.
          </h3>
          <p className="mt-2 text-muted leading-relaxed">{result.reasoning}</p>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={mailtoUrl}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
          style={accent ? { backgroundColor: accent } : undefined}
        >
          Book a demo →
        </a>
        {product && (
          <a
            href={`#${product.iconName}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
          >
            See the {product.name} case
          </a>
        )}
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
        className="mt-10 pt-8 border-t border-border"
        limit={3}
        showTooltips
      />

      {product && <ChatPanel product={product} answers={answers} accent={accent} />}

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
}: {
  product: BaseProject;
  answers: DiagnosticAnswers;
  accent?: string;
}) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "" },
      ]);
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
    <div className="mt-10 pt-8 border-t border-border">
      <p className="section-label text-muted mb-4">Ask the concierge</p>
      {messages.length > 0 && (
        <div className="space-y-3 mb-4">
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
          {loading && (
            <p className="text-sm text-muted">Concierge is typing...</p>
          )}
        </div>
      )}
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
    </div>
  );
}
