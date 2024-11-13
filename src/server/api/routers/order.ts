import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  containers,
  containersToMenu,
  orders,
  sizes,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";

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

async function getOneOrder(input: number) {
  const order = (
    await db.select().from(orders).where(eq(orders.id, input))
  )?.at(0);

  if (!order) {
    return null;
  }

  const containerList = await db
    .select()
    .from(containers)
    .where(eq(containers.orderId, order.id));

  const containerListWithItems = containerList.map(async (container) => {
    const mainItems = await db
      .select({ itemId: containersToMenu.itemId })
      .from(containersToMenu)
      .where(
        and(
          eq(containersToMenu.containerId, container.id),
          eq(containersToMenu.itemType, "main"),
        ),
      );

    const sideItems = await db
      .select({ itemId: containersToMenu.itemId })
      .from(containersToMenu)
      .where(
        and(
          eq(containersToMenu.containerId, container.id),
          eq(containersToMenu.itemType, "side"),
        ),
      );
    return {
      ...container,
      mainItems,
      sideItems,
    };
  });

  return {
    ...order,
    containers: containerListWithItems,
  };
}

export const orderRouter = createTRPCRouter({
  insert: publicProcedure
    .input(orderInputSchema)
    .mutation(async ({ input }) => {
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

  getOrder: publicProcedure.input(z.number()).query(({ input }) => {
    return getOneOrder(input);
  }),

  getAllOrders: publicProcedure.query(async () => {
    const orderIds = await db.select({ id: orders.id }).from(orders);
    return orderIds.map((orderId) => getOneOrder(orderId.id));
  }),
});
