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
  SidebarTrigger
} from "~/components/ui/sidebar"

const steps = ["Side", "Entree", "Drinks", "Appetizers"];

export default function SelectionPage({ category, setSelectedCategory }: { category: string, setSelectedCategory: (category: string | null) => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setSelectedCategory(null);
      router.push('/Customer');
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <SidebarProvider>
        <OrderSidebar 
          currentStep={currentStep} 
          handleBack={handleBack} 
        />
        <SidebarTrigger />
        {/* Main content area */}
        <div className="flex-1 p-10 ml-64"> {/* ml-64 makes space for the sidebar */}
          <h1 className="text-2xl font-bold mb-6">{steps[currentStep]} Options</h1>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-5 bg-blue-200 rounded-lg cursor-pointer hover:bg-blue-300 transition"
              >
                {steps[currentStep]} Item {index + 1}
              </div>
            ))}
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
  }: {
    currentStep: number;
    handleBack: () => void;
  }) {
  return (
    <Sidebar className="w-64 bg-gray-200 p-4 flex flex-col ">
      <button onClick={handleBack} className="bg-blue-500 text-white p-2 rounded mb-4">Back</button>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Current Combo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {steps.map((step, index) => (
                <SidebarMenuItem 
                  key={step}
                  className={`p-2 ${index === currentStep ? "font-bold" : ""}`}
                >
                  <SidebarMenuButton asChild>
                    <a> 
                      <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
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
