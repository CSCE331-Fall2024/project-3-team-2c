import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { disposable_items } from "~/server/db/schema";

async function getOneDisposableItem(input: number) {
  console.log("getOneDisposableItem", input);
  return (
    await db
      .select()
      .from(disposable_items)
      .where(eq(disposable_items.id, input))
  )?.at(0);
}

const outputSchema = createSelectSchema(disposable_items);
const insertSchema = createInsertSchema(disposable_items);
const updateSchema = z.object({
  ...insertSchema.partial().shape,
  id: z.number(),
});

export const employeesRouter = createTRPCRouter({
  getDisposableItemById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneDisposableItem(input))!;
    }),

  getAllDisposableItems: publicProcedure
    .output(z.array(outputSchema))
    .query(() => {
      return db.select().from(disposable_items);
    }),

  getDisposableItemsByIds: publicProcedure
    .input(z.array(z.number()))
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      console.log("running getOneDisposableItem Query", input.length);
      if (input.length == 0) {
        return [];
      }
      return Promise.all(
        input.map(async (id) => {
          console.log(id);
          return (await getOneDisposableItem(id))!;
        }),
      );
    }),

  addDisposableItem: publicProcedure
    .input(insertSchema)
    .mutation(async ({ input }) => {
      return db.insert(disposable_items).values(input);
    }),

  updateDisposableItem: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      return db
        .update(disposable_items)
        .set(input)
        .where(eq(disposable_items.id, input.id));
    }),

  deleteDisposableItem: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(disposable_items).where(eq(disposable_items.id, input));
    }),
});
