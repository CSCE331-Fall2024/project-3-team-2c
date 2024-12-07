import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { disposable_items } from "~/server/db/schema";


/**
 * getOneDisposableItem
 *
 * Fetches a single disposable item from the database based on its ID.
 *
 * @param input - The ID of the disposable item to retrieve.
 * @returns The disposable item matching the provided ID, or `undefined` if no match is found.
 *
 */

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


export const disposableItemsRouter = createTRPCRouter({
  /**
 * getDisposableItemById
 *
 * A public procedure to fetch a single disposable item based on its ID.
 *
 * @input {number} - The ID of the disposable item to retrieve.
 * @output {outputSchema} - The schema representing the returned disposable item.
 * @returns The disposable item matching the provided ID.
 */
  getDisposableItemById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneDisposableItem(input))!;
    }),

    /**
 * getAllDisposableItems
 *
 * A public procedure to fetch all disposable items from the database.
 *
 * @output {Array<outputSchema>} - An array of disposable items.
 * @returns All disposable items in the database.
 */

  getAllDisposableItems: publicProcedure
    .output(z.array(outputSchema))
    .query(() => {
      return db.select().from(disposable_items);
    }),


/**
 * getDisposableItemsByIds
 *
 * A public procedure to fetch multiple disposable items by their IDs.
 *
 * @input {Array<number>} - An array of IDs of the disposable items to retrieve.
 * @output {Array<outputSchema>} - An array of disposable items matching the provided IDs.
 * @returns The disposable items corresponding to the provided IDs.
 */
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

/**
 * addDisposableItem
 *
 * A public procedure to add a new disposable item to the database.
 *
 * @input {insertSchema} - The schema representing the data to insert.
 * @returns The result of the insert operation.
 */
  addDisposableItem: publicProcedure
    .input(insertSchema)
    .mutation(async ({ input }) => {
      return db.insert(disposable_items).values(input);
    }),

/**
 * updateDisposableItem
 *
 * A public procedure to update an existing disposable item in the database.
 *
 * @input {updateSchema} - The schema representing the updated data, including the item ID.
 * @returns The result of the update operation.
 */

  updateDisposableItem: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      return db
        .update(disposable_items)
        .set(input)
        .where(eq(disposable_items.id, input.id));
    }),

/**
 * deleteDisposableItem
 *
 * A public procedure to delete a disposable item from the database based on its ID.
 *
 * @input {number} - The ID of the disposable item to delete.
 * @returns The result of the delete operation.
 */
  deleteDisposableItem: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(disposable_items).where(eq(disposable_items.id, input));
    }),
});
