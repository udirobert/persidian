import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveAnswersFromFactReview } from "./signals.ts";
import type { ScanFact } from "./types.ts";

describe("deriveAnswersFromFactReview", () => {
  const facts: ScanFact[] = [
    {
      id: "integrations",
      kind: "found",
      text: "References xero",
      confidence: "high",
      sources: [{ label: "Submitted page", url: "https://example.com" }],
      signals: {
        role: "Finance / Accounting",
        tools: ["Xero / QuickBooks / Sage"],
      },
    },
    {
      id: "pain-invoices",
      kind: "inferred",
      text: "Invoices may matter",
      confidence: "medium",
      sources: [{ label: "Submitted page", url: "https://example.com" }],
      signals: { painPoints: ["Late invoices & unpaid receivables"] },
    },
  ];

  it("includes only confirmed facts", () => {
    const answers = deriveAnswersFromFactReview(facts, {
      integrations: "confirmed",
      "pain-invoices": "incorrect",
    });

    assert.equal(answers.role, "Finance / Accounting");
    assert.deepEqual(answers.tools, ["Xero / QuickBooks / Sage"]);
    assert.equal(answers.painPoints, undefined);
  });

  it("ignores unsure facts", () => {
    const answers = deriveAnswersFromFactReview(facts, {
      integrations: "unsure",
      "pain-invoices": "unsure",
    });

    assert.deepEqual(answers, {});
  });
});
