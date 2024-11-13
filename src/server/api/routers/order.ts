import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";


const orderSchema = z.object({
    total: z.number(),
    customerId: z.number()
})

export const orderRouter = createTRPCRouter({
    insert: publicProcedure.input(orderSchema).mutation(async ({input}) => {

    }

})
