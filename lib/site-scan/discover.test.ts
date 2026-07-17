import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { discoverSupplementalPaths } from "./discover.ts";

describe("discoverSupplementalPaths", () => {
  it("prioritizes high-signal paths from homepage links", async () => {
    const paths = await discoverSupplementalPaths(
      "https://discovery-test.example",
      "/",
      ["/pricing", "/about", "/blog/post-1", "/integrations/xero"],
      null,
      async (url) => url
    );

    assert.deepEqual(paths, ["/integrations/xero", "/about", "/pricing"]);
  });

  it("skips homepage and respects robots disallow", async () => {
    const robots = `User-agent: *\nDisallow: /security\n`;
    const paths = await discoverSupplementalPaths(
      "https://example.com",
      "/",
      ["/", "/security", "/about"],
      robots,
      async (url) => url
    );

    assert.deepEqual(paths, ["/about"]);
  });

  it("caps supplemental pages at four", async () => {
    const paths = await discoverSupplementalPaths(
      "https://example.com",
      "/",
      [
        "/about",
        "/integrations",
        "/security",
        "/trust",
        "/pricing",
        "/products",
        "/partners",
      ],
      null,
      async (url) => url
    );

    assert.equal(paths.length, 4);
  });
});
