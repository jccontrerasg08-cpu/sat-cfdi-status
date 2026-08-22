import { publicProcedure, router } from "./_core/trpc";
import { runSatStatus, satStatusRawInput } from "./satStatus";

export const appRouter = router({
  satStatus: router({
    query: publicProcedure.input(satStatusRawInput).mutation(({ input }) => runSatStatus(input)),
  }),
});

export type AppRouter = typeof appRouter;
