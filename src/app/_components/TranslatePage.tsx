"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "~/context/LanguageContext";


/**
 * TranslatePage Component
 * 
 * This component dynamically translates the text content of the entire webpage
 * based on the selected language.
 * 
 * - Detects changes in the selected language or the current page pathname.
 * - Extracts all visible text nodes from the page using a recursive function.
 * - Sends the text content to a translation API for translation.
 * - Replaces the text content on the page with the translated text.
 *
 * @returns {null} This component does not render any visible UI.
 */
export default function TranslatePage() {
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
