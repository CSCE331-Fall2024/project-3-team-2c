import React from "react";

type ComboItems = Record<string, string[]>;

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

      {/* Individual Items Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Individual Items</h3>
        {individualItems.length === 0 ? (
          <p className="text-gray-600">No individual items in your cart.</p>
        ) : (
          <ul className="ml-4 list-disc">
            {individualItems.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Combos Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Combos</h3>
        {combos.length === 0 ? (
          <p className="text-gray-600">No combos in your cart.</p>
        ) : (
          combos.map((combo, index) => (
            <div key={index} className="mb-3">
              <h4 className="text-lg font-semibold mb-1">{combo.name}</h4>
              <ul className="ml-4">
                {Object.entries(combo.items).map(([category, items], idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-medium">{category}:</span>{" "}
                    <span className="text-gray-600">
                      {items.join(", ")}
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
