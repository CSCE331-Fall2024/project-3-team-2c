import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { employees } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


/**
 * getOneEmployee
 *
 * Fetches a single employee from the database based on their ID.
 *
 * @param input - The ID of the employee to retrieve.
 * @returns The employee matching the provided ID, or `undefined` if no match is found.
 *
 */

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

  /**
 * getEmployeeById
 *
 * A public procedure to fetch a single employee based on their ID.
 *
 * @input {number} - The ID of the employee to retrieve.
 * @output {outputSchema} - The schema representing the returned employee.
 * @returns The employee matching the provided ID.
 */
  getEmployeeById: publicProcedure
    .input(z.number())
    .output(outputSchema)
    .query(async ({ input }) => {
      return (await getOneEmployee(input))!;
    }),

    /**
 * getAllEmployees
 *
 * A public procedure to fetch all employees from the database.
 *
 * @output {Array<outputSchema>} - An array of all employees.
 * @returns All employees in the database.
 */
  getAllEmployees: publicProcedure.output(z.array(outputSchema)).query(() => {
    return db.select().from(employees);
  }),

  /**
 * getEmployeesByIds
 *
 * A public procedure to fetch multiple employees by their IDs.
 *
 * @input {Array<number>} - An array of employee IDs to retrieve.
 * @output {Array<outputSchema>} - An array of employees matching the provided IDs.
 * @returns The employees corresponding to the provided IDs.
 */
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

    /**
 * getEmployeesByRole
 *
 * A public procedure to fetch employees based on their role.
 *
 * @input {string} - The role of employees to retrieve.
 * @output {Array<outputSchema>} - An array of employees matching the provided role.
 * @returns The employees with the specified role.
 */
  getEmployeesByRole: publicProcedure
    .input(z.string())
    .output(z.array(outputSchema))
    .query(async ({ input }) => {
      return db
        .select()
        .from(employees)
        .where(eq(employees.role, input.toUpperCase()));
    }),

    /**
 * addEmployee
 *
 * A public procedure to add a new employee to the database.
 *
 * @input {insertSchema} - The schema representing the data to insert.
 * @returns The result of the insert operation.
 */
  addEmployee: publicProcedure
    .input(insertSchema)
    .mutation(async ({ input }) => {
      return db.insert(employees).values(input);
    }),

    /**
 * updateEmployee
 *
 * A public procedure to update an existing employee in the database.
 *
 * @input {updateSchema} - The schema representing the updated data, including the employee ID.
 * @returns The result of the update operation.
 */
  updateEmployee: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      return db.update(employees).set(input).where(eq(employees.id, input.id));
    }),

    /**
 * deleteEmployee
 *
 * A public procedure to delete an employee from the database based on their ID.
 *
 * @input {number} - The ID of the employee to delete.
 * @returns The result of the delete operation.
 */
  deleteEmployee: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(employees).where(eq(employees.id, input));
    }),
});
