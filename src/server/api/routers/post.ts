// TODO: Delete this file when we don't need to use it as an example

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { orders } from "~/server/db/schema";
import { db } from "~/server/db";
import { z } from "zod";

export const exampleRouter = createTRPCRouter({
  getAllOrders: publicProcedure.query(() => {
    // from here:
    // https://orm.drizzle.team/docs/data-querying
    return db.select().from(orders);
  }),

  addOrder: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input }) => {
      db.insert(orders).values({
        total: input.text,
        timestamp: new Date(),
        customerId: 1,
      });
    }),

  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),
  //
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),
  //
  // getLatest: publicProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  //
  //   return post ?? null;
  // }),
  //
  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
