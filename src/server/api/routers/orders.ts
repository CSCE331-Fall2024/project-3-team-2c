import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  containers,
  containersToMenu,
  orders,
  sizes,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { and, between, desc, eq } from "drizzle-orm";

const containerInputSchema = z.object({
  sizeId: z.number(),
  mainIds: z.array(z.number()),
  sideIds: z.array(z.number()),
});

const containerOutputSchema = z.object({
  containerId: z.number(),
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
  containers: z.array(containerOutputSchema),
  orderId: z.number(),
  total: z.number(),
  timestamp: z.date(),
});

// function getPriceFromSizes(sizeIds: number[]) {
//   sizeIds.map((id) => {
//     return db
//       .select({ price: sizes.price })
//       .from(sizes)
//       .where(eq(sizes.id, id));
//   });
//   console.log("PRICE" + sizeIds.reduce((sum, price) => sum + price, 0.0));
//   return sizeIds.reduce((sum, price) => sum + price, 0.0);
// }


/**
 * getPriceFromSizes
 *
 * Calculates the total price of containers based on their size IDs.
 *
 * @param sizeIds - An array of size IDs for which prices need to be calculated.
 * @returns The total price as a number.
 */
async function getPriceFromSizes(sizeIds: number[]) {
  // Fetch prices for each sizeId asynchronously and wait for all to resolve
  const pricePromises = sizeIds.map(async (id) => {
    const result = await db
      .select({ price: sizes.price })
      .from(sizes)
      .where(eq(sizes.id, id));
    return parseFloat(result[0]?.price ?? "0"); // Ensure the price is treated as a number
  });

  // Wait for all promises to resolve and sum the prices
  const prices = await Promise.all(pricePromises);

  // Log the total price
  console.log(
    "PRICE",
    prices.reduce((sum, price) => sum + price, 0.0),
  );

  // Return the sum of prices
  return prices.reduce((sum, price) => sum + price, 0.0);
}

/**
 * getOneOrder
 *
 * Retrieves details of a specific order, including containers and their items.
 *
 * @param input - The ID of the order to retrieve.
 * @returns The order details, including its containers and items.
 */
async function getOneOrder(
  input: number,
): Promise<z.infer<typeof orderOutputSchema>> {
  const order = (
    await db.select().from(orders).where(eq(orders.id, input))
  )?.at(0);

  const containerList = await db
    .select()
    .from(containers)
    .where(eq(containers.orderId, order!.id));

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
      containerId: container.id,
      sizeId: container.sizeId,
      mainIds: mainItems.map((item) => item.itemId),
      sideIds: sideItems.map((item) => item.itemId),
    };
  });

  return {
    customerId: order!.customerId,
    orderId: order!.id,
    total: parseFloat(order!.total),
    timestamp: order!.timestamp,
    containers: await Promise.all(containerListWithItems),
  };
}

