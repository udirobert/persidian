import type { Metadata } from "next";
import Link from "next/link";
import { BatonRule } from "@/components/BatonRule";
import { ContactForm } from "@/components/ContactForm";
import { Header, Footer, CONNECT_URL } from "@/components/SiteChrome";
import { PRODUCTS, type BaseProject } from "@/lib/products";

export const metadata: Metadata = {
  title: "Persidian — The studio thesis",
  description:
    "Persidian runs six autonomous agents as one studio: each serves a different enterprise buyer, every integration hardens the next, and the aim is an operating layer businesses trust to act on their behalf.",
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "Persidian — The studio thesis",
    description:
      "Persidian runs six autonomous agents as one studio: each serves a different enterprise buyer, every integration hardens the next, and the aim is an operating layer businesses trust to act on their behalf.",
    url: "https://persidian.com/studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persidian — The studio thesis",
    description:
      "Persidian runs six autonomous agents as one studio: each serves a different enterprise buyer, every integration hardens the next, and the aim is an operating layer businesses trust to act on their behalf.",
  },
};

/* Investor-facing material: the vision and the moat for each product, plus
   the full proof lists. The buyer-facing case for each product lives on the
   home page. */
interface StudioCase {
  vision: string;
  visionBody: string[];
  proof: string;
  proofPoints: string[];
}

