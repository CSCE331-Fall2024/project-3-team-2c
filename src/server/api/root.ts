import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { ordersRouter } from "~/server/api/routers/orders";
import { menuRouter } from "~/server/api/routers/menu";
import { employeesRouter } from "~/server/api/routers/employees";
import { containersRouter } from "~/server/api/routers/containers";
import { disposableItemsRouter } from "~/server/api/routers/disposable_items";
import { ingredientsRouter } from "~/server/api/routers/ingredients";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  orders: ordersRouter,
  menu: menuRouter,
  containers: containersRouter,
  employees: employeesRouter,
  disposable: disposableItemsRouter,
  ingredients: ingredientsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
