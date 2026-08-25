import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { checkRateLimit } from "./rateLimit";
import { runSatStatus, satStatusRawInput } from "./satStatus";

const limitedProcedure = publicProcedure.use(({ ctx, next }) => {
  const forwarded = ctx.req.headers?.["x-forwarded-for"];
  const key = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]?.trim() || ctx.req.ip || "unknown";
  const result = checkRateLimit(key);
  if (!result.allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: `Espera ${result.retryAfterSeconds} segundos antes de volver a consultar.` });
  return next();
});

export const appRouter = router({
  satStatus: router({
    query: limitedProcedure.input(satStatusRawInput).mutation(({ input }) => runSatStatus(input)),
  }),
});

export type AppRouter = typeof appRouter;
