import {
  extractFromHtml,
  needsBrowserEscalation,
  type ExtractedPage,
} from "@/lib/site-scan/extract";
import {
  fetchPublicPage,
  fetchRobotsTxt,
  robotsDisallowsAll,
} from "@/lib/site-scan/fetch";
import {
  buildFacts,
  buildFollowUpQuestion,
  mapToDiagnosticAnswers,
} from "@/lib/site-scan/signals";
import { mergeTinyFishFacts, runTinyFishExtract } from "@/lib/site-scan/tinyfish";
import type { ScanProgressStep, ScanResult } from "@/lib/site-scan/types";
import { UrlValidationError, assertHostnameResolvesPublic, validatePublicUrl, validateRedirectUrl } from "@/lib/site-scan/url";

async function revalidateHost(url: string): Promise<void> {
  await assertHostnameResolvesPublic(new URL(url).hostname);
}

function progress(steps: ScanProgressStep[]): ScanProgressStep[] {
  return steps;
}

export async function scanWebsite(rawUrl: string): Promise<ScanResult> {
  const steps: ScanProgressStep[] = [
    { id: "validate", label: "Validating URL", status: "active" },
    { id: "robots", label: "Reading robots.txt", status: "pending" },
    { id: "homepage", label: "Reading homepage", status: "pending" },
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
  const revalidate = (url: string) => revalidateHost(url);
  const robots = await fetchRobotsTxt(origin, validateRedirectUrl, revalidate);
  if (robotsDisallowsAll(robots)) {
    throw new UrlValidationError("This site's robots.txt disallows scanning");
  }

  steps[1].status = "done";
  steps[2].status = "active";

  const { finalUrl, html } = await fetchPublicPage(
    parsed.toString(),
    validateRedirectUrl,
    revalidate
  );
  steps[2].status = "done";
  steps[3].status = "active";

  let page: ExtractedPage = extractFromHtml(html, finalUrl);
  let escalatedToBrowser = false;

  steps[3].status = "done";
  steps[4].status = "active";

  if (needsBrowserEscalation(page) && process.env.TINYFISH_API_KEY) {
    const tiny = await runTinyFishExtract(finalUrl);
    if (tiny) {
      page = mergeTinyFishFacts(page, tiny);
      escalatedToBrowser = true;
    }
  } else if (needsBrowserEscalation(page)) {
    steps[4].status = "skipped";
  } else {
    steps[4].status = "done";
  }

  if (steps[4].status === "active") steps[4].status = "done";
  steps[5].status = "active";

  const facts = buildFacts(page, finalUrl);
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
  };
}

export { UrlValidationError };
