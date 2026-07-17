import dns from "node:dns/promises";
import { RateLimiter } from "@/lib/rate-limit";
import { UrlValidationError, assertHostnameResolvesPublic, isPrivateIpAddress } from "@/lib/site-scan/url";

export class ConcurrencyGate {
  private active = 0;
  private queue: Array<() => void> = [];

  constructor(private readonly max: number) {}

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.active += 1;
    try {
      return await fn();
    } finally {
      this.active -= 1;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

export interface FetchGuard {
  beforeRequest(url: string): Promise<void>;
  afterRequest(): void;
}

interface HostState {
  active: number;
  lastStartedAt: number;
}

export function createFetchGuard(options?: {
  maxConcurrentPerHost?: number;
  minIntervalMs?: number;
}): FetchGuard {
  const maxConcurrentPerHost = options?.maxConcurrentPerHost ?? 2;
  const minIntervalMs = options?.minIntervalMs ?? 250;
  const pinnedAddresses = new Map<string, Set<string>>();
  const hostState = new Map<string, HostState>();
  const hostQueues = new Map<string, Array<() => void>>();
  let currentHost: string | null = null;

  async function pinHostname(hostname: string): Promise<void> {
    await assertHostnameResolvesPublic(hostname);

    const addresses = await dns.lookup(hostname, { all: true });
    const resolved = new Set(addresses.map((entry) => entry.address));

    for (const address of resolved) {
      if (isPrivateIpAddress(address)) {
        throw new UrlValidationError("That domain resolves to a private network address");
      }
    }

    const existing = pinnedAddresses.get(hostname);
    if (!existing) {
      pinnedAddresses.set(hostname, resolved);
      return;
    }

    if (existing.size !== resolved.size || ![...resolved].every((addr) => existing.has(addr))) {
      throw new UrlValidationError("Domain resolved to different addresses during scan");
    }
  }

  async function acquireHost(hostname: string): Promise<void> {
    const state = hostState.get(hostname) ?? { active: 0, lastStartedAt: 0 };

    if (state.active >= maxConcurrentPerHost) {
      await new Promise<void>((resolve) => {
        const queue = hostQueues.get(hostname) ?? [];
        queue.push(resolve);
        hostQueues.set(hostname, queue);
      });
    }

    const waitMs = Math.max(0, minIntervalMs - (Date.now() - state.lastStartedAt));
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    state.active += 1;
    state.lastStartedAt = Date.now();
    hostState.set(hostname, state);
    currentHost = hostname;
  }

  function releaseHost(hostname: string): void {
    const state = hostState.get(hostname);
    if (!state) return;

    state.active = Math.max(0, state.active - 1);
    hostState.set(hostname, state);

    const queue = hostQueues.get(hostname);
    const next = queue?.shift();
    if (next) next();
  }

  return {
    async beforeRequest(url: string) {
      const hostname = new URL(url).hostname;
      await pinHostname(hostname);
      await acquireHost(hostname);
    },
    afterRequest() {
      if (!currentHost) return;
      releaseHost(currentHost);
      currentHost = null;
    },
  };
}

const domainScanLimiter = new RateLimiter(4, 5 * 60 * 1000);
const globalScanGate = new ConcurrencyGate(4);

export function checkTargetDomainScanLimit(hostname: string): { allowed: boolean; retryAfterMs: number } {
  return domainScanLimiter.allow(`scan-domain:${hostname.toLowerCase()}`);
}

export async function runWithScanConcurrency<T>(fn: () => Promise<T>): Promise<T> {
  return globalScanGate.run(fn);
}
