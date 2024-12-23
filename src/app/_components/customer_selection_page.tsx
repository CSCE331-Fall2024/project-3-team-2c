"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { api } from "~/trpc/react";

const steps: string[] = ["Side", "Entree"];

interface Entree {
  id: number;
  name: string;
  type: string;
}

interface Side {
  id: number;
  name: string;
  type: string;
}

const getSelectionLimits = (category: string): Record<string, number> => {
  switch (category) {
    case "bowl":
      return {
        Side: 1,
        Entree: 1
      };
    case "plate":
      return {
        Side: 1,
        Entree: 2
      };
    case "biggerPlate":
      return {
        Side: 1,
        Entree: 3
      };
    default:
      return {
        Side: 1,
        Entree: 1
      };
  }
};


/**
 * SelectionPage Component
 * 
 * This component manages the selection process for different categories (e.g., Entrees, Sides)
 * within the application. It handles user interactions through multiple steps, ensuring that
 * users select the required number of items per category before proceeding. Upon completion,
 * it formats the selections and adds them to the cart.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.category - The current category being selected (e.g., "Entree", "Side").
 * @param {string} props.user - The role of the user (e.g., "customer", "cashier").
 * @param {(category: string | null) => void} props.setSelectedCategory - Function to set or clear the selected category.
 * @param {(comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void} props.addComboToCart - Function to add the selected combo to the cart.
 * @returns {JSX.Element} The rendered SelectionPage component.
 */
