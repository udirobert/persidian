import { ScrollProgressMark } from "@/components/ScrollProgressMark";
import { BraunClock } from "@/components/BraunClock";
import { PinnedSection } from "@/components/PinnedSection";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { BatonRule } from "@/components/BatonRule";
import { ContactForm } from "@/components/ContactForm";
import {
  ReceiptIcon,
  PaperPlaneIcon,
  PulseIcon,
  WatcherIcon,
} from "@/components/ProductIcon";
import Image from "next/image";

interface Project {
  number: string;
  name: string;
  href: string;
  repo: string;
  tagline: string;
  icon: () => React.ReactElement;
  shot: string;
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  fontClass?: string;
}

const PROJECTS: Project[] = [
  {
    number: "01",
    name: "Sikizana",
    href: "https://sikizana.persidian.com",
    repo: "https://github.com/udirobert/sikizana",
    tagline:
      "Get paid faster, with Xero. AI credit controller and bookkeeper that ages receivables, benchmarks your sector, and chases overdue invoices.",
    icon: ReceiptIcon,
    shot: "/shots/sikizana.png",
    bg: "#faf8f5",
    fg: "#1c1917",
    accent: "#d4843a",
    muted: "#78716c",
    fontClass: "",
  },
  {
    number: "02",
    name: "Nuncio",
    href: "https://nuncio.persidian.com",
    repo: "https://github.com/udirobert/nuncio",
    tagline:
      "Send a video they'll actually watch. Multi-agent video personalization for sales, recruiting, and investor outreach.",
    icon: PaperPlaneIcon,
    shot: "/shots/nuncio.png",
    bg: "#f6f3ea",
    fg: "#4a4740",
    accent: "#5b52d6",
    muted: "#78716c",
    fontClass: "font-[Georgia,serif] italic",
  },
  {
    number: "03",
    name: "Lenitnes",
    href: "https://lenitnes.persidian.com",
    repo: "https://github.com/sneldao/lenitnes",
    tagline:
      "Autonomous signal intelligence. Reads commits to consensus-critical code, commits theses on-chain, and tracks an undeniable public scorecard.",
    icon: PulseIcon,
    shot: "/shots/lenitnes.png",
    bg: "#0c1013",
    fg: "#eef2f3",
    accent: "#22d3ee",
    muted: "#9ca3af",
    fontClass: "font-mono",
  },
  {
    number: "04",
    name: "DataBard",
    href: "https://databard.persidian.com",
    repo: "https://github.com/thisyearnofear/databard",
    tagline:
      "Watches your data estate. Health scores, lineage risk, and PII flags — delivered as podcasts, dashboards, reports, and on-chain attestations.",
    icon: WatcherIcon,
    shot: "/shots/databard.png",
    bg: "#f5ede0",
    fg: "#3a2a1a",
    accent: "#b45309",
    muted: "#78716c",
    fontClass: "",
  },
];

