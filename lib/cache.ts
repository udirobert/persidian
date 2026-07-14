import { createHash } from "crypto";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  constructor(
    private maxSize = 500,
    private defaultTtlMs = 5 * 60 * 1000
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
    if (this.store.size > this.maxSize) {
      this.evictOldest();
    }
  }

  private evictOldest(): void {
    const now = Date.now();
    let oldestKey: string | undefined;
    let oldestExpiry = Infinity;
    for (const [key, entry] of this.store) {
      if (entry.expiresAt < now) {
        this.store.delete(key);
        continue;
      }
      if (entry.expiresAt < oldestExpiry) {
        oldestExpiry = entry.expiresAt;
        oldestKey = key;
      }
    }
    if (oldestKey) {
      this.store.delete(oldestKey);
    }
  }
}

export function hashObject(obj: unknown): string {
  return createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

export function withCacheAndDedupe<K, V>(
  fn: (key: K) => Promise<V>,
  options: { maxSize?: number; ttlMs?: number } = {}
): (key: K) => Promise<V> {
  const cache = new MemoryCache<V>(options.maxSize, options.ttlMs);
  const inFlight = new Map<string, Promise<V>>();

  return async (key: K) => {
    const keyString = typeof key === "string" ? key : hashObject(key);

    const cached = cache.get(keyString);
    if (cached) return cached;

    const pending = inFlight.get(keyString);
    if (pending) return pending;

    const promise = fn(key)
      .then((value) => {
        cache.set(keyString, value);
        return value;
      })
      .finally(() => {
        inFlight.delete(keyString);
      });

    inFlight.set(keyString, promise);
    return promise;
  };
}