const CASES: Record<string, StudioCase> = {
  Sikizana: {
    vision: "Every small business gets a finance team in a browser.",
    visionBody: [
      "4.4 million small businesses use Xero. Most do not have an accountant — or a credit controller. The wedge is cash recovery: money already earned but slipping away because nobody chases it. The expansion is full AI bookkeeping: a conversational agent that audits, explains, and fixes the books as a subscription service.",
      "The moat is the integration depth. Sikizana writes back to Xero through a real, permissioned tool layer — not prompt engineering — and every figure is traceable to an HMRC citation, a sector benchmark, or an explicit human approval.",
    ],
    proof: "Live in production on Xero.",
    proofPoints: [
      "19 Xero tools in the agent loop, plus tax RAG and receipt vision via Gemini.",
      "77 tests covering report parsing, OAuth, webhooks, chase scheduling, and data erasure.",
      "Real write-back path gated at the tool layer, not just the prompt layer.",
      "Live deployments: landing page, books chat, impact dashboard, security page, activity audit.",
    ],
  },
  Nuncio: {
    vision: "The end of cold outreach.",
    visionBody: [
      "No templates. No mail merge. A video that sounds like the sender wrote it for the recipient, because the agent did. The use cases are horizontal but high-value: sales prospecting, investor pitches, recruiting outreach, freelancer pitches, and conference follow-up.",
      "The strategic value is a reusable personalization engine. Point the same agent room at LinkedIn, GitHub, Twitter/X, or any public profile, choose an intent chip, and produce a 1-to-1 asset at the cost of API calls.",
    ],
    proof: "Live pipeline, demo mode, and a branded share surface.",
    proofPoints: [
      "Four specialized agents in a Band room: researcher (TinyFish), copywriter, QA, and producer (ElevenLabs audio, HeyGen video).",
      "Demo mode runs end-to-end with cached data and no API keys.",
      "Voice input via Speechmatics, platform auto-detection, and LLM fallback.",
      "Every shared video URL is a marketing surface with a “Make your own” CTA.",
    ],
  },
  Lenitnes: {
    vision: "The public track record is the sales proof.",
    visionBody: [
      "One engine serves two audiences. Publicly, the agent trades its own theses in the open and builds a verifiable reputation. Enterprise customers point the same nine detectors and versioned rubric at their own repos to ask: what is our commit history telling the market before we announce it?",
      "The leak-scan direction turns a research tool into a recurring intelligence product for protocols, custodians, and market makers who need to know what their code is signaling before outsiders do.",
    ],
    proof: "The ZEC halo2 case study.",
    proofPoints: [
      "In late May 2026, a four-year-old soundness bug was discovered in Zcash's halo2_gadgets crate. The emergency soft fork landed on 2 June; formal disclosure followed 4–5 June. ZEC dropped ~50% in 48 hours.",
      "Replayed against public commits, the agent would have flagged a 95/100 conviction, four-detector-consensus SHORT at ~$600 — 2–3 days before the formal disclosure.",
      "Every signal is scored against a versioned rubric, timestamped on Hedera HCS, and tracked as an explicitly-labeled paper position with T+1h/T+4h/T+1d/T+7d price snapshots.",
      "The public scorecard recomputes from the same tables the calls are written to — the system cannot misremember its own performance.",
    ],
  },
  DataBard: {
    vision: "Metadata finally gets consumed.",
    visionBody: [
      "Data teams spend weeks onboarding engineers to warehouse semantics. The metadata is there, but nobody reads it. DataBard turns the same analysis into podcasts, reports, and alerts so the right information reaches the right person in the right format.",
      "Alex is the enthusiastic advocate; Morgan is the skeptical auditor. Their conversation surfaces cascading risks, ownership gaps, and stale tables in plain language. The moat is a single analysis engine with many output surfaces — every podcast, report, and alert reinforces the same underlying metadata graph, so value compounds with each new integration.",
    ],
    proof: "Two-voice podcasts, on-chain audit trails, and live dashboards.",
    proofPoints: [
      "Two-voice ElevenLabs TTS with context stitching for natural prosody.",
      "Solana integration: minted episode records, Palm USD payments, health alerts, public leaderboard, gated replay.",
      "Health analytics dashboard, README badges, and an event ledger for funnel analysis.",
      "Tier 1 adapters for OpenMetadata, dbt, The Graph, Dune; Tier 2 Coral SQL escape hatch for 50+ sources.",
    ],
  },
  Weft: {
    vision: "Every grant disbursement moves at the speed of verified delivery.",
    visionBody: [
      "Program officers and grants managers at foundations, public programs, and corporate grant arms burn their weeks reconciling deliverables, chasing evidence, and unblocking tranches stuck in review queues. Weft sits beside the grant system of record — Fluxx, Foundant, AmpliFund, Submittable, Salesforce Nonprofit — runs a fixed checklist when a milestone is claimed, and writes a verification receipt back onto the grant record so disbursement isn't gated by manual review.",
      "The moat is the verification loop: a fixed, auditable checklist that produces a receipt the grants team can act on without re-doing the work. Private settlement on Canton is optional pilot infrastructure — a lab for moving capital the same way verification moves — not the sales lead.",
    ],
    proof: "Live production ops surface + GMS ingest/receipt API. Settlement labeled Canton Devnet pilot — not mainnet capital movement.",
    proofPoints: [
      "Production ops surface with GMS ingest and verification-receipt API for post-award milestones.",
      "Checklist-driven verification that writes a receipt back onto the grant record.",
      "Settlement pilot on Canton Devnet (CBTC) and 0G escrow — labeled pilot, not mainnet capital movement.",
      "Prior FHE consensus work (Zama sealed-ballot contracts on 0G Galileo and Sepolia) carries forward as the optional settlement rail.",
    ],
  },
  Diversifi: {
    vision: "Every cross-currency business gets an autonomous treasury guard.",
    visionBody: [
      "No current player combines FX-risk quantification with autonomous execution. DiversiFi makes the moat structural: a philosophy-driven values system creates identity-based retention, while the Guardian turns working-capital risk into a managed, auditable operating layer.",
      "The expansion is from the retail saver who protects a wallet to the Ghanaian importer, the US retailer sourcing from Europe, and the UK business paying US suppliers — any company whose margins move when exchange rates do.",
    ],
    proof: "Live on Celo, Arbitrum and 0G mainnets with verified ledgers.",
    proofPoints: [
      "Chain-aware RecommendationLedgers deployed on Celo Mainnet (savings), Arbitrum Mainnet (yield), and 0G Mainnet (evidence anchor).",
      "ERC-8004 agent identity and verified contracts on Celoscan, Arbiscan, and 0G ChainScan.",
      "x402 nanopayment settlement rail for paid intelligence, with live settlement metrics.",
      "In-app Verifiable AI dashboard showing evidence CIDs, serving-model IDs, and chain receipts.",
    ],
  },
};

