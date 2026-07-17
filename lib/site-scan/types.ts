export type FactKind = "found" | "inferred" | "unknown";
export type FactReviewStatus = "confirmed" | "incorrect" | "unsure";

export interface FactSignals {
  role?: string;
  painPoints?: string[];
  tools?: string[];
}

export interface ScanFact {
  id: string;
  kind: FactKind;
  text: string;
  confidence: "high" | "medium" | "low";
  sources: { label: string; url: string; quote?: string }[];
  signals?: FactSignals;
}

export interface ScanProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "skipped";
}

export interface ScanResult {
  url: string;
  domain: string;
  title?: string;
  description?: string;
  facts: ScanFact[];
  progress: ScanProgressStep[];
  followUpQuestion?: {
    label: string;
    options: string[];
    id: string;
  };
  suggestedAnswers: Partial<import("@/lib/diagnostic").DiagnosticAnswers>;
  escalatedToBrowser: boolean;
  regions: string[];
  integrations: string[];
}

export interface ScanRequest {
  url: string;
}
