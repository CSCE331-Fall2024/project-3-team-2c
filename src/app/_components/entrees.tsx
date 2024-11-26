"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

const EntreesPage: React.FC = () => {
  // Fetch all menu items using tRPC
  const { data, isLoading, error } = api.menu.getAllMenuItems.useQuery();

  // State to track the quantities of selected items
  const [selectedEntrees, setSelectedEntrees] = useState<Record<string, number>>({});

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Filter the data to include only entrees
  const entrees = data?.filter((item) => item.type === "ENTREE") ?? [];

  // Increment item quantity
  const incrementItem = (itemName: string) => {
    setSelectedEntrees((prevSelectedEntrees) => ({
      ...prevSelectedEntrees,
      [itemName]: (prevSelectedEntrees[itemName] ?? 0) + 1,
    }));
  };

  // Decrement item quantity
  const decrementItem = (itemName: string) => {
    setSelectedEntrees((prevSelectedEntrees) => {
      const currentCount = prevSelectedEntrees[itemName] ?? 0;
      if (currentCount <= 1) {
        const { [itemName]: _, ...rest } = prevSelectedEntrees; // Remove item from selectedEntrees
        return rest;
      }
      return {
        ...prevSelectedEntrees,
        [itemName]: currentCount - 1,
      };
    });
  };

  // Calculate total entrees in selectedEntrees
  const totalEntrees = Object.values(selectedEntrees).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex">
      {/* Left section for entrees */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Entrees</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entrees.map((item) => {
            const quantity = selectedEntrees[item.name]?? 0;

            return (
              <div
                key={item.id}
                className="relative p-5 bg-[#d82c2c] text-white rounded-lg cursor-pointer hover:bg-[#ff474c] transition"
              >
                {/* Item name */}
                <div className="text-lg font-semibold">{item.name}</div>

                {/* Quantity controls */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition">
                  <button
                    onClick={() => decrementItem(item.name)}
                    className="px-3 py-1 bg-white text-black rounded-lg"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-800 text-white rounded-lg">{quantity}</span>
                  <button
                    onClick={() => incrementItem(item.name)}
                    className="px-3 py-1 bg-white text-black rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right section for cart summary */}
      <div className="w-1/4 pl-4">
        <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold">Total Entrees: {totalEntrees}</p>
          <ul className="mt-4">
            {Object.entries(selectedEntrees).map(([itemName, quantity]) => (
              <li key={itemName} className="flex justify-between">
                <span>{itemName}</span>
                <span>{quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntreesPage;
