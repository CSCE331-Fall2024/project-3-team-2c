import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function ManagerAuthExampleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  if (session?.user?.role !== "manager") {
    redirect("/");
  }

  return <div>{children}</div>;
}
