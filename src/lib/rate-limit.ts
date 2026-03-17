const requests = new Map<string, number[]>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const timestamps = requests.get(ip) ?? [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    const oldest = valid[0];
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((oldest + WINDOW_MS - now) / 1000),
    };
  }

  valid.push(now);
  requests.set(ip, valid);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - valid.length,
    resetIn: 0,
  };
}
