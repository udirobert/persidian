export interface ExtractedPage {
  title?: string;
  description?: string;
  h1?: string;
  textSample: string;
  internalLinks: string[];
  jsonLdTypes: string[];
  integrations: string[];
  regions: string[];
  businessModel: "b2b" | "b2c" | "unknown";
}

const INTEGRATION_PATTERNS: Record<string, RegExp> = {
  xero: /\bxero\b/i,
  quickbooks: /\bquickbooks\b/i,
  sage: /\bsage\b/i,
  salesforce: /\bsalesforce\b/i,
  hubspot: /\bhubspot\b/i,
  linkedin: /\blinkedin\b/i,
  github: /\bgithub\b/i,
  gitlab: /\bgitlab\b/i,
  dbt: /\bdbt\b/i,
  snowflake: /\bsnowflake\b/i,
  openmetadata: /\bopenmetadata\b/i,
  fluxx: /\bfluxx\b/i,
  foundant: /\bfoundant\b/i,
  amplifund: /\bamplifund\b/i,
  submittable: /\bsubmittable\b/i,
};

const REGION_PATTERNS: Record<string, RegExp> = {
  UK: /\b(united kingdom|\buk\b|london|britain)\b/i,
  US: /\b(united states|\busa\b|\bus\b|america)\b/i,
  EU: /\b(europe|european union|\beu\b)\b/i,
  Africa: /\b(africa|kenya|nigeria|ghana)\b/i,
};

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function matchMeta(html: string, name: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    "i"
  );
  const match = html.match(re);
  return match?.[1] || match?.[2];
}

function matchTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]).slice(0, 200) : undefined;
}

function matchH1(html: string): string | undefined {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripTags(match[1]).slice(0, 300) : undefined;
}

function extractJsonLdTypes(html: string): string[] {
  const types = new Set<string>();
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of blocks) {
    const inner = block.replace(/<script[^>]*>|<\/script>/gi, "");
    try {
      const data = JSON.parse(inner) as { "@type"?: string | string[]; "@graph"?: { "@type"?: string }[] };
      const addType = (t: unknown) => {
        if (typeof t === "string") types.add(t);
        if (Array.isArray(t)) t.forEach(addType);
      };
      addType(data["@type"]);
      data["@graph"]?.forEach((node) => addType(node["@type"]));
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return [...types];
}

function extractInternalLinks(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const links = new Set<string>();
  const re = /href=["']([^"'#]+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) && links.size < 40) {
    try {
      const resolved = new URL(match[1], baseUrl);
      if (resolved.hostname === base.hostname) {
        links.add(resolved.pathname);
      }
    } catch {
      // skip invalid href
    }
  }
  return [...links];
}

function detectIntegrations(text: string): string[] {
  return Object.entries(INTEGRATION_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([name]) => name);
}

function detectRegions(text: string): string[] {
  return Object.entries(REGION_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([name]) => name);
}

function detectBusinessModel(text: string): "b2b" | "b2c" | "unknown" {
  const lower = text.toLowerCase();
  const b2b = /\b(enterprise|b2b|businesses|teams|saas platform|for companies)\b/.test(lower);
  const b2c = /\b(consumers|b2c|shoppers|individuals|personal app)\b/.test(lower);
  if (b2b && !b2c) return "b2b";
  if (b2c && !b2b) return "b2c";
  return "unknown";
}

export function extractFromHtml(html: string, pageUrl: string): ExtractedPage {
  const title = matchTitle(html);
  const description =
    matchMeta(html, "description") || matchMeta(html, "og:description");
  const h1 = matchH1(html);
  const textSample = stripTags(html).slice(0, 8000);
  const combined = `${title ?? ""} ${description ?? ""} ${h1 ?? ""} ${textSample}`;

  return {
    title,
    description,
    h1,
    textSample,
    internalLinks: extractInternalLinks(html, pageUrl),
    jsonLdTypes: extractJsonLdTypes(html),
    integrations: detectIntegrations(combined),
    regions: detectRegions(combined),
    businessModel: detectBusinessModel(combined),
  };
}

export function needsBrowserEscalation(page: ExtractedPage): boolean {
  const sparse =
    (page.textSample.length < 400) &&
    !page.description &&
    !page.h1;
  const jsShell =
    /__NEXT_DATA__|react-root|ng-version|data-reactroot/i.test(page.textSample) &&
    page.textSample.length < 1200;
  return sparse || jsShell;
}
