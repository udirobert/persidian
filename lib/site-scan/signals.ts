import type { DiagnosticAnswers } from "@/lib/diagnostic";
import type { ExtractedPage } from "@/lib/site-scan/extract";
import type { PageExtract } from "@/lib/site-scan/merge";
import type {
  FactReviewStatus,
  FactSignals,
  ScanFact,
  ScanResult,
} from "@/lib/site-scan/types";

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

function roleFromIntegrations(integrations: string[]): string | undefined {
  if (integrations.some((i) => ["xero", "quickbooks", "sage"].includes(i))) {
    return "Finance / Accounting";
  }
  if (integrations.some((i) => ["salesforce", "hubspot", "linkedin"].includes(i))) {
    return "Sales / Marketing / Growth";
  }
  if (integrations.some((i) => ["github", "gitlab"].includes(i))) {
    return "Engineering / Protocol / Security";
  }
  if (integrations.some((i) => ["dbt", "snowflake", "openmetadata"].includes(i))) {
    return "Data / Analytics";
  }
  if (integrations.some((i) => ["fluxx", "foundant", "amplifund", "submittable"].includes(i))) {
    return "Grants / Program / Foundation ops";
  }
  return undefined;
}

function toolsFromIntegrations(integrations: string[]): string[] {
  return unique(
    integrations.map((i) => TOOL_MAP[i]).filter(Boolean) as string[]
  );
}

export function deriveAnswersFromFactReview(
  facts: ScanFact[],
  statuses: Record<string, FactReviewStatus>
): DiagnosticAnswers {
  const answers: DiagnosticAnswers = {};
  const pains = new Set<string>();
  const tools = new Set<string>();
  let role: string | undefined;

  for (const fact of facts) {
    if (fact.kind === "unknown") continue;
    const status = statuses[fact.id] ?? "unsure";
    if (status !== "confirmed" || !fact.signals) continue;

    if (fact.signals.role && !role) role = fact.signals.role;
    fact.signals.painPoints?.forEach((pain) => pains.add(pain));
    fact.signals.tools?.forEach((tool) => tools.add(tool));
  }

  if (role) answers.role = role;
  if (pains.size) answers.painPoints = [...pains];
  if (tools.size) answers.tools = [...tools];
  return answers;
}

function sourcesForPages(entries: PageExtract[]): { label: string; url: string }[] {
  return entries.map(({ url }) => ({
    label: new URL(url).pathname || "/",
    url,
  }));
}

function sourcesWhere(
  entries: PageExtract[],
  predicate: (page: ExtractedPage) => boolean
): { label: string; url: string }[] {
  return entries
    .filter(({ page }) => predicate(page))
    .map(({ url }) => ({
      label: new URL(url).pathname || "/",
      url,
    }));
}