export default function SelectionPage({
  category,
  user,
  setSelectedCategory,
  addComboToCart,
}: {
  category: string;
  user: string;
  setSelectedCategory: (category: string | null) => void;
  addComboToCart: (comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void;
}) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, { id: number; name: string }[]>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, { id: number; name: string }[]>>({});  

  const entrees = api.menu.getMenuItemsByType.useQuery<Entree[]>("entree");
  const sides = api.menu.getMenuItemsByType.useQuery<Side[]>("side");
  const entreesData = entrees.data!;
  const sidesData = sides.data!;

  const limits = getSelectionLimits(category);
  const limit = limits[steps[currentStep]!];

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNext = () => {
    const stepName = steps[currentStep]!;
    const currentSelections = selectedItems[stepName] ?? [];

    // Validation: Ensure the number of selected items matches the limit
    if (currentSelections.length !== limit) {
      setErrorMessage(`Please select exactly ${limit} ${stepName}(s) before proceeding.`);
      return;
    }

    setErrorMessage(""); // Clear error if validation passes

    setSelections((prev) => ({
      ...prev,
      [stepName]: currentSelections,
    }));

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const finalSelections = { ...selections };

      steps.forEach((step) => {
        if (!finalSelections[step]) {
          finalSelections[step] = selectedItems[step] ?? [];
        }
      });

      // Pass finalSelections to addComboToCart
      const formattedSelections = Object.fromEntries(
        Object.entries(finalSelections).map(([key, value]) => [
          key,
          value.map((item) => ({ id: item.id, name: item.name })),
        ])
      );

      addComboToCart(category, formattedSelections);
      setSelectedCategory(null);
      if (user.toLowerCase() == "customer") {
        router.push("/Customer");
      } else if (user.toLowerCase() == "cashier") {
        router.push("/cashier");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setSelectedCategory(null);
      if (user.toLowerCase() == "customer") {
        router.push("/Customer");
      } else if (user.toLowerCase() == "cashier") {
        router.push("/cashier");
      }
    }
  };

  const handleSelection = (item: { id: number; name: string }) => {
    const stepName = steps[currentStep];
    const currentSelections = selectedItems[stepName!] ?? [];
  
    const itemExists = currentSelections.some((selected) => selected.id === item.id);
  
    if (limit === 1) {
      setSelectedItems((prev) => ({
        ...prev,
        [stepName!]: [item], // Only allow one selection
      }));
    } else if (itemExists) {
      setSelectedItems((prev) => ({
        ...prev,
        [stepName!]: currentSelections.filter((selected) => selected.id !== item.id), // Remove the item
      }));
    } else if (currentSelections.length < limit!) {
      setSelectedItems((prev) => ({
        ...prev,
        [stepName!]: [...currentSelections, item], // Add the item
      }));
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    const stepName = steps[currentStep]!;
    const currentSelections = selectedItems[stepName] ?? [];
  
    // Validation: Ensure the number of selected items matches the limit
    if (currentSelections.length !== limit) {
      setErrorMessage(`Please select exactly ${limit} ${stepName}(s) before switching steps.`);
      return;
    }
  
    setErrorMessage(""); // Clear error if validation passes
    setCurrentStep(stepIndex);
  };
  

  const renderItems = () => {
    let data: (Entree | Side)[] = [];
  
    if (steps[currentStep] === "Entree") {
      data = entreesData || [];
    } else if (steps[currentStep] === "Side") {
      data = sidesData || [];
    }
  
    return data.map((item) => {
      const currentStepName = steps[currentStep];
      const isSelected = currentStepName
        ? (selectedItems[currentStepName] ?? []).some((selected) => selected.id === item.id)
        : false;
  
      return (
        <div
          key={item.id}
          className={`p-5 bg-[#d82c2c] text-white rounded-lg cursor-pointer hover:bg-[#ff474c] transition ${
            isSelected ? "bg-[#ff474c]" : ""
          }`}
          onClick={() => handleSelection({ id: item.id, name: item.name })}
        >
          {item.name}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full">
      <SidebarProvider>
        <OrderSidebar
          currentStep={currentStep}
          selections={selections}
          category={category}
          handleBack={handleBack}
          handleStepSelect={handleStepSelect}
        />
        <SidebarTrigger />
        <div className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-6">
            {steps[currentStep]} Options (Select {limit})
          </h1>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className="grid grid-cols-3 gap-4">{renderItems()}</div>
          <button
            onClick={handleNext}
            className="mt-6 bg-[#d82c2c] text-white p-3 rounded-lg"
          >
            {currentStep === steps.length - 1 ? "Add to Cart" : "Next"}
          </button>
        </div>
      </SidebarProvider>
    </div>
  );
}


/**
 * OrderSidebar Component
 * 
 * This component renders a sidebar that displays the current step in the selection process,
 * along with the items selected for each step. It allows users to navigate between different
 * steps of the selection process and provides a "Back" button to return to the previous step
 * or exit the selection process. The sidebar visually indicates the active step and lists
 * the selected items for each step.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.currentStep - The index of the current step in the selection process.
 * @param {Record<string, { id: number; name: string }[]>} props.selections - An object containing the selected items for each step.
 * @param {string} props.category - The current category being selected (e.g., "Entree", "Side").
 * @param {() => void} props.handleBack - Function to handle the "Back" button click, navigating to the previous step or exiting.
 * @param {(index: number) => void} props.handleStepSelect - Function to handle direct navigation to a specific step based on its index.
 * @returns {JSX.Element} The rendered OrderSidebar component.
 */
function OrderSidebar({
  currentStep,
  selections,
  category,
  handleBack,
  handleStepSelect,
}: {
  currentStep: number;
  selections: Record<string, { id: number; name: string }[]>;
  category: string;
  handleBack: () => void;
  handleStepSelect: (index: number) => void;
}) {
  return (
    <Sidebar className="w-64 bg-gray-200 p-4 flex flex-col ">
      <button onClick={handleBack} className="bg-[#d82c2c] text-white p-2 rounded mb-4">
        Back
      </button>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{category}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {steps.map((step, index) => (
                <SidebarMenuItem
                  key={step}
                  className={`p-2 ${index === currentStep ? "bg-gray-200" : ""}`}
                  onClick={() => handleStepSelect(index)}
                >
                  <SidebarMenuButton asChild>
                    <a className="flex flex-col justify-start">
                      <span className="text-lg font-semibold text-black">
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </span>
                      <div className="text-sm text-gray-600">
                        {selections[step]?.map((item, i) => (
                          <div key={i}>{item.name}</div>
                        ))}
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
