import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scanWebsite } from "./index.ts";

const INTEGRATION = process.env.SCAN_INTEGRATION === "1";

describe("scanWebsite integration", { skip: !INTEGRATION, timeout: 90_000 }, () => {
  it("scans example.com and returns cited facts", async () => {
    const result = await scanWebsite("https://example.com");

    assert.equal(result.domain, "example.com");
    assert.ok(result.facts.length >= 1);
    assert.ok(result.pagesInspected.length >= 1);
    assert.ok(result.facts.some((fact) => fact.kind === "found"));
  });

  it("rejects localhost targets", async () => {
    await assert.rejects(() => scanWebsite("https://localhost"));
  });
});

describe("scanWebsite integration (offline guard)", () => {
  it("documents how to run live scan tests", () => {
    assert.equal(typeof scanWebsite, "function");
    if (!INTEGRATION) {
      assert.ok(true, "Set SCAN_INTEGRATION=1 to run live /api/scan matrix tests");
    }
  });
});
