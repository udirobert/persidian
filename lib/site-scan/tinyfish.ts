const TINYFISH_API = "https://agent.tinyfish.ai/v1/automation/run";
const TINYFISH_TIMEOUT_MS = 45_000;

export interface TinyFishCompanyFacts {
  companyDescription?: string;
  sector?: string;
  products?: string[];
  markets?: string[];
  integrations?: string[];
  businessModel?: string;
}

export async function runTinyFishExtract(url: string): Promise<TinyFishCompanyFacts | null> {
  const apiKey = process.env.TINYFISH_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TINYFISH_TIMEOUT_MS);

  try {
    const response = await fetch(TINYFISH_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        url,
        goal:
          "Extract public company facts only: company description, sector, products, customer markets, integrations/tools mentioned, and whether the business appears B2B or B2C. Return JSON with keys companyDescription, sector, products, markets, integrations, businessModel. Do not log in or submit forms.",
        output_schema: {
          type: "object",
          properties: {
            companyDescription: { type: "string" },
            sector: { type: "string" },
            products: { type: "array", items: { type: "string" } },
            markets: { type: "array", items: { type: "string" } },
            integrations: { type: "array", items: { type: "string" } },
            businessModel: { type: "string" },
          },
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = (await response.json()) as {
      status?: string;
      result?: TinyFishCompanyFacts | { result?: TinyFishCompanyFacts };
    };

    const raw = data.result;
    if (!raw) return null;
    if ("result" in (raw as object) && (raw as { result?: TinyFishCompanyFacts }).result) {
      return (raw as { result: TinyFishCompanyFacts }).result;
    }
    return raw as TinyFishCompanyFacts;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

export function mergeTinyFishFacts(
  base: import("@/lib/site-scan/extract").ExtractedPage,
  tiny: TinyFishCompanyFacts
): import("@/lib/site-scan/extract").ExtractedPage {
  const extraText = [
    tiny.companyDescription,
    tiny.sector,
    ...(tiny.products ?? []),
    ...(tiny.markets ?? []),
    ...(tiny.integrations ?? []),
    tiny.businessModel,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...base,
    description: base.description || tiny.companyDescription,
    textSample: `${base.textSample} ${extraText}`.slice(0, 8000),
    integrations: [...new Set([...base.integrations, ...(tiny.integrations ?? []).map((i) => i.toLowerCase())])],
    regions: [...new Set([...base.regions, ...(tiny.markets ?? [])])],
    businessModel:
      base.businessModel !== "unknown"
        ? base.businessModel
        : tiny.businessModel?.toLowerCase().includes("b2b")
          ? "b2b"
          : tiny.businessModel?.toLowerCase().includes("b2c")
            ? "b2c"
            : base.businessModel,
  };
}
