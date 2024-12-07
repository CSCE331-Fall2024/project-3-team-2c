import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { ingredients } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


/**
 * getOneIngredient
 *
 * Fetches a single ingredient from the database based on its ID.
 *
 * @param input - The ID of the ingredient to retrieve.
 * @returns The ingredient matching the provided ID, or `undefined` if no match is found.
 *
 */

async function getOneIngredient(input: number) {
  console.log("getOneIngredient", input);
  return (
    await db.select().from(ingredients).where(eq(ingredients.id, input))
  )?.at(0);
}

const outputSchema = createSelectSchema(ingredients);
const insertSchema = createInsertSchema(ingredients);
const updateSchema = z.object({
  ...insertSchema.partial().shape,
  id: z.number(),
});

export const ingredientsRouter = createTRPCRouter({
  /**
 * getIngredientById
 *
 * A public procedure to fetch a single ingredient based on its ID.
 *
 * @input {number} - The ID of the ingredient to retrieve.
 * @output {outputSchema} - The schema representing the returned ingredient.
 * @returns The ingredient matching the provided ID.
 */
  getIngredientById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneIngredient(input))!;
    }),

    /**
 * getAllIngredients
 *
 * A public procedure to fetch all ingredients from the database.
 *
 * @output {Array<outputSchema>} - An array of all ingredients.
 * @returns All ingredients in the database.
 */
  getAllIngredients: publicProcedure.output(z.array(outputSchema)).query(() => {
    return db.select().from(ingredients);
  }),

  /**
 * getIngredientsByIds
 *
 * A public procedure to fetch multiple ingredients by their IDs.
 *
 * @input {Array<number>} - An array of ingredient IDs to retrieve.
 * @output {Array<outputSchema>} - An array of ingredients matching the provided IDs.
 * @returns The ingredients corresponding to the provided IDs.
 */
  getIngredientsByIds: publicProcedure
    .input(z.array(z.number()))
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      console.log("running getOneIngredient Query", input.length);
      if (input.length == 0) {
        return [];
      }
      return Promise.all(
        input.map(async (id) => {
          console.log(id);
          return (await getOneIngredient(id))!;
        }),
      );
    }),

    /**
 * addIngredient
 *
 * A public procedure to add a new ingredient to the database.
 *
 * @input {insertSchema} - The schema representing the data to insert.
 * @returns The result of the insert operation.
 */
  addIngredient: publicProcedure
    .input(insertSchema)
    .mutation(async ({ input }) => {
      return db.insert(ingredients).values(input);
    }),

    /**
 * updateIngredient
 *
 * A public procedure to update an existing ingredient in the database.
 *
 * @input {updateSchema} - The schema representing the updated data, including the ingredient ID.
 * @returns The result of the update operation.
 */
  updateIngredient: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      return db
        .update(ingredients)
        .set(input)
        .where(eq(ingredients.id, input.id));
    }),

    /**
 * deleteIngredient
 *
 * A public procedure to delete an ingredient from the database based on its ID.
 *
 * @input {number} - The ID of the ingredient to delete.
 * @returns The result of the delete operation.
 */
  deleteIngredient: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(ingredients).where(eq(ingredients.id, input));
    }),
});
