"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

// Define the type for an appetizer item
interface Appetizer {
  id: number;
  name: string;
  type: string;
}

export default function SidesPage({
  category,
  setSelectedCategory,
  addComboToCart,
}: {
  category: string;
  setSelectedCategory: (category: string | null) => void;
  addComboToCart: (comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void;
}) {
  const router = useRouter();

  // Fetch appetizers using tRPC and type the response correctly
  const { data: appetizers, isLoading, error } = api.menu.getMenuItemsByType.useQuery<Appetizer[]>("SIDE");

  // State to track the quantities of selected items
  const [selectedAppetizers, setSelectedAppetizers] = useState<
    Record<string, { id: number; name: string; quantity: number }>
  >({});

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if appetizers is undefined before trying to map over it
  if (!appetizers) {
    return <div>No sides available.</div>;
  }

  // Increment item quantity
  const incrementItem = (item: Appetizer) => {
    setSelectedAppetizers((prevSelectedAppetizers) => ({
      ...prevSelectedAppetizers,
      [item.name]: {
        ...prevSelectedAppetizers[item.name],
        id: item.id,
        name: item.name,
        quantity: (prevSelectedAppetizers[item.name]?.quantity ?? 0) + 1,
      },
    }));
  };

  // Decrement item quantity
  const decrementItem = (itemName: string) => {
    setSelectedAppetizers((prevSelectedAppetizers) => {
      const currentItem = prevSelectedAppetizers[itemName];
      if (!currentItem) return prevSelectedAppetizers;

      if (currentItem.quantity <= 1) {
        const { [itemName]: _, ...rest } = prevSelectedAppetizers; // Remove item from selectedAppetizers
        return rest;
      }

      return {
        ...prevSelectedAppetizers,
        [itemName]: {
          ...currentItem,
          quantity: currentItem.quantity - 1,
        },
      };
    });
  };

  // Calculate total appetizers in selectedAppetizers
  const totalAppetizers = Object.values(selectedAppetizers).reduce((sum, item) => sum + item.quantity, 0);

  // Placeholder function to handle order submission
  const handleSubmitOrder = () => {
    const orderList = Object.values(selectedAppetizers).map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    }));

    // Iterate through each item and its quantity
    orderList.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addComboToCart("Item", { "Side": [{ id: item.id, name: item.name }] });
      }
    });

    setSelectedCategory(null);
    router.push("/Customer");
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Left section for appetizers */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Sides</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appetizers.map((item) => {
            const quantity = selectedAppetizers[item.name]?.quantity ?? 0;

            return (
              <div
                key={item.id}
                className="relative p-4 bg-[#d82c2c] text-white rounded-lg shadow-md hover:bg-[#ff474c] transition transform hover:scale-105"
              >
                {/* Item name */}
                <div className="text-lg font-semibold">{item.name}<br />$2.50</div>

                {/* Quantity controls */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition">
                  <button
                    onClick={() => decrementItem(item.name)}
                    className="px-3 py-1 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-800 text-white rounded-lg">{quantity}</span>
                  <button
                    onClick={() => incrementItem(item)}
                    className="px-3 py-1 bg-white text-black rounded-lg hover:bg-gray-200 transition"
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
        <h2 className="text-xl font-bold mb-4">Sides Selected</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold">Total Sides: {totalAppetizers}</p>
          <ul className="mt-4">
            {Object.values(selectedAppetizers).map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
          {/* Total price */}
          <div className='mt-4 text-xl font-bold mb-4'>
            Total Price: ${totalAppetizers*2.5}
          </div>
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
}
