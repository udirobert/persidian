import type { DiagnosticAnswers } from "@/lib/diagnostic";
import type { ExtractedPage } from "@/lib/site-scan/extract";
import type { ScanFact, ScanResult } from "@/lib/site-scan/types";

const TOOL_MAP: Record<string, string> = {
  xero: "Xero / QuickBooks / Sage",
  quickbooks: "Xero / QuickBooks / Sage",
  sage: "Xero / QuickBooks / Sage",
  salesforce: "Salesforce / HubSpot / LinkedIn",
  hubspot: "Salesforce / HubSpot / LinkedIn",
  linkedin: "Salesforce / HubSpot / LinkedIn",
  github: "GitHub / GitLab",
  gitlab: "GitHub / GitLab",
  dbt: "Warehouse / dbt / OpenMetadata / Dune",
  snowflake: "Warehouse / dbt / OpenMetadata / Dune",
  openmetadata: "Warehouse / dbt / OpenMetadata / Dune",
  fluxx: "Fluxx / Foundant / AmpliFund / Submittable",
  foundant: "Fluxx / Foundant / AmpliFund / Submittable",
  amplifund: "Fluxx / Foundant / AmpliFund / Submittable",
  submittable: "Fluxx / Foundant / AmpliFund / Submittable",
};

const PAIN_SIGNALS: { pattern: RegExp; pain: string }[] = [
  { pattern: /\b(invoice|receivable|payment terms|accounts receivable)\b/i, pain: "Late invoices & unpaid receivables" },
  { pattern: /\b(outreach|prospect|sales pipeline|cold email)\b/i, pain: "Low reply rates on cold outreach" },
  { pattern: /\b(grant|milestone|disbursement|foundation)\b/i, pain: "Grant milestones claimed but tranche stuck in review" },
  { pattern: /\b(data quality|metadata|lineage|warehouse)\b/i, pain: "Data nobody reads or trusts" },
  { pattern: /\b(fx|foreign exchange|currency|treasury|cross-border)\b/i, pain: "Cross-currency FX drag" },
  { pattern: /\b(security audit|consensus|protocol|blockchain|commit)\b/i, pain: "Code changes that affect consensus or security" },
];

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function buildFacts(page: ExtractedPage, pageUrl: string): ScanFact[] {
  const facts: ScanFact[] = [];
  const source = { label: "Homepage", url: pageUrl };

  if (page.description || page.h1 || page.title) {
    facts.push({
      id: "company-description",
      kind: "found",
      text: page.description || page.h1 || page.title || "Company website detected",
      confidence: "high",
      sources: [source],
    });
  }

  if (page.businessModel !== "unknown") {
    facts.push({
      id: "business-model",
      kind: "inferred",
      text: page.businessModel === "b2b" ? "Likely B2B motion" : "Likely B2C motion",
      confidence: "medium",
      sources: [source],
    });
  }

  if (page.regions.length) {
    facts.push({
      id: "regions",
      kind: "found",
      text: `Markets mentioned: ${page.regions.join(", ")}`,
      confidence: "medium",
      sources: [source],
    });
  }

  if (page.integrations.length) {
    facts.push({
      id: "integrations",
      kind: "found",
      text: `Public integrations or tools referenced: ${page.integrations.join(", ")}`,
      confidence: "high",
      sources: [source],
    });
  }

  if (page.internalLinks.some((l) => /integrat|partner|platform|security|trust/i.test(l))) {
    facts.push({
      id: "trust-pages",
      kind: "found",
      text: "Public integrations or trust pages detected in site navigation",
      confidence: "medium",
      sources: [source],
    });
  }

  const matchedPains = PAIN_SIGNALS.filter(({ pattern }) => pattern.test(page.textSample)).map(
    (p) => p.pain
  );
  for (const pain of unique(matchedPains).slice(0, 2)) {
    facts.push({
      id: `pain-${pain}`,
      kind: "inferred",
      text: `${pain} may be operationally relevant based on site language`,
      confidence: "medium",
      sources: [source],
    });
  }

  facts.push({
    id: "unknown-receivables",
    kind: "unknown",
    text: "Your website cannot tell us how much revenue is overdue, current FX exposure, or internal data quality scores",
    confidence: "high",
    sources: [],
  });

  return facts;
}

export function mapToDiagnosticAnswers(page: ExtractedPage): Partial<DiagnosticAnswers> {
  const tools = unique(
    page.integrations.map((i) => TOOL_MAP[i]).filter(Boolean) as string[]
  );
  const pains = unique(
    PAIN_SIGNALS.filter(({ pattern }) => pattern.test(page.textSample)).map((p) => p.pain)
  );

  let role: string | undefined;
  if (page.integrations.some((i) => ["xero", "quickbooks", "sage"].includes(i))) {
    role = "Finance / Accounting";
  } else if (page.integrations.some((i) => ["salesforce", "hubspot", "linkedin"].includes(i))) {
    role = "Sales / Marketing / Growth";
  } else if (page.integrations.some((i) => ["github", "gitlab"].includes(i))) {
    role = "Engineering / Protocol / Security";
  } else if (page.integrations.some((i) => ["dbt", "snowflake", "openmetadata"].includes(i))) {
    role = "Data / Analytics";
  } else if (page.integrations.some((i) => ["fluxx", "foundant", "amplifund", "submittable"].includes(i))) {
    role = "Grants / Program / Foundation ops";
  }

  return {
    role,
    painPoints: pains.length ? pains : undefined,
    tools: tools.length ? tools : undefined,
  };
}

export function buildFollowUpQuestion(
  page: ExtractedPage,
  facts: ScanFact[]
): ScanResult["followUpQuestion"] {
  const options: string[] = [];

  if (page.integrations.includes("xero") || facts.some((f) => /receivable|invoice/i.test(f.text))) {
    options.push("Overdue invoices and receivables");
  }
  if (page.regions.length > 1 || /\b(currency|fx|international|global)\b/i.test(page.textSample)) {
    options.push("Currency exposure across markets");
  }
  if (/\b(outreach|sales|prospect|pipeline)\b/i.test(page.textSample)) {
    options.push("Prospecting and outreach effort");
  }
  if (/\b(grant|milestone|foundation)\b/i.test(page.textSample)) {
    options.push("Grant milestone verification backlog");
  }
  if (/\b(data|metadata|warehouse|analytics)\b/i.test(page.textSample)) {
    options.push("Data quality and metadata trust");
  }
  if (/\b(protocol|blockchain|security|consensus)\b/i.test(page.textSample)) {
    options.push("Commit-level security signals");
  }

  const uniqueOptions = unique(options).slice(0, 4);
  if (uniqueOptions.length < 2) {
    return {
      id: "primary-pain",
      label: "Which hidden cost is hurting most right now?",
      options: [
        "Late invoices & unpaid receivables",
        "Low reply rates on cold outreach",
        "Cross-currency FX drag",
        "Data nobody reads or trusts",
      ],
    };
  }

  const regionHint = page.regions.length
    ? `We found signals across ${page.regions.join(" and ")}`
    : "From your public site";
  const toolHint = page.integrations.length
    ? ` and references to ${page.integrations.slice(0, 2).join(" and ")}`
    : "";

  return {
    id: "primary-pain",
    label: `${regionHint}${toolHint}. Which is costing more today?`,
    options: uniqueOptions,
  };
}

export function painFromFollowUp(option: string): string {
  return option;
}
