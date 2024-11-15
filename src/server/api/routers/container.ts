import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { sizes } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

const sizeOutputSchema = createSelectSchema(sizes);
async function getSize(input: number) {
  return (await db.select().from(sizes).where(eq(sizes.id, input)))?.at(0);
}
export const containerRouter = createTRPCRouter({
  getSizes: publicProcedure.output(z.array(sizeOutputSchema)).query(() => {
    return db.select().from(sizes);
  }),

  getSizeFromId: publicProcedure
    .input(z.number())
    .output(sizeOutputSchema)
    .query(async ({ input }) => {
      return (await getSize(input))!;
    }),
});
