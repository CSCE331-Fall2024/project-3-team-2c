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
import { between, count, desc, eq, inArray, sum } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const inputSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

const salesEntryShape = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
});
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

  // console.log("got container ids", containerIds);
  const sizeInfo = await db
    .select({
      id: sizes.id,
      name: sizes.name,
      quantity: count(containers.sizeId),
    })
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
    .groupBy(sizes.id)
    .orderBy(desc(count(containers.sizeId)));
  // console.log("got size info", sizeInfo);
  const mainInfo = await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      quantity: count(containersToMenu.itemId),
    })
    .from(containersToMenu)
    .leftJoin(menuItems, eq(containersToMenu.itemId, menuItems.id))
    .where(
      inArray(
        containersToMenu.containerId,
        containerIds.map((c) => c.id),
      ),
    )
    .groupBy(menuItems.id)
    .orderBy(desc(count(containersToMenu.itemId)));

  // console.log("got main info", mainInfo);
  const sideInfo = await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      quantity: count(containersToMenu.itemId),
    })
    .from(containersToMenu)
    .leftJoin(menuItems, eq(containersToMenu.itemId, menuItems.id))
    .where(
      inArray(
        containersToMenu.containerId,
        containerIds.map((c) => c.id),
      ),
    )
    .groupBy(menuItems.id)
    .orderBy(desc(count(containersToMenu.itemId)));

  // console.log("got side info", sideInfo);
  return {
    popularSizes: sizeInfo.map((s) => {
      return {
        id: s.id!,
        name: s.name ?? "Unknown Name",
        quantity: s.quantity,
      };
    }),
    popularMains: mainInfo.map((m) => {
      return {
        id: m.id!,
        name: m.name ?? "Unknown Name",
        quantity: m.quantity,
      };
    }),
    popularSides: sideInfo.map((s) => {
      return {
        id: s.id!,
        name: s.name ?? "Unknown Name",
        quantity: s.quantity,
      };
    }),
  };
}

const xzOutputSchema = z
  .array(
    z.object({
      date: z.date(),
      sales: z.number(),
      revenue: z.number(),
    }),
  )
  .length(24);

async function getHour(start: Date, end: Date) {
  // console.log("getHour", start, end);
  return (
    (
      await db
        .select({ sales: count(orders.id), revenue: sum(orders.total) })
        .from(orders)
        .where(between(orders.timestamp, start, end))
    )?.at(0) ?? { sales: 0, revenue: 0 }
  );
}

async function xzReport(day: Date): Promise<z.infer<typeof xzOutputSchema>> {
  // console.log("start", start, "end", end);
  // console.log("day given", day);
  const tmpArray = Array(24).fill(0);
  // console.log("tmpArray", tmpArray);

  const ordersData = await Promise.all(
    tmpArray.map(async (_val, index) => {
      const start = new Date(day);
      const end = new Date(day);
      start.setHours(index, 0, 0, 0);
      end.setHours(index, 59, 59, 999);
      // console.log("start", start, "end", end);

      const data = await getHour(start, end);
      return {
        date: start,
        sales: data.sales,
        revenue: data.revenue,
      };
    }),
  );

  // console.log("ordersData", ordersData);

  const hi = ordersData.map((data) => ({
    date: data?.date ?? new Date(),
    sales: data?.sales ?? 0,
    revenue: Number(data?.revenue ?? 0),
  }));
  // console.log("hi", hi);
  return hi;
}

export const reportsRouter = createTRPCRouter({
  salesReport: publicProcedure
    .input(inputSchema)
    .output(salesOutputSchema)
    .query(({ input }) => {
      return getSalesReport(input.startDate, input.endDate);
    }),
  xReport: publicProcedure.output(xzOutputSchema).query(async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // console.log("yesterday", yesterday);

    return await xzReport(yesterday);
  }),
  zReport: publicProcedure.output(xzOutputSchema).query(async () => {
    const today = new Date();
    // console.log("today", today);

    return await xzReport(today);
  }),
});