const CONNECT_URL = "https://x.com/udirobert";
const EMAIL = "hello@persidian.com";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Header />

      <main>
        <Hero />
        <BatonRule />
        <StudioThesis />
        <BatonRule />
        <PortfolioIndex />
        <BatonRule />

        <section aria-label="Sikizana">
          <PinnedSection
            id="sikizana"
            style={{
              background: PROJECTS[0].bg,
              color: PROJECTS[0].fg,
            }}
          >
            {[
              <SikizanaWhat key="s-what" />,
              <SikizanaVision key="s-vision" />,
              <SikizanaProof key="s-proof" />,
            ]}
          </PinnedSection>
        </section>

        <section aria-label="Nuncio">
          <PinnedSection
            id="nuncio"
            style={{
              background: PROJECTS[1].bg,
              color: PROJECTS[1].fg,
            }}
          >
            {[
              <NuncioWhat key="n-what" />,
              <NuncioVision key="n-vision" />,
              <NuncioProof key="n-proof" />,
            ]}
          </PinnedSection>
        </section>

        <section aria-label="Lenitnes">
          <PinnedSection
            id="lenitnes"
            style={{
              background: PROJECTS[2].bg,
              color: PROJECTS[2].fg,
            }}
          >
            {[
              <LenitnesWhat key="l-what" />,
              <LenitnesVision key="l-vision" />,
              <LenitnesProof key="l-proof" />,
            ]}
          </PinnedSection>
        </section>

        <section aria-label="DataBard">
          <PinnedSection
            id="databard"
            style={{
              background: PROJECTS[3].bg,
              color: PROJECTS[3].fg,
            }}
          >
            {[
              <DataBardWhat key="d-what" />,
              <DataBardVision key="d-vision" />,
              <DataBardProof key="d-proof" />,
            ]}
          </PinnedSection>
        </section>

        <BatonRule />
        <TheStudio />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-5 sm:px-10 py-5 sm:py-6 flex items-center justify-between mix-blend-difference text-background">
      <a href="#" className="flex items-center gap-2.5 sm:gap-3">
        <ScrollProgressMark />
        <span className="text-sm font-semibold tracking-tight">
          PERSIDIAN
        </span>
      </a>
      <a
        href={CONNECT_URL}
        className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
      >
        Connect
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-5 sm:px-10 pt-32 pb-24 bg-background text-foreground">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="max-w-2xl order-2 lg:order-1" data-enter style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-5 whitespace-nowrap">
              <span className="text-accent font-bold">PERSI</span>
              <span className="text-muted">STENCE</span>
              <span className="text-muted"> + </span>
              <span className="text-muted">CIRCA</span>
              <span className="text-accent font-bold">DIAN</span>
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground">
              A portfolio of
              <br />
              autonomous products.
            </h1>
            <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
              Each product watches a compounding business risk — invoices,
              outreach, theses, data — and acts before the damage scales.
              Together they form Persidian: a studio for dependable autonomous
              software agents.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4" data-enter style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
              <a
                href="#thesis"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
              >
                Read the thesis
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
              >
                View the portfolio
              </a>
            </div>
          </div>

          <div
            className="w-44 h-44 sm:w-60 sm:h-60 lg:w-72 lg:h-72 shrink-0 order-1 lg:order-2"
            data-enter
            style={{ "--enter-delay": "60ms" } as React.CSSProperties}
          >
            <BraunClock />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-5 sm:left-10 text-[10px] font-mono uppercase tracking-[0.15em] text-muted">
        Scroll
      </div>
    </section>
  );
}

function StudioThesis() {
  return (
    <section id="thesis" className="py-24 sm:py-32 px-5 sm:px-10 bg-background text-foreground border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="section-kicker text-muted mb-5" data-enter>The thesis</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div data-enter style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
              A portfolio, not an app.
            </h2>
          </div>
          <div className="space-y-6 text-muted leading-relaxed" data-enter style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
            <p>
              The most expensive problems in a business are the ones that
              compound silently: invoices aging past their terms, outreach going
              unanswered, data quality tests failing in the dark, market-moving
              signals leaking through commits before anyone reads them.
            </p>
            <p>
              Persidian builds autonomous agents that watch these rhythms and
              act before the damage scales. The four products share one design
              pattern: identify a recurring, high-cost business risk; connect to
              the systems where the risk lives; let an agent do the work; keep a
              human at the approval gate.
            </p>
            <p className="text-foreground">
              <strong>The strategic case:</strong> each product is
              independently valuable and addresses a distinct enterprise buyer.
              Together they demonstrate a repeatable studio capability — shipping
              production-grade AI agents with real integrations, real moats,
              and live deployments.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden" data-enter style={{ "--enter-delay": "120ms" } as React.CSSProperties}>
          {[
            { label: "Money in", product: "Sikizana" },
            { label: "Messages out", product: "Nuncio" },
            { label: "Theses tested", product: "Lenitnes" },
            { label: "Data trusted", product: "DataBard" },
          ].map((item) => (
            <div
              key={item.product}
              className="bg-background p-5 sm:p-6 text-center sm:text-left"
            >
              <p className="section-label text-muted mb-1">{item.label}</p>
              <p className="text-sm sm:text-base font-semibold">{item.product}</p>
            </div>
          ))}
        </div>
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
          Four live products. Four enterprise buyers.
        </h2>

        <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
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
  kicker,
  label,
  title,
  children,
  accent,
  muted,
  href,
  repo,
  name,
}: {
  kicker: string;
  label: string;
  title: string;
  children: React.ReactNode;
  accent: string;
  muted: string;
  href: string;
  repo: string;
  name: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-4">
        <p className="section-kicker mb-2" style={{ color: muted }}>{kicker}</p>
        <p className="section-label" style={{ color: accent }}>{label}</p>
        <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
          {title}
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ borderColor: accent, color: accent }}
          >
            Visit {name} →
          </a>
          <a
            href={repo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)", color: muted }}
          >
            Source
          </a>
        </div>
      </div>
      <div className="lg:col-span-8 text-base sm:text-lg leading-relaxed space-y-5" style={{ color: muted }}>
        {children}
      </div>
    </div>
  );
}

