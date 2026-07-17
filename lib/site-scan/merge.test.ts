import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ExtractedPage } from "./extract.ts";
import { mergeExtractedPages } from "./merge.ts";

function page(partial: Partial<ExtractedPage>): ExtractedPage {
  return {
    textSample: "",
    internalLinks: [],
    jsonLdTypes: [],
    integrations: [],
    regions: [],
    businessModel: "unknown",
    ...partial,
  };
}

describe("mergeExtractedPages", () => {
  it("merges integrations and regions across pages", () => {
    const { merged, inspectedUrls } = mergeExtractedPages([
      {
        url: "https://example.com/",
        page: page({
          title: "Home",
          integrations: ["xero"],
          regions: ["UK"],
          businessModel: "b2b",
        }),
      },
      {
        url: "https://example.com/about",
        page: page({
          integrations: ["salesforce"],
          regions: ["US"],
          textSample: "About us in the United States",
        }),
      },
    ]);

    assert.deepEqual(inspectedUrls, [
      "https://example.com/",
      "https://example.com/about",
    ]);
    assert.equal(merged.title, "Home");
    assert.deepEqual(merged.integrations, ["xero", "salesforce"]);
    assert.deepEqual(merged.regions, ["UK", "US"]);
    assert.equal(merged.businessModel, "b2b");
  });
});
