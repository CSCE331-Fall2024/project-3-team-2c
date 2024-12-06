import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  orders,
  containers,
  menuItems,
  sizes,
  containersToMenu,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { between, count, eq, inArray } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const inputSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

const salesEntryShape = z.object({ name: z.string(), quantity: z.number() });
const salesOutputSchema = z.object({
  popularSizes: z.array(salesEntryShape),
  popularMains: z.array(salesEntryShape),
  popularSides: z.array(salesEntryShape),
});

async function getSalesReport(
  startDate: Date,
  endDate: Date,
): Promise<z.infer<typeof salesOutputSchema>> {
  console.log("getSalesReport", startDate, endDate);

  const orderIds = await db
    .select({ id: orders.id })
    .from(orders)
    .where(between(orders.timestamp, startDate, endDate));

  const containerIds = await db
    .select({ id: containers.id })
    .from(containers)
    .where(
      inArray(
        containers.orderId,
        orderIds.map((o) => o.id),
      ),
    );

  const sizeInfo = await db
    .select({ name: sizes.name, quantity: count(containers.sizeId) })
    .from(containers)
    .leftJoin(sizes, eq(containers.sizeId, sizes.id))
    .where(
      inArray(
        containers.id,
        containerIds.map((c) => {
          return c.id;
        }),
      ),
    )
    .orderBy(count(containers.sizeId));

  const mainInfo = await db
    .select({ name: menuItems.name, quantity: count(containersToMenu.itemId) })
    .from(containersToMenu)
    .leftJoin(menuItems, eq(containersToMenu.itemId, menuItems.id))
    .where(
      inArray(
        containersToMenu.containerId,
        containerIds.map((c) => c.id),
      ),
    )
    .orderBy(count(containersToMenu.itemId));

  const sideInfo = await db
    .select({ name: menuItems.name, quantity: count(containersToMenu.itemId) })
    .from(containersToMenu)
    .leftJoin(menuItems, eq(containersToMenu.itemId, menuItems.id))
    .where(
      inArray(
        containersToMenu.containerId,
        containerIds.map((c) => c.id),
      ),
    )
    .orderBy(count(containersToMenu.itemId));
  return {
    popularSizes: sizeInfo.map((s) => {
      return { name: s.name ?? "Unknown Name", quantity: s.quantity };
    }),
    popularMains: mainInfo.map((m) => {
      return { name: m.name ?? "Unknown Name", quantity: m.quantity };
    }),
    popularSides: sideInfo.map((s) => {
      return { name: s.name ?? "Unknown Name", quantity: s.quantity };
    }),
  };
}

export const reportsRouter = createTRPCRouter({
  salesReport: publicProcedure
    .input(inputSchema)
    .output(salesOutputSchema)
    .query(({ input }) => {
      return getSalesReport(input.startDate, input.endDate);
    }),
});
