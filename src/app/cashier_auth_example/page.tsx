import { api, HydrateClient } from "~/trpc/server";

export default async function CashierExamplePage() {
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <h1>Just a wagie...</h1>
    </HydrateClient>
  );
}
