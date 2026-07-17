import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { getProductBySlug } from "@/lib/products";
import { getPublicReport } from "@/lib/reports/store";
import type { PublicXrayReport } from "@/lib/reports/types";
import { SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getPublicReport(id);
  if (!report) {
    return { title: "Report not found — Persidian" };
  }

  const title = report.recommendation.productName
    ? `X-ray: ${report.recommendation.productName} — Persidian`
    : "Business X-ray report — Persidian";

  return {
    title,
    description: report.recommendation.reasoning,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: report.recommendation.reasoning,
      url: `${SITE_URL}/x-ray/${id}`,
      type: "article",
    },
  };
}

export default async function XrayReportPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getPublicReport(id);
  if (!report) notFound();

  const product =
    report.recommendation.productSlug
      ? getProductBySlug(report.recommendation.productSlug)
      : undefined;

  const accent = product?.accent ?? report.recommendation.accent ?? "#c2620d";

  const factGroups: { title: string; kind: PublicXrayReport["facts"][number]["kind"] }[] = [
    { title: "What we found", kind: "found" },
    { title: "What we inferred", kind: "inferred" },
    { title: "What we cannot know", kind: "unknown" },
  ];

  const confidenceLabel: Record<string, string> = {
    high: "High-confidence match",
    medium: "Solid match",
    low: "Possible match",
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <Header />
      <main className="px-5 sm:px-10 pt-32 pb-24 bg-background text-foreground">
        <article className="max-w-3xl mx-auto">
          <p className="section-kicker text-muted mb-3">Business X-ray report</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
            {report.scanDomain ?? "Diagnostic summary"}
          </h1>
          <p className="mt-3 text-sm text-muted">
            Generated {new Date(report.createdAt).toLocaleString()} · Expires{" "}
            {new Date(report.expiresAt).toLocaleDateString()}
            {report.path === "url" && report.scannedUrl && (
              <>
                {" "}
                · Source:{" "}
                <a
                  href={report.scannedUrl}
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                  rel="noopener noreferrer"
                >
                  {report.scannedUrl}
                </a>
              </>
            )}
          </p>

          {report.recommendation.productName ? (
            <section className="mt-10 rounded-2xl border border-border p-6" style={{ borderTop: `3px solid ${accent}` }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <p className="section-kicker text-muted">Recommendation</p>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider"
                  style={{ borderColor: accent, color: accent }}
                >
                  {confidenceLabel[report.recommendation.confidence] ?? "Match"}
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {report.recommendation.productName}
                {report.recommendation.thesisLabel && (
                  <span className="text-muted"> — {report.recommendation.thesisLabel}</span>
                )}
              </h2>
              {report.recommendation.tagline && (
                <p className="mt-2 text-muted leading-relaxed">{report.recommendation.tagline}</p>
              )}
              <p className="mt-4 font-medium leading-relaxed">{report.recommendation.reasoning}</p>
              {report.recommendation.agentSays && (
                <p className="mt-4 text-sm text-muted leading-relaxed border-l-2 border-border pl-4">
                  {report.recommendation.agentSays}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {report.recommendation.entityHref && (
                  <Link
                    href={report.recommendation.entityHref}
                    className="inline-flex items-center px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
                  >
                    See proof →
                  </Link>
                )}
                {report.recommendation.productHref && (
                  <a
                    href={report.recommendation.productHref}
                    className="inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ borderColor: accent, color: accent }}
                  >
                    Visit product →
                  </a>
                )}
                <Link
                  href="/#diagnostic"
                  className="inline-flex items-center px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
                >
                  Run your own X-ray →
                </Link>
              </div>
            </section>
          ) : (
            <section className="mt-10 rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold">No single clear match</h2>
              <p className="mt-2 text-muted leading-relaxed">{report.recommendation.reasoning}</p>
            </section>
          )}

          {report.facts.length > 0 && (
            <section className="mt-10 space-y-6">
              <h2 className="text-xl font-semibold">Findings</h2>
              {factGroups.map(({ title, kind }) => {
                const items = report.facts.filter((f) => f.kind === kind);
                if (!items.length) return null;
                return (
                  <div key={kind}>
                    <p className="section-label text-muted mb-3">{title}</p>
                    <ul className="space-y-3">
                      {items.map((fact) => (
                        <li key={fact.id} className="rounded-xl border border-border p-4 text-sm leading-relaxed">
                          {fact.text}
                          {report.confirmedFactIds.includes(fact.id) && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider text-muted">
                              · Confirmed
                            </span>
                          )}
                          {fact.sources.length > 0 && (
                            <p className="mt-2 text-xs text-muted">
                              Sources: {fact.sources.map((s) => s.label).join(", ")}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          )}

          {report.recommendation.scores.length > 0 && (
            <section className="mt-10 pt-8 border-t border-border">
              <p className="section-label text-muted mb-4">Risk fit scores</p>
              <div className="space-y-3">
                {report.recommendation.scores
                  .filter((s) => s.score > 0)
                  .slice(0, 6)
                  .map((s) => (
                    <div key={s.key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="font-mono text-muted">{s.percentage}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(2, s.percentage)}%`,
                            backgroundColor: accent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          <p className="mt-10 text-xs text-muted leading-relaxed">
            This report reflects public website signals and your answers at the time of the X-ray.
            It is not professional advice.{" "}
            <Link href="/trust" className="underline underline-offset-4">
              Data handling
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
