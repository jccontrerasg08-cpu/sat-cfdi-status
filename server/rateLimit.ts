const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, now = Date.now()) {
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 } as const;
  }
  if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1_000) } as const;
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 } as const;
}

export function clearRateLimits() {
  buckets.clear();
}

// ponytail: el mapa es por instancia serverless; reemplazarlo por un límite distribuido si el abuso persiste entre instancias.
