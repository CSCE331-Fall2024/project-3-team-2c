"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

// Define the type for an entree item
interface Entree {
  id: number;
  name: string;
  type: string;
}

export default function EntreesPage({
  category,
  setSelectedCategory,
  addComboToCart,
}: {
  category: string;
  setSelectedCategory: (category: string | null) => void;
  addComboToCart: (comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void;
}) {
  const router = useRouter();

  // Fetch entrees using tRPC and type the response correctly
  const { data: entrees, isLoading, error } = api.menu.getMenuItemsByType.useQuery<Entree[]>("entree");

  // State to track the quantities of selected items
  const [selectedEntrees, setSelectedEntrees] = useState<
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

  // Check if entrees is undefined before trying to map over it
  if (!entrees) {
    return <div>No entrees available.</div>; // You can handle it in any way you'd prefer
  }

  // Increment item quantity
  const incrementItem = (item: Entree) => {
    setSelectedEntrees((prevSelectedEntrees) => ({
      ...prevSelectedEntrees,
      [item.name]: {
        ...prevSelectedEntrees[item.name],
        id: item.id,
        name: item.name,
        quantity: (prevSelectedEntrees[item.name]?.quantity ?? 0) + 1,
      },
    }));
  };

  // Decrement item quantity
  const decrementItem = (itemName: string) => {
    setSelectedEntrees((prevSelectedEntrees) => {
      const currentItem = prevSelectedEntrees[itemName];
      if (!currentItem) return prevSelectedEntrees;

      if (currentItem.quantity <= 1) {
        const { [itemName]: _, ...rest } = prevSelectedEntrees; // Remove item from selectedEntrees
        return rest;
      }

      return {
        ...prevSelectedEntrees,
        [itemName]: {
          ...currentItem,
          quantity: currentItem.quantity - 1,
        },
      };
    });
  };

  // Calculate total entrees in selectedEntrees
  const totalEntrees = Object.values(selectedEntrees).reduce((sum, item) => sum + item.quantity, 0);

  // Placeholder function to handle order submission
  const handleSubmitOrder = () => {
    const orderList = Object.values(selectedEntrees).map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    }));

    // Iterate through each item and its quantity
    orderList.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        // Call the addComboToCart function for each iteration
        addComboToCart("Item", { "Entree": [{ id: item.id, name: item.name }] });
      }
    });

    setSelectedCategory(null);
    router.push("/Customer");
  };

  return (
    <div className="flex">
      {/* Left section for entrees */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Entrees</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entrees.map((item) => {
            const quantity = selectedEntrees[item.name]?.quantity ?? 0;

            return (
              <div
                key={item.id}
                className="relative p-5 bg-[#d82c2c] text-white rounded-lg cursor-pointer hover:bg-[#ff474c] transition"
              >
                {/* Item name */}
                <div className="text-lg font-semibold">{item.name}<br />$2.50</div>

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
                    onClick={() => incrementItem(item)}
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
        <h2 className="text-xl font-bold mb-4">Entrees Selected</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold">Total Entrees: {totalEntrees}</p>
          <ul className="mt-4">
            {Object.values(selectedEntrees).map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
          {/* Total price */}
          <div className='mt-4 text-xl font-bold mb-4'>
            Total Price: ${totalEntrees*2.5}
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
