import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { containers, menuItems } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

async function getOneItem(input: number) {
  return (
    await db.select().from(menuItems).where(eq(containers.id, input))
  )?.at(0);
}

const outputSchema = createSelectSchema(menuItems);

export const menuRouter = createTRPCRouter({
  getMenuItemById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneItem(input))!;
    }),

  getAllMenuItems: publicProcedure.output(z.array(outputSchema)).query(() => {
    return db.select().from(menuItems);
  }),

  getMenuItemsByIds: publicProcedure
    .input(z.array(z.number()))
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      return Promise.all(
        input.map(async (id) => {
          return (await getOneItem(id))!;
        }),
      );
    }),

  getMenuItemsByType: publicProcedure
    .input(z.string())
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      return db
        .select()
        .from(menuItems)
        .where(eq(menuItems.type, input.toUpperCase()));
    }),
});
