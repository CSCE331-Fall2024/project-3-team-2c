"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

/**
 * LanguageProvider is a React context provider that manages the application's selected language state.
 * It allows child components to access and update the current language.
 * 
 * @param {ReactNode} children - The child components wrapped by the LanguageProvider.
 * 
 * @returns {JSX.Element} - A context provider that shares language state with its children.
 * 
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage is a custom hook for accessing the LanguageContext.
 * It provides the current selected language and a function to update it.
 * 
 * @throws {Error} If used outside of a LanguageProvider.
 * 
 * @returns {Object} - An object containing `selectedLanguage` and `setSelectedLanguage`.
 * 
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
