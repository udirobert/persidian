import { ScrollProgressMark } from "@/components/ScrollProgressMark";
import { BraunClock } from "@/components/BraunClock";
import { PinnedSection } from "@/components/PinnedSection";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { BatonRule } from "@/components/BatonRule";
import { Diagnostic } from "@/components/Diagnostic";
import {
  ReceiptIcon,
  PaperPlaneIcon,
  PulseIcon,
  WatcherIcon,
  WeaveIcon,
  DiversifiIcon,
} from "@/components/ProductIcon";
import { PRODUCTS as BASE_PRODUCTS, type BaseProject } from "@/lib/products";
import Image from "next/image";

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

        <section aria-label="Weft">
          <PinnedSection
            id="weft"
            style={{
              background: PROJECTS[4].bg,
              color: PROJECTS[4].fg,
            }}
          >
            {[
              <WeftWhat key="w-what" />,
              <WeftVision key="w-vision" />,
              <WeftProof key="w-proof" />,
            ]}
          </PinnedSection>
        </section>

        <section aria-label="Diversifi">
          <PinnedSection
            id="diversifi"
            style={{
              background: PROJECTS[5].bg,
              color: PROJECTS[5].fg,
            }}
          >
            {[
              <DiversifiWhat key="x-what" />,
              <DiversifiVision key="x-vision" />,
              <DiversifiProof key="x-proof" />,
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
              Four questions. No chatbot. We match your costliest hidden risk
              to the Persidian agent built to stop it.
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
            className="w-44 h-44 sm:w-60 sm:h-60 lg:w-72 lg:h-72 shrink-0"
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
        <blockquote
          className="mb-12 max-w-3xl text-2xl sm:text-3xl font-medium italic leading-snug text-foreground"
          data-enter
          style={{ "--enter-delay": "20ms" } as React.CSSProperties}
        >
          &ldquo;The future is already here — it&rsquo;s just not evenly distributed.&rdquo;
          <cite className="mt-3 block text-xs not-italic font-mono uppercase tracking-[0.15em] text-muted">
            William Gibson
          </cite>
        </blockquote>
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
              Persidian builds agents that live inside those rhythms and act
              while the cost is still small. Every product runs one pattern: find
              a risk that repeats and costs real money, plug into the system
              where it lives, let an agent do the work, keep a human at the
              approval gate.
            </p>
            <p className="text-foreground">
              Run as a studio, the five products compound on each other — each
              serves a different enterprise buyer, and every integration hardens
              the next. The aim is an operating layer businesses trust to act on
              their behalf.
            </p>
          </div>
        </div>

        <div
          className="mt-16 grid gap-px bg-border border border-border rounded-2xl overflow-hidden"
          data-enter
          style={{
            gridTemplateColumns: `repeat(${PROJECTS.length}, minmax(0, 1fr))`,
            "--enter-delay": "120ms",
          } as React.CSSProperties}
        >
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="bg-background p-5 sm:p-6 text-center sm:text-left"
            >
              <p className="section-label text-muted mb-1">{p.thesisLabel}</p>
              <p className="text-sm sm:text-base font-semibold">{p.name}</p>
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
      title="Live in production on Xero."
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

/* ---- Weft ---- */
function WeftWhat() {
  const p = PROJECTS[4];
  return (
    <BeatLayout
      kicker="05 / Weft"
      label="What it does"
      title="Escrow that releases itself when agents agree."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        A sponsor locks capital behind a milestone. The builder ships. Three
        independent verifier agents collect evidence — deployment state,
        on-chain activity, GitHub commits, peer verdicts — and vote on whether
        the deliverable was met. If two of three agree, the contract releases
        funds automatically.
      </p>
      <p>
        For confidential milestones, each agent encrypts its ballot and
        confidence score with Zama FHE. The contract tallies votes on
        ciphertext, so no verifier can see the others&apos; votes before casting
        their own. Only the final verified boolean is ever decrypted.
      </p>
    </BeatLayout>
  );
}

function WeftVision() {
  const p = PROJECTS[4];
  return (
    <BeatLayout
      kicker="05 / Weft"
      label="The vision"
      title="Trustless milestones become the default way to work."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        Freelancers, DAOs, and remote teams waste enormous energy chasing
        payment, negotiating scope, and proving delivery. Weft removes the
        politics by making verification a protocol: capital is escrowed, outcomes
        are verified by autonomous agents, and reputation attaches to the
        builder&apos;s ENS identity across every project they complete.
      </p>
      <p>
        The agent itself is a self-sustaining participant. It earns a 3% fee
        on every milestone it verifies, uses the revenue to pay for its own
        infrastructure, and becomes a tiny autonomous company running onchain.
        The moat is the cryptographically sealed consensus loop — not reputation
        scores, but verifiable votes no single party can manipulate.
      </p>
    </BeatLayout>
  );
}

function WeftProof() {
  const p = PROJECTS[4];
  return (
    <BeatLayout
      kicker="05 / Weft"
      label="The proof"
      title="Live on 0G and Sepolia with sealed FHE consensus."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <ul className="space-y-3 list-disc pl-5 marker:text-accent">
        <li>
          Live deployments on 0G Galileo Testnet and Sepolia with verified
          milestone contracts.
        </li>
        <li>
          Two Zama FHE contract versions: addition-class sealed ballots and
          multiplication-class confidence-weighted ballots.
        </li>
        <li>
          Integration partners already in place: Zama, 0G, Gensyn/AXL,
          KeeperHub, ENS, Hermes + Kimi, and fal.ai.
        </li>
        <li>
          Full surfaces: sponsor dashboard, builder profile, verification
          explorer, and agent operations console.
        </li>
      </ul>
    </BeatLayout>
  );
}

/* ---- Diversifi ---- */
function DiversifiWhat() {
  const p = PROJECTS[5];
  return (
    <BeatLayout
      kicker="06 / Diversifi"
      label="What it does"
      title="FX-risk intelligence and autonomous treasury protection."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        DiversiFi quantifies the currency drag on working capital for businesses
        that earn in one currency and must purchase in another. The Guardian agent
        routes capital between Celo/Mento local stablecoins, Arbitrum deep
        liquidity, and HashKey regulated-market savings, then executes protection
        automatically — every decision recorded on the chain where the money moves.
      </p>
      <p>
        AI reasoning is anchored to 0G for verifiable evidence, and premium
        intelligence flows are gated by x402 nanopayments. The retail savings app
        is top-of-funnel; the SME business intelligence layer is the real product.
      </p>
    </BeatLayout>
  );
}

function DiversifiVision() {
  const p = PROJECTS[5];
  return (
    <BeatLayout
      kicker="06 / Diversifi"
      label="The vision"
      title="Every cross-currency business gets an autonomous treasury guard."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <p>
        No current player combines FX-risk quantification with autonomous execution.
        DiversiFi makes the moat structural: a philosophy-driven values system
        creates identity-based retention, while the Guardian turns working-capital
        risk into a managed, auditable operating layer.
      </p>
      <p>
        The expansion is from the retail saver who protects a wallet to the Ghanaian
        importer, the US retailer sourcing from Europe, and the UK business paying
        US suppliers — any company whose margins move when exchange rates do.
      </p>
    </BeatLayout>
  );
}

function DiversifiProof() {
  const p = PROJECTS[5];
  return (
    <BeatLayout
      kicker="06 / Diversifi"
      label="The proof"
      title="Live on Celo, Arbitrum and 0G mainnets with verified ledgers."
      accent={p.accent}
      muted={p.muted}
      href={p.href}
      repo={p.repo}
      name={p.name}
    >
      <ul className="space-y-3 list-disc pl-5 marker:text-accent">
        <li>
          Chain-aware RecommendationLedgers deployed on Celo Mainnet (savings),
          Arbitrum Mainnet (yield), and 0G Mainnet (evidence anchor).
        </li>
        <li>
          ERC-8004 agent identity and verified contracts on Celoscan, Arbiscan, and
          0G ChainScan.
        </li>
        <li>
          x402 nanopayment settlement rail for paid intelligence, with live
          settlement metrics.
        </li>
        <li>
          In-app Verifiable AI dashboard showing evidence CIDs, serving-model IDs,
          and chain receipts.
        </li>
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
              Start with the Business X-ray to find the compounding risk costing
              your business most. Then route to the Persidian agent built to stop
              it. Each product serves a distinct enterprise buyer and ships with
              real integrations — every integration hardens the next, and the
              studio gets faster at deploying agents customers trust.
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
            <Signal label="Live products" value={String(PROJECTS.length)} />
            <Signal label="Public repositories" value={String(PROJECTS.length)} />
            <Signal label="Production integrations" value="10+" />
            <Signal label="Primary markets" value={String(PROJECTS.length)} />
            <Signal label="Deployment model" value="Docker / VPS / Cloud" />
            <Signal label="Studio status" value="Active" />
          </div>
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