export default function StudioPage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Header />

      <main>
        <Thesis />
        <BatonRule />
        <Portfolio />
        <BatonRule />
        <OperatingModel />
      </main>

      <Footer />
    </div>
  );
}

function Thesis() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-5 sm:px-10 pt-32 pb-24 bg-background text-foreground">
      <div className="max-w-5xl mx-auto w-full">
        <p className="section-kicker text-muted mb-5" data-enter>The studio thesis</p>
        <blockquote
          className="max-w-3xl text-3xl sm:text-5xl font-medium italic leading-snug text-foreground"
          data-enter
          style={{ "--enter-delay": "20ms" } as React.CSSProperties}
        >
          &ldquo;The future is already here — it&rsquo;s just not evenly distributed.&rdquo;
          <cite className="mt-4 block text-xs not-italic font-mono uppercase tracking-[0.15em] text-muted">
            William Gibson
          </cite>
        </blockquote>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div data-enter style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
              Risk builds where no one is looking. Our agents work there.
            </h1>
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
              Run as a studio, the six products compound on each other — each
              serves a different enterprise buyer, and every integration hardens
              the next. The aim is an operating layer businesses trust to act on
              their behalf.
            </p>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border rounded-2xl overflow-hidden"
          data-enter
          style={{ "--enter-delay": "120ms" } as React.CSSProperties}
        >
          {PRODUCTS.map((p) => (
            <a
              key={p.name}
              href={`#${p.name.toLowerCase()}`}
              className="bg-background p-5 sm:p-6 hover:bg-border/30 transition-colors"
            >
              <p className="section-label text-muted mb-1">{p.thesisLabel}</p>
              <p className="text-sm sm:text-base font-semibold">{p.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-10 bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-6">
        <p className="section-kicker text-muted mb-10" data-enter>
          Vision &amp; proof, product by product
        </p>
        {PRODUCTS.map((p) => (
          <ProductCase key={p.name} project={p} studioCase={CASES[p.name]} />
        ))}
      </div>
    </section>
  );
}

function ProductCase({
  project: p,
  studioCase,
}: {
  project: BaseProject;
  studioCase: StudioCase;
}) {
  return (
    <article
      id={p.name.toLowerCase()}
      className="rounded-3xl border border-border p-6 sm:p-10"
      style={{ background: p.bg, color: p.fg }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
        <p className="section-kicker" style={{ color: p.muted }}>
          {p.number} / {p.name} — {p.thesisLabel}
        </p>
        <a
          href={p.entityHref}
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: p.accent }}
        >
          Entity page →
        </a>
        <a
          href={p.href}
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: p.accent }}
        >
          Visit {p.name} →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        <div>
          <p className="section-label mb-3" style={{ color: p.accent }}>
            The vision
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight mb-4">
            {studioCase.vision}
          </h2>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: p.muted }}>
            {studioCase.visionBody.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <p className="section-label mb-3" style={{ color: p.accent }}>
            The proof
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight mb-4">
            {studioCase.proof}
          </h3>
          <ul
            className="space-y-3 text-sm sm:text-base leading-relaxed list-disc pl-5"
            style={{ color: p.muted }}
          >
            {studioCase.proofPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function OperatingModel() {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-10 bg-background text-foreground">
      <div className="max-w-5xl mx-auto">
        <p className="section-kicker text-muted mb-5" data-enter>The operating model</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div data-enter style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
              Built to compound.
            </h2>
            <p className="mt-6 text-muted leading-relaxed">
              Six agents, six buyers, one pattern. Every product plugs into the
              system where a compounding risk lives, and every integration the
              studio ships hardens the next one. All six are live today and all
              six are open source — the repos, contracts, and scorecards are
              public.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CONNECT_URL}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/30 transition-colors"
              >
                Connect on X →
              </a>
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                ← Back to the X-ray
              </Link>
            </div>
          </div>

          <div data-enter style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
            <p className="section-label text-muted mb-4">Request the deck</p>
            <ContactForm
              submitLabel="Request the deck →"
              intent="deck"
              messagePlaceholder="Tell us who you are and what you'd like to see."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
