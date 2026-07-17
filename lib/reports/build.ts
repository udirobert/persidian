import type { CreateReportInput, StoredRecommendation, XrayReportRecord } from "@/lib/reports/types";

export function buildReportRecord(
  input: CreateReportInput,
  meta: Pick<XrayReportRecord, "id" | "createdAt" | "expiresAt" | "deletionTokenHash">,
  recommendation: StoredRecommendation
): XrayReportRecord {
  const confirmedFactIds = Object.entries(input.factStatuses)
    .filter(([, status]) => status === "confirmed")
    .map(([id]) => id);

  return {
    ...meta,
    consent: true,
    email: input.email,
    path: input.path,
    scannedUrl: input.scannedUrl,
    scanDomain: input.scanDomain,
    facts: input.facts,
    confirmedFactIds,
    factStatuses: input.factStatuses,
    answers: input.answers,
    recommendation,
  };
}
