import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { employees } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

async function getOneEmployee(input: number) {
  console.log("getOneEmployee", input);
  return (await db.select().from(employees).where(eq(employees.id, input)))?.at(
    0,
  );
}

const outputSchema = createSelectSchema(employees);
const insertSchema = createInsertSchema(employees);
const updateSchema = z.object({
  ...insertSchema.partial().shape,
  id: z.number(),
});

export const employeesRouter = createTRPCRouter({
  getEmployeeById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneEmployee(input))!;
    }),

  getAllEmployees: publicProcedure.output(z.array(outputSchema)).query(() => {
    return db.select().from(employees);
  }),

  getEmployeesByIds: publicProcedure
    .input(z.array(z.number()))
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      console.log("running getOneEmployee Query", input.length);
      if (input.length == 0) {
        return [];
      }
      return Promise.all(
        input.map(async (id) => {
          console.log(id);
          return (await getOneEmployee(id))!;
        }),
      );
    }),

  getEmployeesByRole: publicProcedure
    .input(z.string())
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      return db
        .select()
        .from(employees)
        .where(eq(employees.role, input.toUpperCase()));
    }),

  addEmployee: publicProcedure
    .input(insertSchema)
    .mutation(async ({ input }) => {
      return db.insert(employees).values(input);
    }),

  updateEmployee: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      return db.update(employees).set(input).where(eq(employees.id, input.id));
    }),

  deleteEmployee: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(employees).where(eq(employees.id, input));
    }),
});
