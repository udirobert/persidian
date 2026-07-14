export interface BaseProject {
  number: string;
  name: string;
  href: string;
  repo: string;
  tagline: string;
  thesisLabel: string;
  iconName: string;
  shot: string;
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  fontClass?: string;
}

export const PRODUCTS: BaseProject[] = [
  {
    number: "01",
    name: "Sikizana",
    href: "https://sikizana.persidian.com",
    repo: "https://github.com/udirobert/sikizana",
    tagline:
      "Get paid faster, with Xero. AI credit controller and bookkeeper that ages receivables, benchmarks your sector, and chases overdue invoices.",
    thesisLabel: "Money in",
    iconName: "receipt",
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
    thesisLabel: "Messages out",
    iconName: "paperPlane",
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
    thesisLabel: "Theses tested",
    iconName: "pulse",
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
    thesisLabel: "Data trusted",
    iconName: "watcher",
    shot: "/shots/databard.png",
    bg: "#f5ede0",
    fg: "#3a2a1a",
    accent: "#b45309",
    muted: "#78716c",
    fontClass: "",
  },
  {
    number: "05",
    name: "Weft",
    href: "https://weft.persidian.com",
    repo: "https://github.com/thisyearnofear/weft",
    tagline:
      "Escrow that releases itself. FHE-sealed agent consensus verifies milestones and unlocks capital without manual review.",
    thesisLabel: "Capital released",
    iconName: "weave",
    shot: "/shots/weft.png",
    bg: "#f4f8f7",
    fg: "#1c211f",
    accent: "#059669",
    muted: "#5f6e6a",
    fontClass: "",
  },
  {
    number: "06",
    name: "Diversifi",
    href: "https://diversifi.persidian.com",
    repo: "https://github.com/thisyearnofear/diversify",
    tagline:
      "Risk-aware, values-driven treasury management. Quantifies FX drag on working capital and autonomously flattens it — every decision recorded on-chain with AI reasoning anchored to 0G.",
    thesisLabel: "Currency guarded",
    iconName: "diversifi",
    shot: "/shots/diversifi.png",
    bg: "#f0f4f9",
    fg: "#0f172a",
    accent: "#2563eb",
    muted: "#64748b",
    fontClass: "",
  },
];
