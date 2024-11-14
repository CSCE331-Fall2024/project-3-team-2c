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

const orderInputSchema = z.object({
  customerId: z.number(),
  containers: z.array(containerInputSchema),
});

const orderOutputSchema = z.object({
  ...orderInputSchema.shape,
  orderId: z.number(),
  total: z.number(),
  timestamp: z.string(),
});

function getPriceFromSizes(sizeIds: number[]) {
  sizeIds.map((id) => {
    return db
      .select({ price: sizes.price })
      .from(sizes)
      .where(eq(sizes.id, id));
  });

  return sizeIds.reduce((sum, price) => sum + price, 0.0);
}

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
});
