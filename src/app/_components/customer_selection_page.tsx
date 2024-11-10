// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "~/components/ui/sidebar";

// const steps: string[] = ["Side", "Entree", "Drinks", "Appetizers"];

// const getSelectionLimits = (category: string): Record<string, number> => {
//   switch (category) {
//     case "bowl":
//       return {
//         Side: 1,
//         Entree: 1,
//         Drinks: 1,
//         Appetizers: 1,
//       };
//     case "plate":
//       return {
//         Side: 1,
//         Entree: 2,
//         Drinks: 1,
//         Appetizers: 1,
//       };
//     case "biggerPlate":
//       return {
//         Side: 1,
//         Entree: 3,
//         Drinks: 1,
//         Appetizers: 1,
//       };
//     default:
//       return {
//         Side: 1,
//         Entree: 1,
//         Drinks: 1,
//         Appetizers: 1,
//       };
//   }
// };

// export default function SelectionPage({
//   category,
//   setSelectedCategory,
// }: {
//   category: string;
//   setSelectedCategory: (category: string | null) => void;
// }) {
//   const router = useRouter();

//   const [currentStep, setCurrentStep] = useState<number>(0);
//   const [selections, setSelections] = useState<Record<string, string[]>>({});
//   const [selectedItem, setSelectedItem] = useState<string | null>(null); // New state to track selected item

//   const handleNext = () => {
//     console.log(selections);
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     } else {
//       setSelectedCategory(null);
//       router.push("/Customer");
//     }
//   };

//   const handleSelection = (item: string) => {
//     const stepName = steps[currentStep];
//     const limits = getSelectionLimits(category);
//     const limit = limits[stepName];
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       [stepName]: item,
//     }));
//     setSelectedItem(item); // Set the selected item
//   };

//   return (
//     <div className="flex h-full">
//       {/* Sidebar */}
//       <SidebarProvider>
//         <OrderSidebar
//           currentStep={currentStep}
//           handleBack={handleBack}
//           selections={selections}
//           category={category}
//         />
//         <SidebarTrigger />
//         {/* Main content area */}
//         <div className="flex-1 p-10">
//           <h1 className="text-2xl font-bold mb-6">{steps[currentStep]} Options</h1>
//           <div className="grid grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, index) => {
//               const itemName = `${steps[currentStep]} Item ${index + 1}`;
//               return (
//                 <div
//                   key={index}
//                   className={`p-5 bg-blue-200 rounded-lg cursor-pointer hover:bg-blue-300 transition ${
//                     selectedItem === itemName ? "bg-blue-400" : ""
//                   }`} // Apply highlight class if selected
//                   onClick={() => handleSelection(itemName)}
//                 >
//                   {itemName}
//                 </div>
//               );
//             })}
//           </div>
//           <button
//             onClick={handleNext}
//             className="mt-6 bg-green-500 text-white p-3 rounded-lg"
//             disabled={currentStep === steps.length - 1}
//           >
//             Next
//           </button>
//         </div>
//       </SidebarProvider>
//     </div>
//   );
// }

// function OrderSidebar({
//   currentStep,
//   handleBack,
//   selections,
//   category,
// }: {
//   currentStep: number;
//   handleBack: () => void;
//   selections: Record<string, string[]>;
//   category: string;
// }) {
//   return (
//     <Sidebar className="w-64 bg-gray-200 p-4 flex flex-col ">
//       <button onClick={handleBack} className="bg-blue-500 text-white p-2 rounded mb-4">
//         Back
//       </button>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>{category}</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {steps.map((step, index) => (
//                 <SidebarMenuItem
//                   key={step}
//                   className={`p-2 ${index === currentStep ? "font-bold" : ""}`}
//                 >
//                   <SidebarMenuButton asChild>
//                     <a>
//                       <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
//                       {selections[step] && (
//                         <div className="text-sm text-gray-600">{selections[step]}</div>
//                       )}
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

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

const steps: string[] = ["Side", "Entree", "Drinks", "Appetizers"];

const getSelectionLimits = (category: string): Record<string, number> => {
  switch (category) {
    case "bowl":
      return {
        Side: 1,
        Entree: 1,
        Drinks: 1,
        Appetizers: 1,
      };
    case "plate":
      return {
        Side: 1,
        Entree: 2,
        Drinks: 1,
        Appetizers: 1,
      };
    case "biggerPlate":
      return {
        Side: 1,
        Entree: 3,
        Drinks: 1,
        Appetizers: 1,
      };
    default:
      return {
        Side: 1,
        Entree: 1,
        Drinks: 1,
        Appetizers: 1,
      };
  }
};

export default function SelectionPage({
  category,
  setSelectedCategory,
}: {
  category: string;
  setSelectedCategory: (category: string | null) => void;
}) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({}); // Track selected items for each step

  const limits = getSelectionLimits(category);
  const limit = limits[steps[currentStep]];

  const handleNext = () => {
    const stepName = steps[currentStep];
    setSelections(() => ({
      ...selections,
      [stepName]: selectedItems[stepName],
    }));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setSelectedCategory(null);
      router.push("/Customer");
    }
  };

  const handleSelection = (item: string) => {
    const stepName = steps[currentStep];

    // Get the current selections for this step
    const currentSelections = selectedItems[stepName] || [];

    if (limit == 1) {
      setSelectedItems((prev) => ({
        ...prev,
        [stepName]: [item],
      }));
    } else if (currentSelections.includes(item)) {
      // Deselect the item if it was already selected
      setSelectedItems((prev) => ({
        ...prev,
        [stepName]: currentSelections.filter((selected) => selected !== item),
      }));
    } else if (currentSelections.length < limit) {
      // Allow selection if the limit is not reached
      setSelectedItems((prev) => ({
        ...prev,
        [stepName]: [...currentSelections, item],
      }));
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <SidebarProvider>
        <OrderSidebar
          currentStep={currentStep}
          handleBack={handleBack}
          selections={selections}
          category={category}
        />
        <SidebarTrigger />
        {/* Main content area */}
        <div className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-6">{steps[currentStep]} Options (Select {limit})</h1>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => {
              const itemName = `${steps[currentStep]} Item ${index + 1}`;
              const isSelected = selectedItems[steps[currentStep]]?.includes(itemName);

              return (
                <div
                  key={index}
                  className={`p-5 bg-blue-200 rounded-lg cursor-pointer hover:bg-blue-300 transition ${
                    isSelected ? "bg-blue-400" : ""
                  }`} // Apply highlight class if selected
                  onClick={() => handleSelection(itemName)}
                >
                  {itemName}
                </div>
              );
            })}
          </div>
          <button
            onClick={handleNext}
            className="mt-6 bg-green-500 text-white p-3 rounded-lg"
            disabled={currentStep === steps.length - 1}
          >
            Next
          </button>
        </div>
      </SidebarProvider>
    </div>
  );
}

function OrderSidebar({
  currentStep,
  handleBack,
  selections,
  category,
}: {
  currentStep: number;
  handleBack: () => void;
  selections: Record<string, string[]>;
  category: string;
}) {
  return (
    <Sidebar className="w-64 bg-gray-200 p-4 flex flex-col ">
      <button onClick={handleBack} className="bg-blue-500 text-white p-2 rounded mb-4">
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
                  className={`p-2 ${index === currentStep ? "font-bold" : ""}`} // flex-col to stack items vertically
                >
                  <SidebarMenuButton asChild>
                    <a className="flex flex-col justify-start">
                      <span className="text-lg font-semibold text-black">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                      <div className="text-sm text-gray-600">
                        {selections[step]?.map((item, i) => (
                          <div key={i}>{item}</div>
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