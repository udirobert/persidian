const MAX_HTML_BYTES = 512_000;
const FETCH_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 5;

export interface FetchResult {
  finalUrl: string;
  html: string;
  status: number;
}

export async function fetchPublicPage(
  startUrl: string,
  validateRedirect: (url: URL) => Promise<URL>
): Promise<FetchResult> {
  let current = startUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
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
        const next = new URL(location, current);
        await validateRedirect(next);
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

      const buffer = await response.arrayBuffer();
      const html = new TextDecoder("utf-8", { fatal: false }).decode(
        buffer.slice(0, MAX_HTML_BYTES)
      );

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

export async function fetchRobotsTxt(origin: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${origin}/robots.txt`, {
      signal: controller.signal,
      headers: { "User-Agent": "Persidian-Xray/1.0 (+https://persidian.com/trust)" },
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    return (await response.text()).slice(0, 20_000);
  } catch {
    return null;
  }
}

export function robotsDisallowsAll(robots: string | null, path = "/"): boolean {
  if (!robots) return false;
  const lines = robots.split("\n");
  let activeAgent = false;
  let disallowed = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    const lowerKey = key.toLowerCase();

    if (lowerKey === "user-agent") {
      activeAgent = value === "*" || value.toLowerCase().includes("persidian");
    } else if (activeAgent && lowerKey === "disallow") {
      if (value === "/" || (value && path.startsWith(value))) {
        disallowed = true;
      }
    }
  }

  return disallowed;
}