/* ---- Sikizana ---- */
function SikizanaWhat() {
  const p = PROJECTS[0];
  return (
    <BeatLayout
      kicker="01 / Sikizana"
      label="What it does"
      title="An AI credit controller and bookkeeper for Xero."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        Sikizana connects to Xero and runs a proactive audit before the user
        types a word. It ages receivables into 30/60/90 day buckets, compares
        payment behavior against typical UK sector ranges, scores customers with
        RED/AMBER/GREEN reliability, and drafts escalating chase emails with
        statutory interest and £40/£70/£100 fixed-sum compensation already
        calculated.
      </p>
      <p>
        On the bookkeeping side it explains P&L in plain English, estimates UK
        Corporation Tax with HMRC citations, proposes journal entries, and
        matches receipts via Gemini Vision — all with human-in-the-loop
        approval before anything writes back to Xero.
      </p>
    </BeatLayout>
  );
}

function SikizanaVision() {
  const p = PROJECTS[0];
  return (
    <BeatLayout
      kicker="01 / Sikizana"
      label="The vision"
      title="Every small business gets a finance team in a browser."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        4.4 million small businesses use Xero. Most do not have an accountant
        — or a credit controller. The wedge is cash recovery: money already
        earned but slipping away because nobody chases it. The expansion is full
        AI bookkeeping: a conversational agent that audits, explains, and fixes
        the books as a subscription service.
      </p>
      <p>
        The moat is the integration depth. Sikizana writes back to Xero through
        a real, permissioned tool layer — not prompt engineering — and every
        figure is traceable to an HMRC citation, a sector benchmark, or an
        explicit human approval.
      </p>
    </BeatLayout>
  );
}

function SikizanaProof() {
  const p = PROJECTS[0];
  return (
    <BeatLayout
      kicker="01 / Sikizana"
      label="The proof"
      title="Built for the Xero Hackathon. Live today."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <ul className="space-y-3 list-disc pl-5 marker:text-accent">
        <li>19 Xero tools in the agent loop, plus tax RAG and receipt vision.</li>
        <li>77 tests covering report parsing, OAuth, webhooks, chase scheduling, and data erasure.</li>
        <li>Real write-back path gated at the tool layer, not just the prompt layer.</li>
        <li>Live deployments: landing page, books chat, impact dashboard, security page, activity audit.</li>
      </ul>
    </BeatLayout>
  );
}

/* ---- Nuncio ---- */
function NuncioWhat() {
  const p = PROJECTS[1];
  return (
    <BeatLayout
      kicker="02 / Nuncio"
      label="What it does"
      title="A multi-agent studio for personalized video outreach."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        Nuncio turns a prospect URL and a brief into a bespoke video in about
        five minutes. Four specialized agents coordinate in a Band room: a
        researcher enriches the profile via TinyFish, a copywriter generates
        personalization angles and scripts, a QA agent validates word count and
        brand safety, and a producer renders audio with ElevenLabs and video
        with HeyGen.
      </p>
      <p>
        Human approval is required before rendering. The finished video is
        served on a branded landing page with captions, sharing, and optional
        translation into eight languages.
      </p>
    </BeatLayout>
  );
}

