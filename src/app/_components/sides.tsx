// "use client";

// import React, { useState } from "react";
// import { api } from "~/trpc/react";

// // Define the type for an appetizer item
// interface Appetizer {
//   id: number;
//   name: string;
//   type: string;
// }

// const AppetizersPage: React.FC = () => {
//   // Fetch appetizers using tRPC and type the response correctly
//   const { data: appetizers, isLoading, error } = api.menu.getMenuItemsByType.useQuery<Appetizer[]>("appetizer");

//   // State to track the quantities of selected items
//   const [selectedAppetizers, setSelectedAppetizers] = useState<Record<string, number>>({});

//   // Handle loading state
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   // Handle error state
//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   // Check if appetizers is undefined before trying to map over it
//   if (!appetizers) {
//     return <div>No appetizers available.</div>; // You can handle it in any way you'd prefer
//   }

//   // Increment item quantity
//   const incrementItem = (itemName: string) => {
//     setSelectedAppetizers((prevSelectedAppetizers) => ({
//       ...prevSelectedAppetizers,
//       [itemName]: (prevSelectedAppetizers[itemName] ?? 0) + 1,
//     }));
//   };

//   // Decrement item quantity
//   const decrementItem = (itemName: string) => {
//     setSelectedAppetizers((prevSelectedAppetizers) => {
//       const currentCount = prevSelectedAppetizers[itemName] ?? 0;
//       if (currentCount <= 1) {
//         const { [itemName]: _, ...rest } = prevSelectedAppetizers; // Remove item from selectedAppetizers
//         return rest;
//       }
//       return {
//         ...prevSelectedAppetizers,
//         [itemName]: currentCount - 1,
//       };
//     });
//   };

//   // Calculate total appetizers in selectedAppetizers
//   const totalAppetizers = Object.values(selectedAppetizers).reduce((sum, count) => sum + count, 0);

//   // Placeholder function to handle order submission
//   const handleSubmitOrder = () => {
//     // Create a list of selected items with their quantities for submission
//     const orderList = Object.entries(selectedAppetizers).map(([itemName, quantity]) => ({
//       name: itemName,
//       quantity,
//     }));

//     // For now, just log the order list
//     console.log("Order submitted:", orderList);
//   };

//   return (
//     <div className="flex">
//       {/* Left section for appetizers */}
//       <div className="w-3/4">
//         <h1 className="text-2xl font-bold mb-4">Appetizers</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {appetizers.map((item) => {
//             const quantity = selectedAppetizers[item.name] ?? 0;

//             return (
//               <div
//                 key={item.id}
//                 className="relative p-5 bg-[#d82c2c] text-white rounded-lg cursor-pointer hover:bg-[#ff474c] transition"
//               >
//                 {/* Item name */}
//                 <div className="text-lg font-semibold">{item.name}</div>

//                 {/* Quantity controls */}
//                 <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition">
//                   <button
//                     onClick={() => decrementItem(item.name)}
//                     className="px-3 py-1 bg-white text-black rounded-lg"
//                   >
//                     -
//                   </button>
//                   <span className="px-3 py-1 bg-gray-800 text-white rounded-lg">{quantity}</span>
//                   <button
//                     onClick={() => incrementItem(item.name)}
//                     className="px-3 py-1 bg-white text-black rounded-lg"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Right section for cart summary */}
//       <div className="w-1/4 pl-4">
//         <h2 className="text-xl font-bold mb-4">Appetizers Selected</h2>
//         <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//           <p className="text-lg font-semibold">Total Appetizers: {totalAppetizers}</p>
//           <ul className="mt-4">
//             {Object.entries(selectedAppetizers).map(([itemName, quantity]) => (
//               <li key={itemName} className="flex justify-between">
//                 <span>{itemName}</span>
//                 <span>{quantity}</span>
//               </li>
//             ))}
//           </ul>

//           {/* Submit Order Button */}
//           <button
//             onClick={handleSubmitOrder}
//             className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
//           >
//             Submit Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppetizersPage;

"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

// Define the type for an appetizer item
interface Appetizer {
  id: number;
  name: string;
  type: string;
}

export default function SidesPage({
  addComboToCart,
}: {
  addComboToCart: (comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void;
}) {
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
        addComboToCart("Item", { "side": [{ id: item.id, name: item.name }] });
      }
    });
  };

  return (
    <div className="flex">
      {/* Left section for appetizers */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Sides</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appetizers.map((item) => {
            const quantity = selectedAppetizers[item.name]?.quantity ?? 0;

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
