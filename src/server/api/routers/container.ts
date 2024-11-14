import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  containers,
  containersToMenu,
  menuItems,
  orders,
  sizes,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const containerInputSchema = z.object({
  sizeId: z.number(),
  mainIds: z.array(z.number()),
  sideIds: z.array(z.number()),
});

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
