"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface Drink {
  id: number;
  name: string;
  type: string;
}

/**
 * DrinksPage Component
 * 
 * This component renders a page where users can select drinks from a list. It fetches available drinks
 * from the backend using tRPC, allows users to increment or decrement the quantity of each drink,
 * and manages the state of selected drinks. The component also calculates the total number of drinks
 * selected and the corresponding total price. Upon submission, it adds the selected drinks to the cart
 * and navigates the user to the appropriate page based on their role.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.category - The category of items being selected.
 * @param {string} props.user - The role of the user (e.g., "customer", "cashier").
 * @param {(category: string | null) => void} props.setSelectedCategory - Function to set or clear the selected category.
 * @param {(comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void} props.addComboToCart - Function to add the selected combo to the cart.
 * @returns {JSX.Element} The rendered DrinksPage component.
 */
export default function DrinksPage({
  category,
  setSelectedCategory,
  addComboToCart,
}: {
  category: string;
  setSelectedCategory: (category: string | null) => void;
  addComboToCart: (comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void;
}) {
  const router = useRouter();
  const { data: drinks, isLoading, error } = api.menu.getMenuItemsByType.useQuery<Drink[]>("drink");
  const [selectedDrinks, setSelectedDrinks] = useState<
    Record<string, { id: number; name: string; quantity: number }>
  >({});

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!drinks) return <div>No drinks available.</div>;

  const incrementItem = (item: Drink) => {
    setSelectedDrinks((prev) => ({
      ...prev,
      [item.name]: {
        ...prev[item.name],
        id: item.id,
        name: item.name,
        quantity: (prev[item.name]?.quantity ?? 0) + 1,
      },
    }));
  };

  const decrementItem = (itemName: string) => {
    setSelectedDrinks((prev) => {
      const currentItem = prev[itemName];
      if (!currentItem) return prev;

      if (currentItem.quantity <= 1) {
        const { [itemName]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [itemName]: { ...currentItem, quantity: currentItem.quantity - 1 },
      };
    });
  };

  const totalDrinks = Object.values(selectedDrinks).reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = () => {
    const orderList = Object.values(selectedDrinks).map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    }));

    orderList.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addComboToCart("Item", { Drink: [{ id: item.id, name: item.name }] });
      }
    });

    setSelectedCategory(null);
    router.push("/Customer");
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Left Section: Drinks List */}
      <div className="w-full md:w-3/4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Drinks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drinks.map((item) => {
            const quantity = selectedDrinks[item.name]?.quantity ?? 0;

            return (
              <div
                key={item.id}
                className="relative p-4 bg-[#d82c2c] text-white rounded-lg shadow-md hover:bg-[#ff474c] transition transform hover:scale-105"
              >
                <div className="text-lg font-semibold">{item.name}<br />$2.50</div>
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

      {/* Right Section: Cart Summary */}
      <div className="w-full md:w-1/4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Drinks Selected</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold">Total Drinks: {totalDrinks}</p>
          <ul className="mt-4">
            {Object.values(selectedDrinks).map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xl font-bold">
            Total Price: ${totalDrinks * 2.5}
          </div>
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
