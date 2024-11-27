import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { ingredients } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

async function getOneIngredient(input: number) {
  console.log("getOneIngredient", input);
  return (
    await db.select().from(ingredients).where(eq(ingredients.id, input))
  )?.at(0);
}

const outputSchema = createSelectSchema(ingredients);
const insertSchema = createInsertSchema(ingredients);
const updateSchema = z.object({
  ...insertSchema.shape,
  id: z.number(),
});

export const ingredientsRouter = createTRPCRouter({
  getIngredientById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneIngredient(input))!;
    }),

  getAllIngredients: publicProcedure.output(z.array(outputSchema)).query(() => {
    return db.select().from(ingredients);
  }),

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

  addIngredient: publicProcedure
    .input(insertSchema)
    .mutation(async ({ input }) => {
      return db.insert(ingredients).values(input);
    }),

  updateIngredient: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      return db
        .update(ingredients)
        .set(input)
        .where(eq(ingredients.id, input.id));
    }),

  deleteIngredient: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(ingredients).where(eq(ingredients.id, input));
    }),
});
