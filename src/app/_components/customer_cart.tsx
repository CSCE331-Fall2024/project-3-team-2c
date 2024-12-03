import React from "react";
import { api } from "~/trpc/react";

// Define the types for your container data
type Container = {
  id: number;
  price: number;
  name: string;
  num_mains: number;
  num_sides: number;
};

type ComboItem = {
  id: number;
  name: string;
};

type CartProps = {
  cart: {
    combos: { name: string; items: Record<string, ComboItem[]> }[];
  };
  setCart: React.Dispatch<React.SetStateAction<{
    combos: { name: string; items: Record<string, ComboItem[]> }[];
  }>>;
};

// Hardcoded container data (id, price, name, num_mains, num_sides)
const containerData: Container[] = [
  { id: 1, price: 8, name: "bowl", num_mains: 1, num_sides: 1 },
  { id: 2, price: 2.5, name: "item", num_mains: 0, num_sides: 1 },
  { id: 3, price: 10, name: "plate", num_mains: 1, num_sides: 2 },
  { id: 4, price: 12, name: "biggerplate", num_mains: 1, num_sides: 3 },
];

// Function to get the `sizeId` based on the container name
const getSizeId = (name: string): number => {
  const container = containerData.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return container ? container.id : -1; // Return -1 if no match found
};

// Function to format the data into ContainerInput format
const formatContainerData = (container: Container, comboItems: Record<string, ComboItem[]>): ContainerInput => {
  // Assuming comboItems contains both mains and sides (as per your data structure)
  const mainItems = comboItems.Entree ?? [];
  const sideItems = comboItems.Side ?? comboItems.Drink ?? [];

  // Extracting the ids for mains and sides
  const mainIds = mainItems.map((item) => item.id);
  const sideIds = sideItems.map((item) => item.id);

  return {
    sizeId: container.id,
    mainIds,
    sideIds,
  };
};

// ContainerInput type for your formatted data
type ContainerInput = {
  sizeId: number;
  mainIds: number[];
  sideIds: number[];
};

const CustomerCart: React.FC<CartProps> = ({ setCart, cart }) => {
  const formattedContainers = cart.combos.map((combo) => {
    // Get the sizeId from the container name (e.g. "bowl")
    const sizeId = getSizeId(combo.name);
  
    // Find the container based on the sizeId
    const foundContainer = containerData.find((container) => container.id === sizeId);
  
    if (!foundContainer) {
      throw new Error(`No container found for sizeId: ${sizeId}`);
    }
  
    // Format the combo items for the API call
    return formatContainerData(foundContainer, combo.items);
  });

  // Calculate the total price
  const totalPrice = cart.combos.reduce((total, combo) => {
    const sizeId = getSizeId(combo.name);
    const foundContainer = containerData.find((container) => container.id === sizeId);

    if (foundContainer) {
      return total + foundContainer.price;
    }
    return total;
  }, 0);

  // Function to remove an item from the cart
  const removeFromCart = (index: number) => {
    setCart((prevCart) => ({
      combos: prevCart.combos.filter((_, i) => i !== index),
    }));
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {/* Scrollable container */}
      <div className="mb-6 max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
        {cart.combos.length === 0 ? (
          <p className="text-gray-600">No items in your cart.</p>
        ) : (
          cart.combos.map((combo, index) => (
            <div key={index} className="mb-3">
              <h4 className="mb-3 flex items-center justify-between border-b pb-2">{combo.name}</h4>
              <ul className="ml-4">
                {Object.entries(combo.items).map(([category, items], idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-medium">{category}:</span>{" "}
                    <span className="text-gray-600">
                      {items.map((item) => item.name).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
                {/* Remove button */}
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 ml-4"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
            </div>
          ))
        )}
      </div>
      {/* Total price */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>
      {/* Pay button */}
      <div className="flex justify-end">
        <PlaceOrderButton formattedContainers={formattedContainers} customerId={1} setCart={setCart}/>
      </div>
    </div>
  );
};

const PlaceOrderButton: React.FC<{
  formattedContainers: ContainerInput[];
  customerId: number;
  setCart: React.Dispatch<React.SetStateAction<{ combos: { name: string; items: Record<string, ComboItem[]> }[] }>>;
}> = ({ formattedContainers, customerId, setCart }) => {
  // Initialize the placeOrder mutation
  const placeOrderMutation = api.orders.placeOrder.useMutation();
  
  const handlePlaceOrder = () => {
    const orderData = {
      customerId,
      containers: formattedContainers,
    };

    // Call the mutation
    placeOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        console.log("Order placed successfully!", data);
        // Clear the cart after successful order
        setCart({ combos: [] });
      },
      onError: (error) => {
        console.error("Error placing order:", error);
      },
    });
  };

  return (
    <button
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
      onClick={handlePlaceOrder}
    >
      Pay
    </button>
  );
};

export default CustomerCart;
