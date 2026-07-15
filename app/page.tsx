import Link from "next/link";
import Image from "next/image";
import { BraunClock } from "@/components/BraunClock";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { BatonRule } from "@/components/BatonRule";
import { Diagnostic } from "@/components/Diagnostic";
import { PinnedSection } from "@/components/PinnedSection";
import { ContactForm } from "@/components/ContactForm";
import { MobileXrayCta } from "@/components/MobileXrayCta";
import { Header, Footer, CONNECT_URL, EMAIL } from "@/components/SiteChrome";
import {
  ReceiptIcon,
  PaperPlaneIcon,
  PulseIcon,
  WatcherIcon,
  WeaveIcon,
  DiversifiIcon,
} from "@/components/ProductIcon";
import { PRODUCTS as BASE_PRODUCTS, type BaseProject } from "@/lib/products";

interface Project extends BaseProject {
  icon: () => React.ReactElement;
}

const iconMap: Record<string, () => React.ReactElement> = {
  receipt: ReceiptIcon,
  paperPlane: PaperPlaneIcon,
  pulse: PulseIcon,
  watcher: WatcherIcon,
  weave: WeaveIcon,
  diversifi: DiversifiIcon,
};

const PROJECTS: Project[] = BASE_PRODUCTS.map((p) => {
  const Icon = iconMap[p.iconName];
  if (!Icon) {
    throw new Error(`No icon registered for product "${p.name}" (${p.iconName})`);
  }
  return { ...p, icon: Icon };
});

/* Buyer-facing case for each agent: what it does, in the buyer's language,
   with the single strongest proof point. The investor material — vision,
   moat, full proof lists — lives on /studio. */
interface ProductCase {
  title: string;
  body: string[];
  proof: string;
}

const CASES: Record<string, ProductCase> = {
  Sikizana: {
    title: "An AI credit controller and bookkeeper for Xero.",
    body: [
      "Sikizana connects to Xero and runs a proactive audit before you type a word. It ages receivables into 30/60/90-day buckets, benchmarks payment behaviour against your sector, scores customers RED/AMBER/GREEN, and drafts escalating chase emails with statutory interest and late-payment compensation already calculated.",
      "It also explains your P&L in plain English, estimates UK Corporation Tax with HMRC citations, and matches receipts from a photo. Nothing writes back to Xero without your approval.",
    ],
    proof:
      "Live in production on Xero — 19 permissioned Xero actions, every write-back gated by human approval.",
  },
  Nuncio: {
    title: "Personalized video outreach, produced by agents.",
    body: [
      "Give Nuncio a prospect's URL and a brief. A researcher enriches the profile, a copywriter drafts the angle and script, a QA agent checks length and brand safety, and a producer renders the finished video — with your sign-off before anything renders.",
      "The result lands on a branded page with captions, sharing, and translation into eight languages. It sounds like you wrote it for them, because the agent did.",
    ],
    proof: "About five minutes from URL to finished video, at the cost of API calls.",
  },
  Lenitnes: {
    title: "Signal intelligence for consensus-critical code.",
    body: [
      "Lenitnes watches public commits to consensus-critical repositories — Bitcoin, Ethereum, Zcash, Solana and more — and infers directional theses before the market prices them in. Every call is timestamped, scored against a versioned rubric, and tracked on a public scorecard that cannot misremember its own record.",
    ],
    proof:
      "Replayed against public commits, it would have flagged a high-conviction ZEC short two to three days before the disclosure that cut the price in half.",
  },
  DataBard: {
    title: "An AI analyst that makes your data estate audible.",
    body: [
      "DataBard connects to your catalog and warehouse, computes health scores, critical-table rankings, coverage gaps, and PII flags — then delivers the findings in formats people actually consume: two-host podcasts, dashboards, reports, and alerts.",
      "Click any podcast segment to drill into the exact columns, tests, and lineage behind the insight. The catalog stops being a graveyard and becomes a conversation.",
    ],
    proof:
      "Adapters for OpenMetadata, dbt, The Graph, and Dune today — plus a SQL escape hatch for 50+ sources.",
  },
  Weft: {
    title: "Post-award verification that writes back to your grant system of record.",
    body: [
      "For program officers and grants managers already on Fluxx, Foundant, AmpliFund, Submittable, or Salesforce Nonprofit: when a grantee marks a milestone complete, Weft runs a fixed checklist against the evidence and returns a verification receipt to write onto the grant record — so the tranche isn't stuck in a review queue.",
      "Private settlement on Canton is optional pilot infrastructure for teams that want to move capital the same way verification moves. It is not the sales lead, and no mainnet capital movement is claimed.",
    ],
    proof:
      "Live production ops surface + GMS ingest/receipt API. Settlement labeled Canton Devnet pilot — not mainnet capital movement.",
  },
  Diversifi: {
    title: "Autonomous protection from currency drag.",
    body: [
      "Diversifi quantifies what earning in one currency and buying in another costs your working capital — as real for a US importer paying suppliers in China as for a European exporter or a Nairobi trading house. Its Guardian agent routes capital to flatten that risk automatically, every decision recorded on an auditable public ledger.",
      "The same engine powers a savings product for individuals: optimize yield, protect purchasing power, and keep your capital parked in vehicles aligned with your values.",
    ],
    proof:
      "Live on three mainnets with verified, publicly auditable decision ledgers.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Header />

      <main>
        <Hero />
        <BatonRule />
        <TheProblem />
        <BatonRule />
        <PortfolioIndex />
        <BatonRule />

        {PROJECTS.map((p) => (
          <PinnedProductSection key={p.name} project={p} productCase={CASES[p.name]} />
        ))}

        <BatonRule />
        <TheStudio />
      </main>

      <MobileXrayCta />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-5 sm:px-10 pt-32 pb-24 bg-background text-foreground">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="w-full max-w-2xl" data-enter style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-5 whitespace-nowrap">
              <span className="text-accent font-bold">PERSI</span>
              <span className="text-muted">STENCE</span>
              <span className="text-muted"> + </span>
              <span className="text-muted">CIRCA</span>
              <span className="text-accent font-bold">DIAN</span>
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground">
              Find the risk your
              <br />
              business is
              <br />
              ignoring.
            </h1>
            <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
              Four questions. No sales call. We match your costliest hidden
              risk to the Persidian agent built to stop it.
            </p>

            <div id="diagnostic" className="mt-8 w-full">
              <Diagnostic />
            </div>

            <div className="mt-6">
              <a
                href="#portfolio"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                View the portfolio →
              </a>
            </div>
          </div>

          <div
            className="hidden lg:block w-72 h-72 shrink-0 lg:sticky lg:top-32"
            data-enter
            style={{ "--enter-delay": "60ms" } as React.CSSProperties}
          >
            <BraunClock className="w-full h-full braun-clock" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-5 sm:left-10 text-[10px] font-mono uppercase tracking-[0.15em] text-muted">
        Scroll
      </div>
    </section>
  );
}

