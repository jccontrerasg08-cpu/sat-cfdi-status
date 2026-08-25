import { afterEach, describe, expect, it } from "vitest";
import { checkRateLimit, clearRateLimits } from "./rateLimit";

afterEach(clearRateLimits);

describe("límite de tasa público", () => {
  it("acepta veinte consultas por minuto y rechaza la siguiente", () => {
    for (let index = 0; index < 20; index += 1) expect(checkRateLimit("client", 1_000).allowed).toBe(true);
    expect(checkRateLimit("client", 1_000)).toEqual({ allowed: false, retryAfterSeconds: 60 });
  });
});
