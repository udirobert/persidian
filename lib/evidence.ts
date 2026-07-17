export interface EvidenceLink {
  label: string;
  href: string;
}

export interface IndustryStatSource {
  product: string;
  stat: string;
  source: string;
  href: string;
}

export const INDUSTRY_STAT_SOURCES: IndustryStatSource[] = [
  {
    product: "Sikizana",
    stat: "£20bn+ owed to UK small businesses in overdue invoices",
    source: "Federation of Small Businesses late payment research",
    href: "https://www.fsb.org.uk/media-centre/press-releases/late-payment-crisis-costing-small-businesses-billions.html",
  },
  {
    product: "Nuncio",
    stat: "<5% of cold outreach gets a reply",
    source: "Belkins cold email response rate benchmarks",
    href: "https://belkins.io/blog/cold-email-response-rates",
  },
  {
    product: "Lenitnes",
    stat: "48 hrs for ZEC to lose half its value after a code flaw surfaced",
    source: "Zcash halo2 disclosure timeline (May–June 2026)",
    href: "https://github.com/zcash/halo2",
  },
  {
    product: "DataBard",
    stat: "$12.9M average annual cost of poor data quality",
    source: "Gartner estimate via industry surveys",
    href: "https://www.gartner.com/en/data-analytics/topics/data-quality",
  },
  {
    product: "Weft",
    stat: "11–20 hrs per week on manual grant reporting",
    source: "Fluxx foundation operations research",
    href: "https://www.fluxx.io/resources",
  },
  {
    product: "Diversifi",
    stat: "10%+ routine yearly swing in major currency pairs",
    source: "Bank for International Settlements FX market overview",
    href: "https://www.bis.org/statistics/rpfx22.htm",
  },
];

export const PRODUCT_EVIDENCE: Record<string, EvidenceLink[]> = {
  Sikizana: [
    { label: "GitHub repository", href: "https://github.com/udirobert/sikizana" },
    { label: "Live product", href: "https://sikizana.persidian.com" },
    { label: "Xero integration surface", href: "https://sikizana.persidian.com" },
  ],
  Nuncio: [
    { label: "GitHub repository", href: "https://github.com/udirobert/nuncio" },
    { label: "Live demo", href: "https://nuncio.persidian.com" },
  ],
  Lenitnes: [
    { label: "GitHub repository", href: "https://github.com/sneldao/lenitnes" },
    { label: "Public scorecard", href: "https://lenitnes.persidian.com" },
  ],
  DataBard: [
    { label: "GitHub repository", href: "https://github.com/thisyearnofear/databard" },
    { label: "Live product", href: "https://databard.persidian.com" },
  ],
  Weft: [
    { label: "GitHub repository", href: "https://github.com/thisyearnofear/weft" },
    { label: "Production ops surface", href: "https://weft.thisyearnofear.com" },
  ],
  Diversifi: [
    { label: "GitHub repository", href: "https://github.com/thisyearnofear/diversify" },
    { label: "Verified decision ledgers", href: "https://diversifi.persidian.com" },
  ],
};
