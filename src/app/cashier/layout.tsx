import "~/styles/globals.css";
import { auth, signIn } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function CashierAuthExampleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    await signIn();
  }

  if (session?.user?.role !== "cashier" && session?.user?.role !== "manager") {
    redirect("/");
  }

  return <div>{children}</div>;
}
