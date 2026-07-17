import dns from "node:dns/promises";
import { URL } from "node:url";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google",
]);

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
  const [a, b] = parts;
  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 0) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fe80:")) return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  return false;
}

function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) return isPrivateIpv6(ip);
  return isPrivateIpv4(ip);
}

export class UrlValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UrlValidationError";
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

  const hostname = parsed.hostname.toLowerCase();
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new UrlValidationError("That hostname is not allowed");
  }

  if (isPrivateIp(hostname)) {
    throw new UrlValidationError("Private network addresses are not allowed");
  }

  const addresses = await dns.lookup(hostname, { all: true });
  if (!addresses.length) {
    throw new UrlValidationError("Could not resolve that domain");
  }

  for (const addr of addresses) {
    if (isPrivateIp(addr.address)) {
      throw new UrlValidationError("That domain resolves to a private network address");
    }
  }

  parsed.hash = "";
  return parsed;
}

export async function validateRedirectUrl(url: URL): Promise<URL> {
  return validatePublicUrl(url.toString());
}