export function buildFacts(entries: PageExtract[]): ScanFact[] {
  if (!entries.length) return [];

  const primary = entries[0];
  const page = entries.length === 1
    ? primary.page
    : {
        ...primary.page,
        textSample: entries.map(({ page: p }) => p.textSample).join("\n\n").slice(0, 16_000),
        internalLinks: unique(entries.flatMap(({ page: p }) => p.internalLinks)),
        integrations: unique(entries.flatMap(({ page: p }) => p.integrations)),
        regions: unique(entries.flatMap(({ page: p }) => p.regions)),
      };

  const facts: ScanFact[] = [];
  const primarySource = { label: "Homepage", url: primary.url };
  const allSources = sourcesForPages(entries);
  const integrationTools = toolsFromIntegrations(page.integrations);
  const integrationRole = roleFromIntegrations(page.integrations);

  if (page.description || page.h1 || page.title) {
    facts.push({
      id: "company-description",
      kind: "found",
      text: page.description || page.h1 || page.title || "Company website detected",
      confidence: "high",
      sources: [primarySource],
    });
  }

  if (entries.length > 1) {
    facts.push({
      id: "pages-inspected",
      kind: "found",
      text: `Inspected ${entries.length} public pages (homepage plus high-signal paths such as about, integrations, or security when available)`,
      confidence: "high",
      sources: allSources,
    });
  }

  if (page.businessModel !== "unknown") {
    facts.push({
      id: "business-model",
      kind: "inferred",
      text: page.businessModel === "b2b" ? "Likely B2B motion" : "Likely B2C motion",
      confidence: "medium",
      sources: allSources,
    });
  }

  if (page.regions.length) {
    facts.push({
      id: "regions",
      kind: "found",
      text: `Markets mentioned: ${page.regions.join(", ")}`,
      confidence: "medium",
      sources: sourcesWhere(entries, (p) => p.regions.length > 0).length
        ? sourcesWhere(entries, (p) => p.regions.length > 0)
        : allSources,
    });
  }

  if (page.integrations.length) {
    const signals: FactSignals = {};
    if (integrationRole) signals.role = integrationRole;
    if (integrationTools.length) signals.tools = integrationTools;

    facts.push({
      id: "integrations",
      kind: "found",
      text: `Public integrations or tools referenced: ${page.integrations.join(", ")}`,
      confidence: "high",
      sources: sourcesWhere(entries, (p) => p.integrations.length > 0),
      signals,
    });
  }

  if (page.internalLinks.some((l) => /integrat|partner|platform|security|trust/i.test(l))) {
    facts.push({
      id: "trust-pages",
      kind: "found",
      text: "Public integrations or trust pages detected in site navigation",
      confidence: "medium",
      sources: sourcesWhere(entries, (p) =>
        p.internalLinks.some((l) => /integrat|partner|platform|security|trust/i.test(l))
      ).length
        ? sourcesWhere(entries, (p) =>
            p.internalLinks.some((l) => /integrat|partner|platform|security|trust/i.test(l))
          )
        : allSources,
    });
  }

  const matchedPains = PAIN_SIGNALS.filter(({ pattern }) => pattern.test(page.textSample)).map(
    (p) => p.pain
  );
  for (const pain of unique(matchedPains).slice(0, 2)) {
    const pattern = PAIN_SIGNALS.find((p) => p.pain === pain)?.pattern;
    facts.push({
      id: `pain-${pain}`,
      kind: "inferred",
      text: `${pain} may be operationally relevant based on site language`,
      confidence: "medium",
      sources: pattern
        ? sourcesWhere(entries, (p) => pattern.test(p.textSample))
        : allSources,
      signals: { painPoints: [pain] },
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
  const tools = toolsFromIntegrations(page.integrations);
  const pains = unique(
    PAIN_SIGNALS.filter(({ pattern }) => pattern.test(page.textSample)).map((p) => p.pain)
  );
  const role = roleFromIntegrations(page.integrations);

  return {
    role,
    painPoints: pains.length ? pains : undefined,
    tools: tools.length ? tools : undefined,
  };
}

export function buildFollowUpQuestion(
  page: ExtractedPage,
  facts: ScanFact[],
  answers: DiagnosticAnswers
): ScanResult["followUpQuestion"] {
  const options: string[] = [];
  const confirmedTools = answers.tools ?? [];
  const confirmedPains = answers.painPoints ?? [];

  if (
    page.integrations.includes("xero") ||
    confirmedTools.some((t) => /xero|quickbooks|sage/i.test(t)) ||
    confirmedPains.some((p) => /invoice|receivable/i.test(p))
  ) {
    options.push("Overdue invoices and receivables");
  }
  if (
    page.regions.length > 1 ||
    /\b(currency|fx|international|global)\b/i.test(page.textSample) ||
    confirmedPains.some((p) => /currency|fx/i.test(p))
  ) {
    options.push("Currency exposure across markets");
  }
  if (
    /\b(outreach|sales|prospect|pipeline)\b/i.test(page.textSample) ||
    confirmedPains.some((p) => /outreach/i.test(p))
  ) {
    options.push("Prospecting and outreach effort");
  }
  if (
    /\b(grant|milestone|foundation)\b/i.test(page.textSample) ||
    confirmedPains.some((p) => /grant/i.test(p))
  ) {
    options.push("Grant milestone verification backlog");
  }
  if (
    /\b(data|metadata|warehouse|analytics)\b/i.test(page.textSample) ||
    confirmedPains.some((p) => /data/i.test(p))
  ) {
    options.push("Data quality and metadata trust");
  }
  if (
    /\b(protocol|blockchain|security|consensus)\b/i.test(page.textSample) ||
    confirmedPains.some((p) => /consensus|security|commit/i.test(p))
  ) {
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
    ? `From the submitted page, we found signals across ${page.regions.join(" and ")}`
    : "From the submitted page";
  const toolHint = page.integrations.length
    ? ` and references to ${page.integrations.slice(0, 2).join(" and ")}`
    : "";

  return {
    id: "primary-pain",
    label: `${regionHint}${toolHint}. Which is costing more today?`,
    options: uniqueOptions,
  };
}

export function buildFollowUpFromScanResult(
  scan: { regions: string[]; integrations: string[]; facts: ScanFact[] },
  answers: DiagnosticAnswers
): ScanResult["followUpQuestion"] {
  const page: ExtractedPage = {
    textSample: scan.facts.map((fact) => fact.text).join(" "),
    internalLinks: [],
    jsonLdTypes: [],
    integrations: scan.integrations,
    regions: scan.regions,
    businessModel: "unknown",
  };

  return buildFollowUpQuestion(page, scan.facts, answers);
}
