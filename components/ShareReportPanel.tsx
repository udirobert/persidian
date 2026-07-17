"use client";

import Link from "next/link";
import { useState } from "react";
import type { DiagnosticAnswers } from "@/lib/diagnostic";
import type { FactReviewStatus, ScanFact } from "@/lib/site-scan/types";
import { CONTACT_EMAIL } from "@/lib/site";

interface ShareReportPanelProps {
  answers: DiagnosticAnswers;
  scanResult: {
    url: string;
    domain: string;
    facts: ScanFact[];
  } | null;
  factStatuses: Record<string, FactReviewStatus>;
  path: "url" | "manual";
}

export function ShareReportPanel({
  answers,
  scanResult,
  factStatuses,
  path,
}: ShareReportPanelProps) {
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<{
    id: string;
    shareUrl: string;
    deletionToken: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const saveReport = async () => {
    if (!consent) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          email: email.trim() || undefined,
          path,
          scannedUrl: scanResult?.url,
          scanDomain: scanResult?.domain,
          facts: scanResult?.facts ?? [],
          factStatuses,
          answers,
        }),
      });

      const data = (await response.json()) as {
        id?: string;
        shareUrl?: string;
        deletionToken?: string;
        expiresAt?: string;
        error?: string;
      };

      if (!response.ok || !data.shareUrl || !data.deletionToken || !data.id) {
        setError(data.error || "Could not save the report.");
        return;
      }

      setSaved({
        id: data.id,
        shareUrl: data.shareUrl,
        deletionToken: data.deletionToken,
        expiresAt: data.expiresAt ?? "",
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!saved?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(saved.shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy link. Select and copy manually.");
    }
  };

  if (saved) {
    return (
      <div className="rounded-2xl border border-border bg-border/20 p-5 sm:p-6">
        <p className="section-label text-muted mb-2">Shareable report</p>
        <p className="text-sm text-muted mb-4">
          Link expires {new Date(saved.expiresAt).toLocaleDateString()}. Save your deletion token
          if you want to remove this report later.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            readOnly
            value={saved.shareUrl}
            className="flex-1 min-w-0 rounded-full border border-border bg-background px-4 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <Link
          href={`/x-ray/${saved.id}`}
          className="text-sm font-medium underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Open report page →
        </Link>
        <p className="mt-4 text-xs text-muted font-mono break-all">
          Deletion token: {saved.deletionToken}
        </p>
        <p className="mt-2 text-xs text-muted">
          To delete this report, email {CONTACT_EMAIL} with the link and token, or use the API
          with the token. See{" "}
          <Link href="/trust" className="underline underline-offset-4">
            Trust
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-border/20 p-5 sm:p-6">
      <p className="section-label text-muted mb-2">Save &amp; share this report</p>
      <p className="text-sm text-muted mb-4">
        Optional. We only store a report if you consent. The server recomputes the recommendation
        from your confirmed findings — it cannot be forged from the browser.
      </p>

      <label className="flex items-start gap-3 text-sm leading-relaxed mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>
          I consent to Persidian storing this X-ray report for up to 30 days so I can share it.
        </span>
      </label>

      <label className="block text-sm text-muted mb-2" htmlFor="report-email">
        Email (optional — only if you want follow-up)
      </label>
      <input
        id="report-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-foreground/30 transition-colors"
      />

      <button
        type="button"
        onClick={saveReport}
        disabled={!consent || loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors disabled:opacity-40"
      >
        {loading ? "Saving..." : "Create share link →"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
