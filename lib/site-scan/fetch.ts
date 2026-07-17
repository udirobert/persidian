import { isPathBlocked } from "@/lib/site-scan/robots";

const MAX_HTML_BYTES = 512_000;
const FETCH_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 5;

export interface FetchResult {
  finalUrl: string;
  html: string;
  status: number;
}

async function readLimitedText(response: Response, maxBytes: number): Promise<string> {
  const contentLength = response.headers.get("content-length");
  if (contentLength) {
    const length = Number(contentLength);
    if (!Number.isNaN(length) && length > maxBytes) {
      throw new Error("Response too large");
    }
  }

  const reader = response.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Response too large");
    }
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);
  return new TextDecoder("utf-8", { fatal: false }).decode(buffer);
}

export async function fetchPublicPage(
  startUrl: string,
  validateRedirect: (url: URL) => Promise<URL>,
  revalidateHost?: (url: string) => Promise<void>
): Promise<FetchResult> {
  let current = startUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (revalidateHost) {
      await revalidateHost(current);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(current, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "Persidian-Xray/1.0 (+https://persidian.com/trust)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      clearTimeout(timeout);

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          throw new Error("Redirect without location header");
        }
        const next = await validateRedirect(new URL(location, current));
        current = next.toString();
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        throw new Error("URL did not return HTML");
      }

      const html = await readLimitedText(response, MAX_HTML_BYTES);

      return {
        finalUrl: current,
        html,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  throw new Error("Too many redirects");
}

export async function fetchRobotsTxt(
  origin: string,
  validateRedirect: (url: URL) => Promise<URL>,
  revalidateHost?: (url: string) => Promise<void>
): Promise<string | null> {
  let current = `${origin}/robots.txt`;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (revalidateHost) {
      await revalidateHost(current);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(current, {
        signal: controller.signal,
        redirect: "manual",
        headers: { "User-Agent": "Persidian-Xray/1.0 (+https://persidian.com/trust)" },
      });
      clearTimeout(timeout);

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) return null;
        const next = await validateRedirect(new URL(location, current));
        current = next.toString();
        continue;
      }

      if (!response.ok) return null;
      return (await readLimitedText(response, 20_000)).slice(0, 20_000);
    } catch {
      clearTimeout(timeout);
      return null;
    }
  }

  return null;
}

export function robotsDisallowsAll(robots: string | null, path = "/"): boolean {
  return isPathBlocked(robots, path);
}

export async function fetchPublicText(
  startUrl: string,
  validateRedirect: (url: URL) => Promise<URL>,
  revalidateHost?: (url: string) => Promise<void>,
  maxBytes = 256_000
): Promise<{ finalUrl: string; text: string; status: number }> {
  let current = startUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (revalidateHost) {
      await revalidateHost(current);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(current, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "Persidian-Xray/1.0 (+https://persidian.com/trust)",
          Accept: "text/plain,text/xml,application/xml,application/xhtml+xml,text/html",
        },
      });
      clearTimeout(timeout);

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          throw new Error("Redirect without location header");
        }
        const next = await validateRedirect(new URL(location, current));
        current = next.toString();
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await readLimitedText(response, maxBytes);

      return {
        finalUrl: current,
        text,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  throw new Error("Too many redirects");
}
