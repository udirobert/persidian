export interface BaseProject {
  number: string;
  name: string;
  slug: string;
  href: string;
  entityHref: string;
  repo: string;
  tagline: string;
  thesisLabel: string;
  /** Scale of the problem this agent works on, from public data. */
  problemStat: string;
  problemLabel: string;
  iconName: string;
  shot: string;
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  fontClass?: string;
}

export const PRODUCT_SLUGS = [
  "sikizana",
  "nuncio",
  "lenitnes",
  "databard",
  "weft",
  "diversifi",
] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export const PRODUCTS: BaseProject[] = [
  {
    number: "01",
    name: "Sikizana",
    slug: "sikizana",
    href: "https://sikizana.persidian.com",
    entityHref: "/agents/sikizana",
    repo: "https://github.com/udirobert/sikizana",
    tagline:
      "Get paid faster, with Xero. AI credit controller and bookkeeper that ages receivables, benchmarks your sector, and chases overdue invoices.",
    thesisLabel: "Money in",
    problemStat: "£20bn+",
    problemLabel: "owed to UK small businesses in overdue invoices at any one time",
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
    slug: "nuncio",
    href: "https://nuncio.persidian.com",
    entityHref: "/agents/nuncio",
    repo: "https://github.com/udirobert/nuncio",
    tagline:
      "Send a video they'll actually watch. Multi-agent video personalization for sales, recruiting, and investor outreach.",
    thesisLabel: "Messages out",
    problemStat: "<5%",
    problemLabel: "of cold outreach ever gets a reply",
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
    slug: "lenitnes",
    href: "https://lenitnes.persidian.com",
    entityHref: "/agents/lenitnes",
    repo: "https://github.com/sneldao/lenitnes",
    tagline:
      "Autonomous signal intelligence. Reads commits to consensus-critical code, commits theses on-chain, and tracks an undeniable public scorecard.",
    thesisLabel: "Theses tested",
    problemStat: "48 hrs",
    problemLabel: "for ZEC to lose half its value after a years-old code flaw surfaced",
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
    slug: "databard",
    href: "https://databard.persidian.com",
    entityHref: "/agents/databard",
    repo: "https://github.com/thisyearnofear/databard",
    tagline:
      "Watches your data estate. Health scores, lineage risk, and PII flags — delivered as podcasts, dashboards, reports, and on-chain attestations.",
    thesisLabel: "Data trusted",
    problemStat: "$12.9M",
    problemLabel: "average annual cost of poor data quality per organisation",
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
    slug: "weft",
    href: "https://weft.thisyearnofear.com",
    entityHref: "/agents/weft",
    repo: "https://github.com/thisyearnofear/weft",
    tagline:
      "When a grantee marks a milestone complete, Weft checks your checklist and writes a verification receipt onto that grant record.",
    thesisLabel: "Tranche unblocked",
    problemStat: "11–20 hrs",
    problemLabel: "per week grants teams spend on manual entry, reporting, and post-award paperwork",
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
    slug: "diversifi",
    href: "https://diversifi.persidian.com",
    entityHref: "/agents/diversifi",
    repo: "https://github.com/thisyearnofear/diversify",
    tagline:
      "Risk-aware, values-driven treasury management. Quantifies FX drag on working capital and autonomously flattens it — every decision recorded on-chain with AI reasoning anchored to 0G.",
    thesisLabel: "Currency guarded",
    problemStat: "10%+",
    problemLabel: "routine yearly swing in major currency pairs — bigger than most trading margins",
    iconName: "diversifi",
    shot: "/shots/diversifi.png",
    bg: "#f0f4f9",
    fg: "#0f172a",
    accent: "#2563eb",
    muted: "#64748b",
    fontClass: "",
  },
];

export function getProductBySlug(slug: string): BaseProject | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
