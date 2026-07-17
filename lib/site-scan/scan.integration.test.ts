import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scanWebsite, UrlValidationError } from "./index.ts";

const INTEGRATION = process.env.SCAN_INTEGRATION === "1";

const SCAN_MATRIX = [
  {
    id: "iana-static",
    url: "https://example.com",
    domain: "example.com",
    minFacts: 1,
    minPages: 1,
  },
  {
    id: "standards-site",
    url: "https://www.w3.org",
    domain: "www.w3.org",
    minFacts: 1,
    minPages: 1,
  },
  {
    id: "first-website",
    url: "https://info.cern.ch",
    domain: "info.cern.ch",
    minFacts: 1,
    minPages: 1,
  },
] as const;

describe("scanWebsite integration matrix", { skip: !INTEGRATION, timeout: 120_000 }, () => {
  for (const entry of SCAN_MATRIX) {
    it(`scans ${entry.id} (${entry.url})`, async () => {
      const result = await scanWebsite(entry.url);

      assert.equal(result.domain, entry.domain);
      assert.ok(result.pagesInspected.length >= entry.minPages);
      assert.ok(result.facts.length >= entry.minFacts);
      assert.ok(result.facts.some((fact) => fact.kind === "found"));
      assert.ok(result.progress.every((step) => step.status === "done" || step.status === "skipped"));
    });
  }

  it("rejects localhost targets", async () => {
    await assert.rejects(
      () => scanWebsite("https://localhost"),
      (error: Error) => error instanceof UrlValidationError
    );
  });
});

describe("scanWebsite integration (offline guard)", () => {
  it("documents how to run live scan matrix tests", () => {
    assert.equal(typeof scanWebsite, "function");
    if (!INTEGRATION) {
      assert.ok(true, "Set SCAN_INTEGRATION=1 to run live /api/scan matrix tests");
    }
  });
});
