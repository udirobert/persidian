import { PRODUCTS, type BaseProject } from "./products";

export interface DiagnosticAnswers {
  role?: string;
  painPoints?: string[];
  tools?: string[];
  timeline?: string;
}

export interface ProductScore {
  key: string;
  name: string;
  score: number;
  maxPossible: number;
  percentage: number;
  product: BaseProject;
}

interface SignalMap {
  roles: string[];
  pains: string[];
  tools: string[];
}

const SIGNALS: Record<string, SignalMap> = {
  sikizana: {
    roles: ["finance", "accounting", "operations"],
    pains: ["invoices", "receivables", "bookkeeping", "cash", "payments", "tax"],
    tools: ["xero", "quickbooks", "sage", "freeagent"],
  },
  nuncio: {
    roles: ["sales", "marketing", "growth", "founder", "general"],
    pains: ["outreach", "sales", "recruiting", "prospecting", "messaging", "email", "replies"],
    tools: ["salesforce", "hubspot", "linkedin", "crm", "apollo", "lem"],
  },
  lenitnes: {
    roles: ["engineering", "protocol", "security", "research"],
    pains: ["commits", "consensus", "code", "signals", "security", "protocol", "audits"],
    tools: ["github", "gitlab", "bitbucket"],
  },
  databard: {
    roles: ["data", "analytics", "engineering"],
    pains: ["data", "warehouse", "metadata", "analytics", "reporting", "governance", "lineage"],
    tools: ["dbt", "snowflake", "bigquery", "openmetadata", "dune", "looker", "tableau"],
  },
  weft: {
    roles: ["legal", "operations", "hr", "founder"],
    pains: ["escrow", "milestones", "contracts", "freelancers", "payments", "scope", "delivery"],
    tools: ["contracts", "notion", "jira", "deel", "ironclad"],
  },
  diversifi: {
    roles: ["treasury", "risk", "finance", "operations"],
    pains: ["fx", "currency", "treasury", "cross-border", "exchange", "hedging", "stablecoins", "drag"],
    tools: ["stablecoins", "mento", "defi", "custody", "excel", "sap", "treasury"],
  },
};

const ROLE_WEIGHT = 2;
const PAIN_WEIGHT = 3;
const TOOL_WEIGHT = 2;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, " ");
}

function matches(signalList: string[], answerList: string[]): number {
  let hits = 0;
  for (const answer of answerList) {
    const normalizedAnswer = normalize(answer);
    for (const signal of signalList) {
      if (normalizedAnswer.includes(normalize(signal))) {
        hits += 1;
        break;
      }
    }
  }
  return hits;
}

export function scoreAnswers(answers: DiagnosticAnswers): ProductScore[] {
  const role = answers.role ? [answers.role] : [];
  const pains = answers.painPoints ?? [];
  const tools = answers.tools ?? [];

  const maxPossible =
    role.length * ROLE_WEIGHT +
    pains.length * PAIN_WEIGHT +
    tools.length * TOOL_WEIGHT;

  const scores = PRODUCTS.map((product) => {
    const key = product.name.toLowerCase();
    const signals = SIGNALS[key];
    if (!signals) {
      return {
        key,
        name: product.name,
        score: 0,
        maxPossible,
        percentage: 0,
        product,
      };
    }

    const score =
      matches(signals.roles, role) * ROLE_WEIGHT +
      matches(signals.pains, pains) * PAIN_WEIGHT +
      matches(signals.tools, tools) * TOOL_WEIGHT;

    return {
      key,
      name: product.name,
      score,
      maxPossible,
      percentage: maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0,
      product,
    };
  });

  return scores.sort((a, b) => b.score - a.score);
}

export function buildReasoning(
  top: ProductScore,
  answers: DiagnosticAnswers
): string {
  const pains = answers.painPoints ?? [];
  const tools = answers.tools ?? [];

  const signals = SIGNALS[top.key];
  const matchedPains = pains.filter((p) =>
    signals?.pains.some((s) => normalize(p).includes(normalize(s)))
  );
  const matchedTools = tools.filter((t) =>
    signals?.tools.some((s) => normalize(t).includes(normalize(s)))
  );

  const reasonParts: string[] = [];
  if (answers.role) reasonParts.push(`your ${answers.role.toLowerCase()} role`);
  if (matchedPains.length) reasonParts.push(`the pain around ${matchedPains.slice(0, 2).join(" and ").toLowerCase()}`);
  if (matchedTools.length) reasonParts.push(`your use of ${matchedTools.slice(0, 2).join(" and ").toLowerCase()}`);

  if (reasonParts.length === 0) {
    return `${top.product.name} is the closest match based on the signals you provided.`;
  }

  return `Because of ${reasonParts.join(", ")}, ${top.product.name} — ${top.product.thesisLabel.toLowerCase()} — is the best starting point.`;
}

