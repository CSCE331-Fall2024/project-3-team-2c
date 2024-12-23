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

/**
 * CustomerCart Component
 * 
 * This component displays the user's shopping cart, listing all selected combos with their
 * respective items and prices. It allows users to remove items from the cart and proceed
 * to place an order. The component formats the cart data appropriately for API interactions
 * and calculates the total price of the items in the cart.
 * 
 * @param {CartProps} props - The properties passed to the component.
 * @param {{ combos: { name: string; items: Record<string, ComboItem[]> }[] }} props.cart - The current state of the cart containing selected combos.
 * @param {React.Dispatch<React.SetStateAction<{ combos: { name: string; items: Record<string, ComboItem[]> }[] }>>} props.setCart - The state updater function for the cart.
 * @returns {JSX.Element} The rendered CustomerCart component.
 */
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
    <div className="p-4 bg-gray-50 shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Your Cart</h2>
  
      {/* Scrollable container */}
      <div className="mb-6 max-h-64 overflow-y-auto border border-gray-300 rounded-md bg-white p-3">
        {cart.combos.length === 0 ? (
          <p className="text-gray-600 text-center">No items in your cart.</p>
        ) : (
          cart.combos.map((combo, index) => {
            const sizeId = getSizeId(combo.name);
            const foundContainer = containerData.find((container) => container.id === sizeId);
            const containerPrice = foundContainer ? foundContainer.price : 0;

            return (
              <div
                key={index}
                className="mb-4 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-100"
              >
                <h4 className="mb-2 flex items-center justify-between border-b pb-2 text-lg font-semibold text-gray-700">
                  {combo.name} - <span className="text-green-600">${containerPrice.toFixed(2)}</span>
                </h4>
                <ul className="ml-4 space-y-1">
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
                  className="mt-3 bg-red-500 text-white py-1 px-3 rounded shadow hover:bg-red-600 transition-colors ml-auto block w-fit"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>

  
      {/* Total price */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Total Price: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
        </h3>
      </div>
  
      {/* Pay button */}
      <div className="flex justify-end">
        <PlaceOrderButton
          formattedContainers={formattedContainers}
          customerId={1}
          setCart={setCart}
        />
      </div>
    </div>
  );  
};


/**
 * PlaceOrderButton Component
 * 
 * This component renders a button that allows users to place their order. When clicked,
 * it sends the formatted container data along with the customer ID to the backend API
 * to process the order. Upon successful order placement, it clears the cart. It also
 * handles any errors that occur during the order placement process.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {ContainerInput[]} props.formattedContainers - An array of formatted container data to be sent to the API.
 * @param {number} props.customerId - The ID of the customer placing the order.
 * @param {React.Dispatch<React.SetStateAction<{ combos: { name: string; items: Record<string, ComboItem[]> }[] }>>} props.setCart - The state updater function to clear the cart upon successful order placement.
 * @returns {JSX.Element} The rendered PlaceOrderButton component.
 */
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
