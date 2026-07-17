import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scanWebsite, UrlValidationError } from "./index.ts";

const REJECT_MATRIX = [
  { id: "localhost", url: "https://localhost" },
  { id: "loopback-ipv4", url: "https://127.0.0.1" },
  { id: "http-loopback", url: "http://127.0.0.1" },
  { id: "private-ipv4", url: "https://192.168.1.1" },
  { id: "link-local", url: "https://169.254.169.254" },
  { id: "ipv6-loopback", url: "https://[::1]" },
  { id: "file-protocol", url: "file:///etc/passwd" },
  { id: "internal-hostname", url: "https://metadata.google.internal" },
] as const;

describe("scanWebsite SSRF rejection matrix", () => {
  for (const entry of REJECT_MATRIX) {
    it(`rejects ${entry.id}`, async () => {
      await assert.rejects(
        () => scanWebsite(entry.url),
        (error: Error) => error instanceof UrlValidationError
      );
    });
  }
});
