"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

const EntreesPage: React.FC = () => {
  // Fetch all menu items using tRPC
  // State to track selected items
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data, isLoading, error } = api.menu.getAllMenuItems.useQuery();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Handle item selection
  const handleSelection = (itemName: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemName)
        ? prevSelected.filter((item) => item !== itemName)
        : [...prevSelected, itemName]
    );
  };

  // Filter the data to include only entrees
  const entrees = data?.filter((item) => item.type === "ENTREE") ?? [];

  return (
    <div className="entrees-page">
      <h1 className="text-2xl font-bold mb-4">Entrees</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entrees.map((item) => {
          const isSelected = selectedItems.includes(item.name);

          return (
            <div
              key={item.id}
              className={`p-5 bg-[#d82c2c] text-white rounded-lg cursor-pointer hover:bg-[#ff474c] transition ${
                isSelected ? "bg-[#ff474c]" : ""
              }`}
              onClick={() => handleSelection(item.name)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntreesPage;
