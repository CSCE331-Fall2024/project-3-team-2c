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

/**
 * getOneItem
 *
 * Fetches a single menu item from the database based on its ID.
 *
 * @param input - The ID of the menu item to retrieve.
 * @returns The menu item matching the provided ID, or `undefined` if not found.
 */
async function getOneItem(input: number) {
  console.log("getOneItem", input);
  return (await db.select().from(menuItems).where(eq(menuItems.id, input)))?.at(
    0,
  );
}

/**
 * addOneItem
 *
 * Adds a new menu item to the database.
 *
 * @param input - An object adhering to the insertSchema representing the new menu item data.
 * @returns The newly inserted menu item.
 */
async function addOneItem(input: z.infer<typeof insertSchema>) {
  console.log("addOneItem", input);
  return (await db.insert(menuItems).values(input).returning())?.at(0);
}

/**
 * updateOneItem
 *
 * Updates an existing menu item in the database.
 *
 * @param input - An object adhering to the updateSchema containing updated menu item data, including the ID.
 * @returns The updated menu item, or `undefined` if the operation failed.
 */
async function updateOneItem(input: z.infer<typeof updateSchema>) {
  console.log("updateOneItem", input);

  return (
    await db
      .update(menuItems)
      .set({
        id: input.id,
        name: input.name?.toUpperCase(),
        type: input.type?.toUpperCase(),
      })
      .where(eq(menuItems.id, input.id))
      .returning()
  )?.at(0);
}

/**
 * deleteOneItem
 *
 * Deletes a menu item from the database by its ID.
 *
 * @param input - The ID of the menu item to delete.
 * @returns The deleted menu item, or `undefined` if the operation failed.
 */
async function deleteOneItem(input: number) {
  console.log("updateOneItem", input);
  return (await db.delete(menuItems).where(eq(menuItems.id, input)))?.at(0);
}

export const menuRouter = createTRPCRouter({

  /**
 * getMenuItemById
 *
 * A public procedure to fetch a single menu item by its ID.
 *
 * @input {number} - The ID of the menu item.
 * @output {outputSchema} - The schema of the menu item.
 * @returns The menu item matching the ID.
 */
  getMenuItemById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneItem(input))!;
    }),

    /**
 * getAllMenuItems
 *
 * A public procedure to fetch all menu items from the database.
 *
 * @output {Array<outputSchema>} - An array of all menu items.
 * @returns All menu items in the database.
 */
  getAllMenuItems: publicProcedure.output(z.array(outputSchema)).query(() => {
    return db.select().from(menuItems);
  }),

  /**
 * getMenuItemsByIds
 *
 * A public procedure to fetch multiple menu items by their IDs.
 *
 * @input {Array<number>} - An array of menu item IDs.
 * @output {Array<outputSchema>} - An array of menu items matching the IDs.
 * @returns The menu items corresponding to the provided IDs.
 */
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

    /**
 * getMenuItemsByType
 *
 * A public procedure to fetch menu items filtered by type.
 *
 * @input {string} - The type of menu items to retrieve (e.g., "entree", "side").
 * @output {Array<outputSchema>} - An array of menu items of the specified type.
 * @returns The menu items of the specified type.
 */
  getMenuItemsByType: publicProcedure
    .input(z.string())
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      return db
        .select()
        .from(menuItems)
        .where(eq(menuItems.type, input.toUpperCase()));
    }),

    /**
 * addMenuItem
 *
 * A public procedure to add a new menu item to the database.
 *
 * @input {insertSchema} - The schema representing the menu item data to add.
 * @output {outputSchema} - The schema of the newly inserted menu item.
 * @returns The newly added menu item.
 */
  addMenuItem: publicProcedure
    .input(insertSchema)
    .output(outputSchema)
    .mutation(async ({ input }) => {
      return (await addOneItem(input))!;
    }),

    /**
 * updateMenuItem
 *
 * A public procedure to update an existing menu item in the database.
 *
 * @input {updateSchema} - The schema representing the updated menu item data, including the ID.
 * @output {outputSchema} - The schema of the updated menu item.
 * @returns The updated menu item.
 */
  updateMenuItem: publicProcedure
    .input(updateSchema)
    .output(outputSchema)
    .mutation(async ({ input }) => {
      return (await updateOneItem(input))!;
    }),

    /**
 * deleteMenuItem
 *
 * A public procedure to delete a menu item by its ID.
 *
 * @input {number} - The ID of the menu item to delete.
 * @output {outputSchema} - The schema of the deleted menu item.
 * @returns The deleted menu item.
 */
  deleteMenuItem: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .mutation(async ({ input }) => {
      return (await deleteOneItem(input))!;
    }),
});
