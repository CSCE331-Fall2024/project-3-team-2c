import "src/styles/globals.css";
import type { Metadata } from "next";
import TranslatePage from "./_components/TranslatePage";
import { LanguageProvider } from "~/context/LanguageContext";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "BambooPOS",
  description: "This is an example POS System for Panda Express",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <TRPCReactProvider>
            <TranslatePage />
            {children}
          </TRPCReactProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
