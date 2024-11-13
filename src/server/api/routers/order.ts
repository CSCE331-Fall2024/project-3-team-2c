import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  containers,
  containersToMenu,
  orders,
  sizes,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";

const containerSchema = z.object({
  sizeId: z.number(),
  mainIds: z.array(z.number()),
  sideIds: z.array(z.number()),
});

const orderSchema = z.object({
  total: z.number(),
  customerId: z.number(),
  containers: z.array(containerSchema),
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

export const orderRouter = createTRPCRouter({
  insert: publicProcedure.input(orderSchema).mutation(async ({ input }) => {
    // calculate total from container sizes
    const sizeIds = input.containers.map((container) => container.sizeId);
    const total = getPriceFromSizes(sizeIds);

    // insert order and get id
    const orderId = (
      await db
        .insert(orders)
        .values({
          total: total.toString(),
          customerId: input.customerId,
        })
        .returning({ orderId: orders.id })
    )?.at(0)?.orderId;

    // insert containers
    const containerIds = (
      await db
        .insert(containers)
        .values(
          input.containers.map((container) => ({
            orderId: orderId,
            sizeId: container.sizeId,
          })),
        )
        .returning({ containerId: containers.id })
    )?.map((row) => row.containerId);

    // insert containers_to_menu
    input.containers.forEach((container, index) => {
      const containerId = containerIds[index];
      container.mainIds.forEach((itemId) => {
        db.insert(containersToMenu).values({
          containerId,
          itemId,
          itemType: "main",
        });
      });

      container.sideIds.forEach((itemId) => {
        db.insert(containersToMenu).values({
          containerId,
          itemId,
          itemType: "side",
        });
      });
    });

    return { orderId };
  }),
});
