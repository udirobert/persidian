"use client";

import { useState } from "react";

const EMAIL = "hello@persidian.com";

interface ContactFormProps {
  accent?: string;
  /** Label for the submit button. */
  submitLabel?: string;
  /** What the sender is asking for — drives the email subject line. */
  intent?: "demo" | "deck";
  messagePlaceholder?: string;
}

interface ContactResult {
  sent: boolean;
  mailtoUrl: string;
  body: string;
  to: string;
}

export function ContactForm({
  accent,
  submitLabel = "Send →",
  intent = "demo",
  messagePlaceholder = "What would you like to know?",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [result, setResult] = useState<ContactResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, org, message, intent }),
      });

      const data = (await response.json()) as {
        sent?: boolean;
        mailtoUrl?: string;
        body?: string;
        to?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult({
        sent: data.sent ?? false,
        mailtoUrl: data.mailtoUrl || `mailto:${EMAIL}`,
        body: data.body || "",
        to: data.to || EMAIL,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  };

  const reset = () => {
    setName("");
    setOrg("");
    setMessage("");
    setStatus("idle");
    setResult(null);
    setError("");
  };

  if (status === "success" && result) {
    return <SuccessView result={result} onReset={reset} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-background p-6 sm:p-8 space-y-5"
      data-enter
      aria-busy={status === "submitting"}
    >
      <div aria-live="polite" className="sr-only">
        {status === "error" ? error : status === "submitting" ? "Sending message..." : ""}
      </div>

      <div>
        <label htmlFor="contact-name" className="section-label text-muted block mb-2">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="contact-org" className="section-label text-muted block mb-2">
          Organisation
        </label>
        <input
          id="contact-org"
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Company or fund"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="section-label text-muted block mb-2">
          Message <span aria-label="required">*</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          placeholder={messagePlaceholder}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || !message.trim()}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform disabled:opacity-50 disabled:active:scale-100"
        style={accent ? { backgroundColor: accent } : undefined}
      >
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
      <p className="text-xs text-muted">
        Or email directly at{" "}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
      </p>
    </form>
  );
}

function SuccessView({
  result,
  onReset,
}: {
  result: ContactResult;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback is the visible pre block below
    }
  };

  return (
    <div
      className="rounded-2xl border border-border bg-background p-6 sm:p-8"
      data-enter
    >
      <h3 className="text-lg font-medium text-foreground">
        {result.sent ? "Email sent" : "Email ready to send"}
      </h3>
      <p className="mt-2 text-muted leading-relaxed">
        {result.sent
          ? "We received your message and will reply soon."
          : "If your mail app didn't open, copy the message below or open it manually."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={result.mailtoUrl}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
        >
          Open in email app →
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
        >
          {copied ? "Copied" : "Copy message"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          Send another
        </button>
      </div>

      <pre className="mt-5 p-4 rounded-xl border border-border bg-background text-xs font-mono text-muted whitespace-pre-wrap break-words max-h-48 overflow-auto">
        {result.body}
      </pre>

      <p className="mt-4 text-xs text-muted">
        Or email directly at{" "}
        <a href={`mailto:${result.to}`} className="underline underline-offset-4">
          {result.to}
        </a>
      </p>
    </div>
  );
}