function TheProblem() {
  return (
    <section id="thesis" className="py-24 sm:py-32 px-5 sm:px-10 bg-background text-foreground border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="section-kicker text-muted mb-5" data-enter>The problem</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div data-enter style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
              Risk builds where no one is looking. Our agents work there.
            </h2>
          </div>
          <div className="space-y-6 text-muted leading-relaxed" data-enter style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
            <p>
              The risks that sink a business don&apos;t arrive as alarms — they
              compound quietly: cash aging past its terms, outreach going cold,
              data degrading in the dark, signals leaking through commits before
              anyone reads them.
            </p>
            <p>
              Every Persidian agent runs one pattern: find a risk that repeats
              and costs real money, plug into the system where it lives, let the
              agent do the work — and keep you at the approval gate.
            </p>
            <p>
              <Link
                href="/studio"
                className="text-sm font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
              >
                Read the studio thesis →
              </Link>
            </p>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden"
          data-enter
          style={{ "--enter-delay": "120ms" } as React.CSSProperties}
        >
          {PROJECTS.map((p) => (
            <div key={p.name} className="bg-background p-4 sm:p-6">
              <p className="section-label text-muted mb-3">
                {p.thesisLabel} · {p.name}
              </p>
              <p className="text-2xl sm:text-4xl font-semibold tracking-tight" style={{ color: p.accent }}>
                {p.problemStat}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">{p.problemLabel}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted" data-enter style={{ "--enter-delay": "160ms" } as React.CSSProperties}>
          Drawn from public industry research and market data.
        </p>
      </div>
    </section>
  );
}

function PortfolioIndex() {
  return (
    <section id="portfolio" className="py-24 sm:py-32 px-5 sm:px-10 bg-background text-foreground">
      <div className="max-w-5xl mx-auto">
        <p className="section-kicker text-muted mb-5" data-enter>The portfolio</p>
        <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight mb-12" data-enter style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
          Six agents. One diagnosis.
        </h2>

        <StaggeredGrid
          className="grid gap-4 items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          } as React.CSSProperties}
        >
          {PROJECTS.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={p.href}
                className="project-card relative isolate rounded-2xl border p-5"
                style={
                  {
                    background: p.bg,
                    color: p.fg,
                    borderColor: "var(--border)",
                    "--card-accent": p.accent,
                  } as React.CSSProperties
                }
              >
                <div
                  aria-hidden="true"
                  className="card-glow absolute inset-0 -z-10"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${p.accent}, transparent 60%)`,
                  }}
                />

                <div className="card-preview" aria-hidden="true">
                  <Image
                    src={p.shot}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-wide opacity-50">
                    {p.number}
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded"
                    style={{
                      color: p.accent,
                      background: `color-mix(in srgb, ${p.accent} 15%, transparent)`,
                    }}
                  >
                    Live
                  </span>
                </div>

                <div className="card-icon w-8 h-8 mb-4" style={{ color: p.accent }}>
                  <Icon />
                </div>

                <h3 className={`text-base font-semibold mb-1.5 ${p.fontClass ?? ""}`}>
                  {p.name}
                </h3>
                <p className={`text-xs leading-relaxed opacity-80 ${p.fontClass ?? ""}`}>
                  {p.tagline}
                </p>
                <span
                  className="card-visit mt-3 inline-block text-xs font-medium opacity-0 transition-opacity duration-200"
                  style={{ color: p.accent }}
                >
                  Visit →
                </span>
              </a>
            );
          })}
        </StaggeredGrid>
      </div>
    </section>
  );
}

function BeatLayout({
  project: p,
  label,
  title,
  children,
}: {
  project: Project;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-4">
        <p className="section-kicker mb-2" style={{ color: p.muted }}>
          {p.number} / {p.name}
        </p>
        <p className="section-label" style={{ color: p.accent }}>{label}</p>
        <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
          {title}
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={p.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ borderColor: p.accent, color: p.accent }}
          >
            Visit {p.name} →
          </a>
          <a
            href={p.repo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:opacity-80 transition-opacity"
            style={{
              borderColor: "color-mix(in srgb, currentColor 20%, transparent)",
              color: p.muted,
            }}
          >
            Source
          </a>
        </div>
      </div>
      <div className="lg:col-span-8 text-base sm:text-lg leading-relaxed space-y-5" style={{ color: p.muted }}>
        {children}
      </div>
    </div>
  );
}

function PinnedProductSection({
  project: p,
  productCase,
}: {
  project: Project;
  productCase: ProductCase;
}) {
  return (
    <section aria-label={p.name}>
      <PinnedSection
        id={p.name.toLowerCase()}
        style={{ background: p.bg, color: p.fg }}
      >
        {[
          <BeatLayout
            key="case"
            project={p}
            label={p.thesisLabel}
            title={productCase.title}
          >
            {productCase.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </BeatLayout>,
          <BeatLayout
            key="proof"
            project={p}
            label="The proof"
            title="Why believe it."
          >
            <div
              className="pt-2 pl-4 border-l-2"
              style={{ borderColor: p.accent }}
            >
              <p className="text-lg sm:text-xl font-medium leading-relaxed" style={{ color: p.fg }}>
                {productCase.proof}
              </p>
            </div>
          </BeatLayout>,
        ]}
      </PinnedSection>
    </section>
  );
}

function TheStudio() {
  return (
    <section id="studio" className="py-24 sm:py-32 px-5 sm:px-10 bg-background text-foreground border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="section-kicker text-muted mb-5" data-enter>The studio</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div data-enter style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
              Built to compound.
            </h2>
            <p className="mt-6 text-muted leading-relaxed">
              Each Persidian agent serves a different buyer and ships with real
              integrations — and every integration hardens the next. Start with
              the Business X-ray above, or tell us what hurts and we&apos;ll
              show you the right agent running on your own data.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CONNECT_URL}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
              >
                Connect on X →
              </a>
              <Link
                href="/studio"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Read the studio thesis →
              </Link>
            </div>
          </div>

          <div id="contact" data-enter style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
            <p className="section-label text-muted mb-4">Book a demo</p>
            <ContactForm
              submitLabel="Book a demo →"
              intent="demo"
              messagePlaceholder={`What hurts, and which systems does it live in? We'll reply from ${EMAIL}.`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
