import dns from "node:dns/promises";
import net from "node:net";
import { URL } from "node:url";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google",
]);

export function isPrivateIpAddress(ip: string): boolean {
  if (net.isIP(ip) === 0) return false;

  if (net.isIP(ip) === 4) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 127) return true;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
    return false;
  }

  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fe80:")) return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  return false;
}

export class UrlValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UrlValidationError";
  }
}

export async function assertHostnameResolvesPublic(hostname: string): Promise<void> {
  const normalized = hostname.toLowerCase();

  if (
    BLOCKED_HOSTNAMES.has(normalized) ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  ) {
    throw new UrlValidationError("That hostname is not allowed");
  }

  const literalIpVersion = net.isIP(normalized);
  if (literalIpVersion !== 0) {
    if (isPrivateIpAddress(normalized)) {
      throw new UrlValidationError("Private network addresses are not allowed");
    }
    return;
  }

  const addresses = await dns.lookup(normalized, { all: true });
  if (!addresses.length) {
    throw new UrlValidationError("Could not resolve that domain");
  }

  for (const addr of addresses) {
    if (isPrivateIpAddress(addr.address)) {
      throw new UrlValidationError("That domain resolves to a private network address");
    }
  }
}

export async function validatePublicUrl(raw: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new UrlValidationError("Enter a valid URL including https://");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new UrlValidationError("Only HTTP and HTTPS URLs are supported");
  }

  await assertHostnameResolvesPublic(parsed.hostname);
  parsed.hash = "";
  return parsed;
}

export async function validateRedirectUrl(url: URL): Promise<URL> {
  return validatePublicUrl(url.toString());
}
