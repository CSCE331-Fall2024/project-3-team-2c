import {
  // api,
  HydrateClient,
} from "~/trpc/server";

export default async function ManagerExamplePage() {
  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <h1>I AM THE MANAGER!!</h1>
    </HydrateClient>
  );
}
