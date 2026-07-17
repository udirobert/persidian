import type { DiagnosticAnswers } from "@/lib/diagnostic";
import type { ScanFact } from "@/lib/site-scan/types";

export interface StoredRecommendation {
  productSlug: string | null;
  productName: string | null;
  thesisLabel: string | null;
  tagline: string | null;
  entityHref: string | null;
  productHref: string | null;
  accent: string | null;
  reasoning: string;
  agentSays: string;
  confidence: "high" | "medium" | "low";
  scores: { key: string; name: string; percentage: number; score: number }[];
}

export interface XrayReportRecord {
  id: string;
  createdAt: string;
  expiresAt: string;
  deletionTokenHash: string;
  consent: true;
  email?: string;
  path: "url" | "manual";
  scannedUrl?: string;
  scanDomain?: string;
  facts: ScanFact[];
  confirmedFactIds: string[];
  answers: DiagnosticAnswers;
  recommendation: StoredRecommendation;
}

export type PublicXrayReport = Omit<
  XrayReportRecord,
  "deletionTokenHash" | "email" | "consent"
>;

export interface CreateReportInput {
  consent: true;
  email?: string;
  path: "url" | "manual";
  scannedUrl?: string;
  scanDomain?: string;
  facts?: ScanFact[];
  confirmedFactIds?: string[];
  answers: DiagnosticAnswers;
  recommendation: StoredRecommendation;
}

export interface CreateReportResult {
  id: string;
  shareUrl: string;
  expiresAt: string;
  deletionToken: string;
}
