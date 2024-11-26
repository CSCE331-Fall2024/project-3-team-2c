"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

// Define the type for a drink item
interface Drink {
  id: number;
  name: string;
  type: string;
}

const DrinksPage: React.FC = () => {
  // Fetch drinks using tRPC and type the response correctly
  const { data: drinks, isLoading, error } = api.menu.getMenuItemsByType.useQuery<Drink[]>("drink");

  // State to track the quantities of selected items
  const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>({});

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!drinks) {
    return <div>No drinks available.</div>;
  }

  // Increment item quantity
  const incrementItem = (itemName: string) => {
    setSelectedDrinks((prevSelectedDrinks) => ({
      ...prevSelectedDrinks,
      [itemName]: (prevSelectedDrinks[itemName] ?? 0) + 1,
    }));
  };

  // Decrement item quantity
  const decrementItem = (itemName: string) => {
    setSelectedDrinks((prevSelectedDrinks) => {
      const currentCount = prevSelectedDrinks[itemName] ?? 0;
      if (currentCount <= 1) {
        const { [itemName]: _, ...rest } = prevSelectedDrinks; // Remove item from selectedDrinks
        return rest;
      }
      return {
        ...prevSelectedDrinks,
        [itemName]: currentCount - 1,
      };
    });
  };

  // Calculate total drinks in selectedDrinks
  const totalDrinks = Object.values(selectedDrinks).reduce((sum, count) => sum + count, 0);

  // Placeholder function to handle order submission
  const handleSubmitOrder = () => {
    // Create a list of selected items with their quantities for submission
    const orderList = Object.entries(selectedDrinks).map(([itemName, quantity]) => ({
      name: itemName,
      quantity,
    }));

    // For now, just log the order list
    console.log("Order submitted:", orderList);
  };

  return (
    <div className="flex">
      {/* Left section for drinks */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Drinks</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drinks.map((item) => {
            const quantity = selectedDrinks[item.name] ?? 0;

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
        <h2 className="text-xl font-bold mb-4">Drinks Selected</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold">Total Drinks: {totalDrinks}</p>
          <ul className="mt-4">
            {Object.entries(selectedDrinks).map(([itemName, quantity]) => (
              <li key={itemName} className="flex justify-between">
                <span>{itemName}</span>
                <span>{quantity}</span>
              </li>
            ))}
          </ul>

          {/* Submit Order Button */}
          <button
            onClick={handleSubmitOrder}
            className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrinksPage;
