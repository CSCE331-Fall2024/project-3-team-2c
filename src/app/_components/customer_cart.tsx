import React from "react";

type ComboItems = Record<string, { id: number; name: string }[]>;

interface Combo {
  name: string;
  items: ComboItems;
}

interface CustomerCartProps {
  cart: {
    individualItems: string[];
    combos: Combo[];
  };
}

const CustomerCart: React.FC<CustomerCartProps> = ({ cart }) => {
  const { individualItems, combos } = cart;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {/* Scrollable container */}
      <div className="mb-6 max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
        {combos.length === 0 ? (
          <p className="text-gray-600">No items in your cart.</p>
        ) : (
          combos.map((combo, index) => (
            <div key={index} className="mb-3">
              <h4 className="text-lg font-semibold mb-1">{combo.name}</h4>
              <ul className="ml-4">
                {Object.entries(combo.items).map(([category, items], idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-medium">{category}:</span>{" "}
                    <span className="text-gray-600">
                      {items.map(item => item.name).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerCart;
