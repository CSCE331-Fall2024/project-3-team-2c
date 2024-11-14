// import "src/styles/globals.css";
// import { TRPCReactProvider } from "~/trpc/react"; // Import Tailwind CSS

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">
//       <body>
//         <TRPCReactProvider>{children}</TRPCReactProvider>
//       </body>
//     </html>
//   );
// }

"use client";

import "src/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "~/context/LanguageContext";

function TranslatePage() {
  const { selectedLanguage } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const translatePageText = async () => {
      if (selectedLanguage === "en") return;

      const getTextNodes = (node: Node, textNodes: Text[] = []) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          textNodes.push(node as Text);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.childNodes.forEach((child) => getTextNodes(child, textNodes));
        }
        return textNodes;
      };

      const textNodes = getTextNodes(document.body);
      const originalText = textNodes.map((node) => node.textContent ?? "");

      try {
        const translatedTexts = await Promise.all(
          originalText.map(async (text) => {
            const response = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text,
                target: selectedLanguage,
              }),
            });
            const data = (await response.json()) as { translatedText: string };
            return data.translatedText;
          }),
        );

        textNodes.forEach((node, index) => {
          node.textContent = translatedTexts[index] ?? null;
        });
      } catch (error) {
        console.error("Error translating text:", error);
      }
    };

    translatePageText().catch((error) =>
      console.error("Error translating page:", error),
    );
  }, [pathname, selectedLanguage]);

  return null;
}

export default function RootLayout({ children }: { children: ReactNode }) {
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
