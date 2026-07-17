import {
  extractFromHtml,
  needsBrowserEscalation,
  type ExtractedPage,
} from "@/lib/site-scan/extract";
import {
  buildPageUrl,
  discoverSupplementalPaths,
} from "@/lib/site-scan/discover";
import {
  fetchPublicPage,
  fetchRobotsTxt,
  robotsDisallowsAll,
} from "@/lib/site-scan/fetch";
import { createFetchGuard, runWithScanConcurrency } from "@/lib/site-scan/limits";
import { mergeExtractedPages, type PageExtract } from "@/lib/site-scan/merge";
import {
  buildFacts,
  buildFollowUpQuestion,
  mapToDiagnosticAnswers,
} from "@/lib/site-scan/signals";
import { mergeTinyFishFacts, runTinyFishExtract } from "@/lib/site-scan/tinyfish";
import type { ScanProgressStep, ScanResult } from "@/lib/site-scan/types";
import { UrlValidationError, validatePublicUrl, validateRedirectUrl } from "@/lib/site-scan/url";

function progress(steps: ScanProgressStep[]): ScanProgressStep[] {
  return steps;
}

export async function scanWebsite(rawUrl: string): Promise<ScanResult> {
  return runWithScanConcurrency(() => scanWebsiteInner(rawUrl));
}

async function scanWebsiteInner(rawUrl: string): Promise<ScanResult> {
  const guard = createFetchGuard();
  const steps: ScanProgressStep[] = [
    { id: "validate", label: "Validating URL", status: "active" },
    { id: "robots", label: "Reading robots.txt", status: "pending" },
    { id: "pages", label: "Reading public pages", status: "pending" },
    { id: "extract", label: "Extracting public facts", status: "pending" },
    { id: "browser", label: "Checking public integrations", status: "pending" },
    { id: "compare", label: "Comparing possible risks", status: "pending" },
  ];

  let parsed: URL;
  try {
    parsed = await validatePublicUrl(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch (error) {
    if (error instanceof UrlValidationError) throw error;
    throw new UrlValidationError("Could not validate that URL");
  }

  steps[0].status = "done";
  steps[1].status = "active";

  const origin = parsed.origin;
  const robots = await fetchRobotsTxt(origin, validateRedirectUrl, undefined, guard);
  if (robotsDisallowsAll(robots)) {
    throw new UrlValidationError("This site's robots.txt disallows scanning");
  }

  steps[1].status = "done";
  steps[2].status = "active";

  const { finalUrl, html } = await fetchPublicPage(
    parsed.toString(),
    validateRedirectUrl,
    undefined,
    guard
  );

  const homepageExtract: ExtractedPage = extractFromHtml(html, finalUrl);
  const homepagePath = new URL(finalUrl).pathname;
  const supplementalPaths = await discoverSupplementalPaths(
    origin,
    homepagePath,
    homepageExtract.internalLinks,
    robots,
    validateRedirectUrl,
    guard
  );

  const pageExtracts: PageExtract[] = [{ url: finalUrl, page: homepageExtract }];

  for (const path of supplementalPaths) {
    try {
      const pageUrl = buildPageUrl(origin, path);
      const { finalUrl: resolvedUrl, html: pageHtml } = await fetchPublicPage(
        pageUrl,
        validateRedirectUrl,
        undefined,
        guard
      );
      pageExtracts.push({
        url: resolvedUrl,
        page: extractFromHtml(pageHtml, resolvedUrl),
      });
    } catch {
      // skip pages that fail to load
    }
  }

  steps[2].status = "done";
  steps[3].status = "active";

  const { merged: page, inspectedUrls } = mergeExtractedPages(pageExtracts);
  let escalatedToBrowser = false;

  steps[3].status = "done";
  steps[4].status = "active";

  if (needsBrowserEscalation(page) && process.env.TINYFISH_API_KEY) {
    const tiny = await runTinyFishExtract(finalUrl);
    if (tiny) {
      const mergedPage = mergeTinyFishFacts(page, tiny);
      pageExtracts[0] = { url: finalUrl, page: mergedPage };
      escalatedToBrowser = true;
    }
  } else if (needsBrowserEscalation(page)) {
    steps[4].status = "skipped";
  } else {
    steps[4].status = "done";
  }

  if (steps[4].status === "active") steps[4].status = "done";
  steps[5].status = "active";

  const facts = buildFacts(pageExtracts);
  const followUpQuestion = buildFollowUpQuestion(page, facts, {});
  const suggestedAnswers = mapToDiagnosticAnswers(page);

  steps[5].status = "done";

  return {
    url: finalUrl,
    domain: new URL(finalUrl).hostname,
    title: page.title,
    description: page.description,
    facts,
    progress: progress(steps),
    followUpQuestion,
    suggestedAnswers,
    escalatedToBrowser,
    regions: page.regions,
    integrations: page.integrations,
    pagesInspected: inspectedUrls,
  };
}

export { UrlValidationError };
