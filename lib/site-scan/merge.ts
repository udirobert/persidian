import type { ExtractedPage } from "@/lib/site-scan/extract";

export interface PageExtract {
  url: string;
  page: ExtractedPage;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function mergeBusinessModel(
  models: ("b2b" | "b2c" | "unknown")[]
): "b2b" | "b2c" | "unknown" {
  const hasB2b = models.includes("b2b");
  const hasB2c = models.includes("b2c");
  if (hasB2b && !hasB2c) return "b2b";
  if (hasB2c && !hasB2b) return "b2c";
  return "unknown";
}

export function mergeExtractedPages(entries: PageExtract[]): {
  merged: ExtractedPage;
  inspectedUrls: string[];
} {
  if (!entries.length) {
    throw new Error("At least one page extract is required");
  }

  const primary = entries[0].page;
  const textSample = entries
    .map(({ page }) => page.textSample)
    .join("\n\n")
    .slice(0, 16_000);

  return {
    inspectedUrls: entries.map(({ url }) => url),
    merged: {
      title: primary.title,
      description: primary.description,
      h1: primary.h1,
      textSample,
      internalLinks: unique(entries.flatMap(({ page }) => page.internalLinks)),
      jsonLdTypes: unique(entries.flatMap(({ page }) => page.jsonLdTypes)),
      integrations: unique(entries.flatMap(({ page }) => page.integrations)),
      regions: unique(entries.flatMap(({ page }) => page.regions)),
      businessModel: mergeBusinessModel(entries.map(({ page }) => page.businessModel)),
    },
  };
}
