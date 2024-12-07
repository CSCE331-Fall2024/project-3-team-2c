import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { sizes } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

const sizeOutputSchema = createSelectSchema(sizes);

/**
 * getSize
 *
 * A helper function to fetch a specific container size from the database based on its ID.
 *
 * @param input - A numeric ID representing the container size.
 * @returns The size object matching the provided ID, or `undefined` if no match is found.
 *
 */
async function getSize(input: number) {
  return (await db.select().from(sizes).where(eq(sizes.id, input)))?.at(0);
}

/**
 * containersRouter
 *
 * A tRPC router for managing container sizes in the system. This router includes:
 * - Fetching all available sizes.
 * - Fetching a specific size by its ID.
 *
 * Procedures:
 * 1. **getSizes**:
 *    - Type: Query
 *    - Input: None
 *    - Output: An array of size objects matching the `sizes` schema.
 *    - Description: Fetches all container sizes from the database.
 *
 * 2. **getSizeFromId**:
 *    - Type: Query
 *    - Input: A numeric ID (z.number()) representing the size.
 *    - Output: A single size object matching the `sizes` schema.
 *    - Description: Fetches a specific container size based on its ID.
 * 
 */

export const containersRouter = createTRPCRouter({
  getSizes: publicProcedure.output(z.array(sizeOutputSchema)).query(() => {
    return db.select().from(sizes);
  }),

  getSizeFromId: publicProcedure
    .input(z.number())
    .output(sizeOutputSchema)
    .query(async ({ input }) => {
      return (await getSize(input))!;
    }),
});