function NuncioVision() {
  const p = PROJECTS[1];
  return (
    <BeatLayout
      kicker="02 / Nuncio"
      label="The vision"
      title="The end of cold outreach."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        No templates. No mail merge. A video that sounds like the sender wrote
        it for the recipient, because the agent did. The use cases are
        horizontal but high-value: sales prospecting, investor pitches,
        recruiting outreach, freelancer pitches, and conference follow-up.
      </p>
      <p>
        The strategic value is a reusable personalization engine. Point the same
        agent room at LinkedIn, GitHub, Twitter/X, or any public profile, choose
        an intent chip, and produce a 1-to-1 asset at the cost of API calls.
      </p>
    </BeatLayout>
  );
}

function NuncioProof() {
  const p = PROJECTS[1];
  return (
    <BeatLayout
      kicker="02 / Nuncio"
      label="The proof"
      title="Live pipeline, demo mode, and a branded share surface."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <ul className="space-y-3 list-disc pl-5 marker:text-accent">
        <li>Full pipeline UI with URL input, angle picker, script review, and video player.</li>
        <li>Demo mode runs end-to-end with cached data and no API keys.</li>
        <li>Voice input via Speechmatics, platform auto-detection, and LLM fallback.</li>
        <li>Every shared video URL is a marketing surface with a &ldquo;Make your own&rdquo; CTA.</li>
      </ul>
    </BeatLayout>
  );
}

/* ---- Lenitnes ---- */
function LenitnesWhat() {
  const p = PROJECTS[2];
  return (
    <BeatLayout
      kicker="03 / Lenitnes"
      label="What it does"
      title="Autonomous signal intelligence for consensus-critical code."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        Lenitnes watches public commits to consensus-critical cryptocurrency
        repositories — Zcash, Bitcoin, Ethereum, Solana, Arbitrum, Sui — and
        infers directional theses before the market prices them in. Each
        signal is scored against a versioned rubric, timestamped on Hedera HCS,
        and tracked as an explicitly-labeled paper position.
      </p>
      <p>
        Price snapshots are taken at T+1h, T+4h, T+1d, and T+7d. The public
        scorecard recomputes from the same tables the calls are written to —
        the system cannot misremember its own performance.
      </p>
    </BeatLayout>
  );
}

function LenitnesVision() {
  const p = PROJECTS[2];
  return (
    <BeatLayout
      kicker="03 / Lenitnes"
      label="The vision"
      title="The public track record is the sales proof."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        One engine serves two audiences. Publicly, the agent trades its own
        theses in the open and builds a verifiable reputation. Enterprise
        customers point the same nine detectors and versioned rubric at their
        own repos to ask: what is our commit history telling the market before
        we announce it?
      </p>
      <p>
        The leak-scan direction turns a research tool into a recurring
        intelligence product for protocols, custodians, and market makers who
        need to know what their code is signaling before outsiders do.
      </p>
    </BeatLayout>
  );
}

function LenitnesProof() {
  const p = PROJECTS[2];
  return (
    <BeatLayout
      kicker="03 / Lenitnes"
      label="The proof"
      title="The ZEC halo2 case study."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p className="text-foreground font-medium">
        In late May 2026, a four-year-old soundness bug was discovered in
        Zcash&apos;s halo2_gadgets crate. The emergency soft fork landed on 2
        June; formal disclosure followed 4-5 June. ZEC dropped ~50% in 48
        hours.
      </p>
      <ul className="space-y-3 list-disc pl-5 marker:text-accent">
        <li>Replayed against public commits, the agent would have flagged a 95/100 conviction, four-detector-consensus SHORT at ~$600.</li>
        <li>That is 2-3 days before the formal disclosure — a falsifiable, timestamped public track record.</li>
        <li>Every signal is versioned and auditable; the scorecard cannot misremember its own calls.</li>
        <li>Live surfaces: scorecard, calibration, methodology, portfolio, and repo replay.</li>
      </ul>
    </BeatLayout>
  );
}

