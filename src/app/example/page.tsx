import { api, HydrateClient } from "~/trpc/server";
export default async function ExamplePage() {
  // Do this when using a server component:
  const data = await api.example.getAllOrders();

  return (
    <HydrateClient>
      <h1>Just a wagie...</h1>
      <p>
        {/* This won't display anything because there's nothing in the table */}
        {data.map((input) => {
          return (
            input.total +
            " " +
            input.timestamp?.toString() +
            " " +
            input.customerId +
            " " +
            input.id
          );
        })}
      </p>
    </HydrateClient>
  );
}
