import React, { useState } from "react";
import { useRouter } from "next/router";

const steps = ["side", "entree", "drinks", "appetizers"];

export default function SelectionPage({ category }: { category: string }) {
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
      router.back(); // Go back to previous page
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-4 flex flex-col">
        <button onClick={handleBack} className="bg-blue-500 text-white p-2 rounded mb-4">Back</button>
        <ul>
          {steps.map((step, index) => (
            <li key={step} className={`p-2 ${index === currentStep ? "font-bold" : ""}`}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-10">
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
    </div>
  );
}