/* ---- DataBard ---- */
function DataBardWhat() {
  const p = PROJECTS[3];
  return (
    <BeatLayout
      kicker="04 / DataBard"
      label="What it does"
      title="An AI analyst that makes your data estate audible."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        DataBard connects to OpenMetadata, dbt, The Graph, Dune, or any source
        via SQL. Its analysis engine computes health scores, critical-table
        rankings, coverage gaps, and PII flags, then renders the findings in
        the formats people actually consume: two-host AI podcasts, music
        anthems, dashboards, PDF reports, webhook alerts, and verifiable Solana
        attestations.
      </p>
      <p>
        Click any podcast segment to drill down into the columns, tests,
        lineage, and tags behind the insight. The catalog is no longer a
        graveyard — it becomes a conversation.
      </p>
    </BeatLayout>
  );
}

function DataBardVision() {
  const p = PROJECTS[3];
  return (
    <BeatLayout
      kicker="04 / DataBard"
      label="The vision"
      title="Metadata finally gets consumed."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        Data teams spend weeks onboarding engineers to warehouse semantics. The
        metadata is there, but nobody reads it. DataBard turns the same
        analysis into podcasts, reports, and alerts so the right information
        reaches the right person in the right format.
      </p>
      <p>
        Alex is the enthusiastic advocate; Morgan is the skeptical auditor.
        Their conversation surfaces cascading risks, ownership gaps, and stale
        tables in plain language. The moat is a single analysis engine with
        many output surfaces — every podcast, report, and alert reinforces the
        same underlying metadata graph, so value compounds with each new
        integration.
      </p>
    </BeatLayout>
  );
}

function DataBardProof() {
  const p = PROJECTS[3];
  return (
    <BeatLayout
      kicker="04 / DataBard"
      label="The proof"
      title="Two-voice podcasts, on-chain audit trails, and live dashboards."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <ul className="space-y-3 list-disc pl-5 marker:text-accent">
        <li>Two-voice ElevenLabs TTS with context stitching for natural prosody.</li>
        <li>Solana integration: minted episode records, Palm USD payments, health alerts, public leaderboard, gated replay.</li>
        <li>Health analytics dashboard, README badges, and an event ledger for funnel analysis.</li>
        <li>Tier 1 adapters for OpenMetadata, dbt, The Graph, Dune; Tier 2 Coral SQL escape hatch for 50+ sources.</li>
      </ul>
    </BeatLayout>
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
              Four live products, one studio capability. Each has a clear
              enterprise buyer, real integrations, and a defensible position.
              Together they demonstrate a repeatable pattern: identify a
              compounding business risk, build an autonomous agent, and ship a
              product that customers use every day.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CONNECT_URL}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
              >
                Connect on X →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-enter style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
            <Signal label="Live products" value="4" />
            <Signal label="Public repositories" value="4" />
            <Signal label="Production integrations" value="10+" />
            <Signal label="Primary markets" value="4" />
            <Signal label="Deployment model" value="Docker / VPS / Cloud" />
            <Signal label="Studio status" value="Active" />
          </div>
        </div>

        <div className="mt-16 max-w-2xl" data-enter style={{ "--enter-delay": "120ms" } as React.CSSProperties}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-background">
      <p className="section-label text-muted mb-2">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="px-5 sm:px-10 py-8 sm:py-10 border-t border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-xs font-mono text-muted">
        © {new Date().getFullYear()} Persidian
      </p>
      <div className="flex items-center gap-5">
        <a
          href={`mailto:${EMAIL}`}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          {EMAIL}
        </a>
        <a
          href={CONNECT_URL}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Connect
        </a>
      </div>
    </footer>
  );
}
