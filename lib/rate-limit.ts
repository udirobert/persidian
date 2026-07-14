export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim() || "anonymous";
  }
  return request.headers.get("x-real-ip") || "anonymous";
}

interface RateLimitState {
  timestamps: number[];
}

export class RateLimiter {
  private requests = new Map<string, RateLimitState>();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  allow(key: string): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    const state = this.requests.get(key);

    const recent = state
      ? state.timestamps.filter((t) => now - t < this.windowMs)
      : [];

    if (recent.length >= this.maxRequests) {
      const oldest = recent[0] ?? now;
      const retryAfterMs = this.windowMs - (now - oldest);
      this.requests.set(key, { timestamps: recent });
      return { allowed: false, retryAfterMs };
    }

    recent.push(now);
    this.requests.set(key, { timestamps: recent });
    return { allowed: true, retryAfterMs: 0 };
  }
}
