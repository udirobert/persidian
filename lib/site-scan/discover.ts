import { fetchPublicText } from "@/lib/site-scan/fetch";
import type { FetchGuard } from "@/lib/site-scan/limits";
import { isPathBlocked } from "@/lib/site-scan/robots";

const MAX_EXTRA_PAGES = 4;

const HIGH_VALUE_SEGMENTS = [
  "about",
  "company",
  "integrations",
  "integration",
  "partners",
  "partner",
  "security",
  "trust",
  "pricing",
  "product",
  "products",
  "platform",
  "solutions",
  "customers",
  "docs",
  "features",
];

function scorePath(pathname: string): number {
  const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (normalized === "/") return -1;

  let score = 0;
  for (const segment of HIGH_VALUE_SEGMENTS) {
    if (normalized.includes(segment)) score += 10;
  }
  if (!score) return -1;
  if (normalized.split("/").filter(Boolean).length <= 2) score += 1;
  return score;
}

function pathRank(pathname: string): number {
  const normalized = pathname.toLowerCase();
  for (let i = 0; i < HIGH_VALUE_SEGMENTS.length; i++) {
    if (normalized.includes(HIGH_VALUE_SEGMENTS[i])) return i;
  }
  return HIGH_VALUE_SEGMENTS.length;
}

function normalizePath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function parseSitemapLocs(xml: string, origin: string): string[] {
  const base = new URL(origin);
  const paths = new Set<string>();

  for (const match of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
    try {
      const resolved = new URL(match[1].trim());
      if (resolved.origin !== base.origin) continue;
      paths.add(normalizePath(resolved.pathname));
    } catch {
      // skip invalid loc
    }
  }

  return [...paths];
}

async function fetchSitemapPaths(
  origin: string,
  validateRedirect: (url: URL) => Promise<URL>,
  guard?: FetchGuard
): Promise<string[]> {
  const candidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  const paths = new Set<string>();

  for (const candidate of candidates) {
    try {
      const { text } = await fetchPublicText(
        candidate,
        validateRedirect,
        undefined,
        256_000,
        guard
      );
      for (const path of parseSitemapLocs(text, origin)) {
        paths.add(path);
      }
      if (paths.size) break;
    } catch {
      // try next candidate
    }
  }

  return [...paths];
}

export async function discoverSupplementalPaths(
  origin: string,
  homepagePath: string,
  homepageLinks: string[],
  robots: string | null,
  validateRedirect: (url: URL) => Promise<URL>,
  guard?: FetchGuard
): Promise<string[]> {
  const homepage = normalizePath(new URL(homepagePath, origin).pathname);
  const candidates = new Set<string>();

  for (const path of homepageLinks.map(normalizePath)) {
    if (path !== homepage) candidates.add(path);
  }

  for (const path of await fetchSitemapPaths(origin, validateRedirect, guard)) {
    if (path !== homepage) candidates.add(path);
  }

  const scored = [...candidates]
    .filter((path) => scorePath(path) >= 0)
    .filter((path) => !isPathBlocked(robots, path))
    .sort(
      (a, b) =>
        scorePath(b) - scorePath(a) || pathRank(a) - pathRank(b) || a.localeCompare(b)
    );

  return scored.slice(0, MAX_EXTRA_PAGES);
}

export function buildPageUrl(origin: string, path: string): string {
  return new URL(path, origin).toString();
}
