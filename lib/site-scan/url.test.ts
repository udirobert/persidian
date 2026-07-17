import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertHostnameResolvesPublic,
  isPrivateIpAddress,
  UrlValidationError,
  validatePublicUrl,
} from "./url.ts";

describe("isPrivateIpAddress", () => {
  it("returns false for non-IP strings", () => {
    assert.equal(isPrivateIpAddress("example.com"), false);
  });

  it("blocks RFC1918 and loopback IPv4", () => {
    assert.equal(isPrivateIpAddress("127.0.0.1"), true);
    assert.equal(isPrivateIpAddress("10.0.0.1"), true);
    assert.equal(isPrivateIpAddress("192.168.1.1"), true);
    assert.equal(isPrivateIpAddress("172.16.0.1"), true);
    assert.equal(isPrivateIpAddress("169.254.169.254"), true);
  });

  it("allows public IPv4", () => {
    assert.equal(isPrivateIpAddress("93.184.216.34"), false);
  });

  it("blocks IPv6 loopback and link-local", () => {
    assert.equal(isPrivateIpAddress("::1"), true);
    assert.equal(isPrivateIpAddress("fe80::1"), true);
  });
});

describe("validatePublicUrl", () => {
  it("accepts https://example.com", async () => {
    const parsed = await validatePublicUrl("https://example.com");
    assert.equal(parsed.hostname, "example.com");
  });

  it("rejects localhost", async () => {
    await assert.rejects(
      () => validatePublicUrl("https://localhost"),
      (error: Error) => error instanceof UrlValidationError
    );
  });

  it("rejects literal private IPv4", async () => {
    await assert.rejects(
      () => validatePublicUrl("https://127.0.0.1"),
      (error: Error) => error instanceof UrlValidationError
    );
  });

  it("rejects hostnames resolving to private addresses", async () => {
    await assert.rejects(
      () => assertHostnameResolvesPublic("localtest.me"),
      (error: Error) => error instanceof UrlValidationError
    );
  });
});