export interface MatchedSignals {
  role: string | null;
  pains: string[];
  tools: string[];
}

export function getMatchedSignals(
  answers: DiagnosticAnswers,
  productKey: string
): MatchedSignals {
  const signals = SIGNALS[productKey];
  if (!signals) {
    return { role: null, pains: [], tools: [] };
  }

  const role =
    answers.role &&
    signals.roles.some((s) => normalize(answers.role!).includes(normalize(s)))
      ? answers.role
      : null;

  const pains = (answers.painPoints ?? []).filter((p) =>
    signals.pains.some((s) => normalize(p).includes(normalize(s)))
  );

  const tools = (answers.tools ?? []).filter((t) =>
    signals.tools.some((s) => normalize(t).includes(normalize(s)))
  );

  return { role, pains, tools };
}

export function recommend(
  answers: DiagnosticAnswers
): {
  product: BaseProject | null;
  reasoning: string;
  scores: ProductScore[];
  confidence: "high" | "medium" | "low";
} {
  const scores = scoreAnswers(answers);
  const top = scores[0];

  if (!top || top.score === 0) {
    return {
      product: null,
      reasoning:
        "The answers don't clearly point to one product. A short call will help us map the right agent to your business.",
      scores,
      confidence: "low",
    };
  }

  const reasoning = buildReasoning(top, answers);
  const second = scores[1];
  const gap = second ? top.score - second.score : top.score;
  const confidence: "high" | "medium" | "low" =
    gap >= 4 ? "high" : gap >= 2 ? "medium" : "low";

  return {
    product: top.product,
    reasoning,
    scores,
    confidence,
  };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const timelineQuips: Record<string, string[]> = {
  Now: [
    "Clock starts now.",
    "Resolved yesterday.",
    "No more waiting.",
    "This week, not next quarter.",
    "Time to automate the wait away.",
  ],
  "This quarter": [
    "Thirty-day pilot, then it runs itself.",
    "This quarter belongs to the agents.",
    "Small pilot, big unlock.",
    "A quarter from now you'll wonder why it was manual.",
  ],
  "Later / exploring": [
    "No rush — the clock will wait.",
    "Bookmark this for your next planning cycle.",
    "When you're ready, so is the agent.",
    "File this under 'obvious in hindsight'.",
  ],
};

const patternQuips = [
  "That's the signal.",
  "Perfect.",
  "Makes sense.",
  "Found it.",
  "Exactly the pattern we watch.",
];

const ctaQuips = [
  "Book a demo to see it in action.",
  "Let's get it running.",
  "A short demo is the fastest next step.",
  "Ready when you are.",
];

export function generateTransitionQuip(timeline = "Later / exploring"): string {
  return pick(timelineQuips[timeline] ?? timelineQuips["Later / exploring"]);
}

export function generateAgentSays(
  answers: DiagnosticAnswers,
  product: BaseProject,
  confidence: "high" | "medium" | "low"
): string {
  const role = answers.role?.split("/")[0]?.trim().toLowerCase() ?? "your team";
  const pain = answers.painPoints?.[0]?.toLowerCase() ?? "this pattern";
  const timeline = answers.timeline ?? "Later / exploring";

  const confidenceClause =
    confidence === "high"
      ? `This is a high-confidence match for ${role}.`
      : `This is a ${confidence}-confidence match for ${role}.`;

  return `${pick(patternQuips)} ${confidenceClause} ${pain} + ${product.name} = a clear next move. ${pick(
    timelineQuips[timeline] ?? timelineQuips["Later / exploring"]
  )} ${pick(ctaQuips)}`;
}

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: "role",
    type: "single" as const,
    label: "Your function",
    options: [
      "Finance / Accounting",
      "Sales / Marketing / Growth",
      "Engineering / Protocol / Security",
      "Data / Analytics",
      "Operations / Legal / HR",
      "Treasury / Risk",
      "Founder / General Management",
    ],
  },
  {
    id: "painPoints",
    type: "multi" as const,
    label: "Which of these quietly costs you money every month?",
    options: [
      "Late invoices & unpaid receivables",
      "Low reply rates on cold outreach",
      "Code changes that affect consensus or security",
      "Data nobody reads or trusts",
      "Contract, milestone, or freelancer payment disputes",
      "Cross-currency FX drag",
    ],
  },
  {
    id: "tools",
    type: "multi" as const,
    label: "Tools you already rely on",
    options: [
      "Xero / QuickBooks / Sage",
      "Salesforce / HubSpot / LinkedIn",
      "GitHub / GitLab",
      "Warehouse / dbt / OpenMetadata / Dune",
      "Escrow / Notion / Jira",
      "Stablecoins / Mento / DeFi / international payments",
    ],
  },
  {
    id: "timeline",
    type: "single" as const,
    label: "When do you want to act?",
    options: ["Now", "This quarter", "Later / exploring"],
  },
];
