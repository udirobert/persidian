import type { EvidenceLink } from "@/lib/evidence";

export interface ProductEntity {
  headline: string;
  whoFor: string;
  problem: string;
  systems: string[];
  canRead: string[];
  canWrite: string[];
  approvalGate: string;
  liveToday: string;
  evidence: EvidenceLink[];
  nextStep: string;
  buyerIntents: string[];
  body: string[];
}

export const PRODUCT_ENTITIES: Record<string, ProductEntity> = {
  sikizana: {
    headline: "AI credit control and bookkeeping for Xero",
    whoFor:
      "Finance leads, bookkeepers, and founders at UK small businesses on Xero who need receivables chased and books explained without hiring a full finance team.",
    problem:
      "Cash already earned slips away because nobody ages receivables, benchmarks payment behaviour, or chases overdue invoices consistently.",
    systems: ["Xero"],
    canRead: [
      "Invoices, contacts, and receivables from Xero",
      "P&L and balance sheet reports",
      "Receipt images uploaded by the user",
    ],
    canWrite: [
      "Draft chase emails with statutory interest calculations",
      "Bookkeeping entries and receipt matches — only after human approval",
    ],
    approvalGate:
      "Every write-back to Xero is gated at the tool layer. The agent proposes; a human approves before anything changes in the ledger.",
    liveToday:
      "Production Xero integration with 19 permissioned tools, tax RAG, receipt vision, and a live books chat surface.",
    evidence: [
      { label: "GitHub — 77-test suite", href: "https://github.com/udirobert/sikizana" },
      { label: "Live product", href: "https://sikizana.persidian.com" },
      { label: "Entity page", href: "https://persidian.com/agents/sikizana" },
    ],
    nextStep: "Connect Xero in the Sikizana demo or book a walkthrough from the homepage contact form.",
    buyerIntents: [
      "AI credit controller for Xero",
      "Automated invoice chasing UK",
      "AI bookkeeper for small business",
    ],
    body: [
      "Sikizana connects to Xero and runs a proactive audit before you type a word. It ages receivables into 30/60/90-day buckets, benchmarks payment behaviour against your sector, scores customers RED/AMBER/GREEN, and drafts escalating chase emails with statutory interest and late-payment compensation already calculated.",
      "It also explains your P&L in plain English, estimates UK Corporation Tax with HMRC citations, and matches receipts from a photo.",
    ],
  },
  nuncio: {
    headline: "Personalized video outreach agents",
    whoFor:
      "Sales, recruiting, and growth teams who need 1-to-1 video outreach at scale — and founders doing investor or conference follow-up.",
    problem:
      "Cold outreach reply rates stay in single digits because templates feel generic. Video is personal but too slow to produce manually.",
    systems: ["Public web profiles", "LinkedIn", "GitHub", "Company websites"],
    canRead: [
      "Public profile and company pages via researcher agent",
      "User-provided brief and intent",
    ],
    canWrite: [
      "Personalized scripts and rendered videos",
      "Branded share pages with captions and translations",
    ],
    approvalGate:
      "Copy and final video render require sign-off before anything is sent or published.",
    liveToday:
      "Live multi-agent pipeline with demo mode, voice input, and branded share surfaces.",
    evidence: [
      { label: "GitHub repository", href: "https://github.com/udirobert/nuncio" },
      { label: "Live demo", href: "https://nuncio.persidian.com" },
    ],
    nextStep: "Run a URL-to-video demo on nuncio.persidian.com or book a walkthrough.",
    buyerIntents: [
      "Personalized video outreach",
      "AI sales prospecting video",
      "Multi-agent video personalization",
    ],
    body: [
      "Give Nuncio a prospect's URL and a brief. A researcher enriches the profile, a copywriter drafts the angle and script, a QA agent checks length and brand safety, and a producer renders the finished video — with your sign-off before anything renders.",
      "The result lands on a branded page with captions, sharing, and translation into eight languages.",
    ],
  },
  lenitnes: {
    headline: "Repository signal intelligence for consensus-critical code",
    whoFor:
      "Protocol teams, security researchers, custodians, and market makers who need commit-level signal before the market prices it in.",
    problem:
      "Consensus-critical code changes can move markets in hours. Manual review cannot keep pace with public commit velocity.",
    systems: ["GitHub", "Public protocol repositories"],
    canRead: [
      "Public commits to watched repositories",
      "Versioned rubric scores and detector consensus",
    ],
    canWrite: [
      "Timestamped theses on Hedera HCS",
      "Public scorecard entries — paper positions with explicit labels",
    ],
    approvalGate:
      "Enterprise deployments can require human review before theses are published or acted on.",
    liveToday:
      "Live public scorecard with nine detectors, versioned rubric, and on-chain timestamps.",
    evidence: [
      { label: "GitHub repository", href: "https://github.com/sneldao/lenitnes" },
      { label: "Public scorecard", href: "https://lenitnes.persidian.com" },
    ],
    nextStep: "Inspect the public scorecard or request an enterprise repo watchlist demo.",
    buyerIntents: [
      "Commit signal intelligence",
      "Protocol security monitoring",
      "On-chain thesis scorecard",
    ],
    body: [
      "Lenitnes watches public commits to consensus-critical repositories and infers directional theses before the market prices them in. Every call is timestamped, scored against a versioned rubric, and tracked on a public scorecard that cannot misremember its own record.",
    ],
  },
  databard: {
    headline: "AI metadata and data-quality analysis",
    whoFor:
      "Data platform teams, analytics leads, and engineering managers who need warehouse health surfaced in formats people actually consume.",
    problem:
      "Metadata exists but nobody reads it. Data quality degrades quietly until a dashboard breaks or a compliance question arrives.",
    systems: ["OpenMetadata", "dbt", "The Graph", "Dune", "SQL warehouses"],
    canRead: [
      "Catalog metadata, lineage, and test results",
      "Warehouse schemas via SQL escape hatch",
    ],
    canWrite: [
      "Podcasts, dashboards, reports, and on-chain attestations",
      "Alerts — configured thresholds only",
    ],
    approvalGate:
      "No catalog or warehouse writes without explicit integration configuration and approval.",
    liveToday:
      "Two-voice podcasts, health dashboards, Tier 1 adapters, and Solana attestation surfaces.",
    evidence: [
      { label: "GitHub repository", href: "https://github.com/thisyearnofear/databard" },
      { label: "Live product", href: "https://databard.persidian.com" },
    ],
    nextStep: "Connect a catalog or run the SQL escape hatch demo.",
    buyerIntents: [
      "Data quality monitoring AI",
      "Metadata podcast generator",
      "Data estate health scoring",
    ],
    body: [
      "DataBard connects to your catalog and warehouse, computes health scores, critical-table rankings, coverage gaps, and PII flags — then delivers the findings in podcasts, dashboards, reports, and alerts.",
      "Click any podcast segment to drill into the exact columns, tests, and lineage behind the insight.",
    ],
  },
  weft: {
    headline: "Post-award grant verification",
    whoFor:
      "Program officers and grants managers on Fluxx, Foundant, AmpliFund, Submittable, or Salesforce Nonprofit.",
    problem:
      "Milestone claims sit in review queues while tranches stay blocked. Manual verification repeats the same checklist work.",
    systems: ["Fluxx", "Foundant", "AmpliFund", "Submittable", "Salesforce Nonprofit"],
    canRead: [
      "Milestone claims and attached evidence from GMS integrations",
      "Checklist criteria configured per program",
    ],
    canWrite: [
      "Verification receipts back onto the grant record",
      "Optional Canton Devnet settlement pilot — labeled pilot, not mainnet",
    ],
    approvalGate:
      "Disbursement decisions remain with the grants team. Weft produces the verification receipt; humans approve tranche release.",
    liveToday:
      "Production ops surface with GMS ingest and verification-receipt API. Settlement is a labeled Canton Devnet pilot.",
    evidence: [
      { label: "GitHub repository", href: "https://github.com/thisyearnofear/weft" },
      { label: "Production surface", href: "https://weft.thisyearnofear.com" },
    ],
    nextStep: "Request a GMS integration walkthrough or inspect the ops surface.",
    buyerIntents: [
      "Grant milestone verification",
      "Post-award compliance automation",
      "Fluxx grant verification agent",
    ],
    body: [
      "When a grantee marks a milestone complete, Weft runs a fixed checklist against the evidence and returns a verification receipt to write onto the grant record — so the tranche isn't stuck in a review queue.",
      "Private settlement on Canton is optional pilot infrastructure — not the sales lead, and no mainnet capital movement is claimed.",
    ],
  },
  diversifi: {
    headline: "Autonomous FX and treasury risk management",
    whoFor:
      "Treasury, finance, and operations teams with cross-currency exposure — importers, exporters, and trading houses.",
    problem:
      "Earning in one currency and paying in another creates FX drag that compounds silently against working capital margins.",
    systems: ["Celo", "Arbitrum", "0G mainnets", "Treasury wallets"],
    canRead: [
      "Wallet balances and exposure positions",
      "Market rates and policy constraints",
    ],
    canWrite: [
      "Guardian routing decisions recorded on-chain",
      "Recommendation ledger entries with AI reasoning anchored to evidence",
    ],
    approvalGate:
      "Autonomous execution operates within configured policy bounds. Policy changes and large moves require human approval.",
    liveToday:
      "Live on Celo, Arbitrum, and 0G mainnets with verified, publicly auditable decision ledgers.",
    evidence: [
      { label: "GitHub repository", href: "https://github.com/thisyearnofear/diversify" },
      { label: "Verified ledgers", href: "https://diversifi.persidian.com" },
    ],
    nextStep: "Inspect the public decision ledger or book a treasury policy walkthrough.",
    buyerIntents: [
      "Autonomous FX hedging",
      "Treasury risk management AI",
      "Cross-border working capital protection",
    ],
    body: [
      "Diversifi quantifies what earning in one currency and buying in another costs your working capital. Its Guardian agent routes capital to flatten that risk automatically, every decision recorded on an auditable public ledger.",
    ],
  },
};

export function getProductEntity(slug: string): ProductEntity | undefined {
  return PRODUCT_ENTITIES[slug];
}