export const ordersRouter = createTRPCRouter({
  // placeOrder: publicProcedure
  //   .input(orderInputSchema)
  //   .mutation(async ({ input }) => {
  //     // calculate total from container sizes
  //     const sizeIds = input.containers.map((container) => container.sizeId);
  //     const total = getPriceFromSizes(sizeIds);

  //     // insert order and get id
  //     const orderId = (
  //       await db
  //         .insert(orders)
  //         .values({
  //           total: total.toString(),
  //           customerId: input.customerId,
  //         })
  //         .returning({ orderId: orders.id })
  //     )?.at(0)?.orderId;

  //     // insert containers
  //     const containerIds = (
  //       await db
  //         .insert(containers)
  //         .values(
  //           input.containers.map((container) => ({
  //             orderId: orderId,
  //             sizeId: container.sizeId,
  //           })),
  //         )
  //         .returning({ containerId: containers.id })
  //     )?.map((row) => row.containerId);

  //     // insert containers_to_menu
  //     input.containers.forEach((container, index) => {
  //       const containerId = containerIds[index];
  //       container.mainIds.forEach((itemId) => {
  //         db.insert(containersToMenu).values({
  //           containerId,
  //           itemId,
  //           itemType: "main",
  //         });
  //       });

  //       container.sideIds.forEach((itemId) => {
  //         db.insert(containersToMenu).values({
  //           containerId,
  //           itemId,
  //           itemType: "side",
  //         });
  //       });
  //     });

  //     return { orderId };
  //   }),

  /**
 * placeOrder
 *
 * Creates a new order, calculates the total price, and inserts containers and items associated with the order.
 *
 * @input {orderInputSchema} - The details of the order, including customer ID and containers.
 * @returns The ID of the newly created order.
 */
  placeOrder: publicProcedure
    .input(orderInputSchema)
    .mutation(async ({ input }) => {
      // calculate total from container sizes
      const sizeIds = input.containers.map((container) => container.sizeId);
      const total = await getPriceFromSizes(sizeIds);

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

      if (!orderId) {
        throw new Error("Failed to create order");
      }

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

      if (!containerIds) {
        throw new Error("Failed to create containers");
      }

      // insert containers_to_menu
      await Promise.all(
        input.containers.map((container, index) => {
          const containerId = containerIds[index]!;

          const mainInsertions = container.mainIds.map((itemId) =>
            db.insert(containersToMenu).values({
              containerId,
              itemId,
              itemType: "main",
            }),
          );

          const sideInsertions = container.sideIds.map((itemId) =>
            db.insert(containersToMenu).values({
              containerId,
              itemId,
              itemType: "side",
            }),
          );

          return Promise.all([...mainInsertions, ...sideInsertions]);
        }),
      );

      return { orderId };
    }),

    /**
 * getOrder
 *
 * Fetches the details of a specific order by its ID.
 *
 * @input {number} - The ID of the order.
 * @output {orderOutputSchema} - The details of the order, including containers and items.
 * @returns The complete order details.
 */
  getOrder: publicProcedure
    .input(z.number())
    .output(orderOutputSchema)
    .query(async ({ input }) => {
      return { ...(await getOneOrder(input)), orderId: input };
    }),

    /**
 * getAllOrders
 *
 * Fetches all orders from the database.
 *
 * @output {Array<orderOutputSchema>} - An array of all orders with their details.
 * @returns A list of all orders.
 */
  getAllOrders: publicProcedure
    .output(z.array(orderOutputSchema))
    .query(async () => {
      const orderIds = await db.select({ id: orders.id }).from(orders);
      return await Promise.all(
        orderIds.map((orderId) => getOneOrder(orderId.id)),
      );
    }),

  /**
 * getLatestOrdersByCustomer
 *
 * Fetches the 5 most recent orders placed by a specific customer.
 *
 * @input {number} - The ID of the customer.
 * @output {Array<orderOutputSchema>} - An array of the most recent orders for the customer.
 * @returns A list of up to 5 most recent orders for the customer.
 */
  getLatestOrdersByCustomer: publicProcedure
    .input(z.number())
    .output(z.array(orderOutputSchema))
    .query(async ({ input }) => {
      const orderIds = await db
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.customerId, input))
        .orderBy(desc(orders.timestamp));

      return await Promise.all(
        orderIds.slice(0, 5).map((orderId) => getOneOrder(orderId.id)),
      );
    }),

    /**
 * getOrdersWithinTimePeriod
 *
 * Fetches orders placed within a specific time period.
 *
 * @input {Object} - An object containing `start` and `end` dates for the time period.
 * @output {Array<orderOutputSchema>} - An array of orders placed within the specified time period.
 * @returns A list of orders within the given time range.
 */
  getOrdersWithinTimePeriod: publicProcedure
    .input(z.object({ start: z.date(), end: z.date() }))
    .output(z.array(orderOutputSchema))
    .query(async ({ input }) => {
      const orderIds = await db
        .select({ id: orders.id })
        .from(orders)
        .where(between(orders.timestamp, input.start, input.end))
        .orderBy(desc(orders.timestamp));

      return await Promise.all(
        orderIds.slice(0, 5).map((orderId) => getOneOrder(orderId.id)),
      );
    }),
});
