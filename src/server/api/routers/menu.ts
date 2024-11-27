import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { containers, menuItems } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const outputSchema = createSelectSchema(menuItems);
const insertSchema = createInsertSchema(menuItems);
const updateSchema = z.object({
  ...insertSchema.partial().shape,
  id: z.number(),
});

async function getOneItem(input: number) {
  console.log("getOneItem", input);
  return (await db.select().from(menuItems).where(eq(menuItems.id, input)))?.at(
    0,
  );
}

async function addOneItem(input: z.infer<typeof insertSchema>) {
  console.log("addOneItem", input);
  return (await db.insert(menuItems).values(input))?.at(0);
}

async function updateOneItem(input: z.infer<typeof updateSchema>) {
  console.log("updateOneItem", input);
  return (
    await db.update(menuItems).set(input).where(eq(menuItems.id, input.id))
  )?.at(0);
}

async function deleteOneItem(input: number) {
  console.log("updateOneItem", input);
  return (await db.delete(menuItems).where(eq(menuItems.id, input)))?.at(0);
}

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
      console.log("running getOneItem Query", input.length);
      if (input.length == 0) {
        return [];
      }
      return Promise.all(
        input.map(async (id) => {
          console.log(id);
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

  addMenuItem: publicProcedure
    .input(insertSchema)
    .output(outputSchema)
    .mutation(async ({ input }) => {
      return (await addOneItem(input))!;
    }),

  updateMenuItem: publicProcedure
    .input(updateSchema)
    .output(outputSchema)
    .mutation(async ({ input }) => {
      return (await updateOneItem(input))!;
    }),

  deleteMenuItem: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .mutation(async ({ input }) => {
      return (await deleteOneItem(input))!;
    }),
});
