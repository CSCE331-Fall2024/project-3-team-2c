import "src/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react"; // Import Tailwind CSS

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
