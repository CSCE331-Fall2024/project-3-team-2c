"use client";

import { useEffect, useState } from 'react';
import MenuBar from '../_components/customer_menu_bar';
import CustomerGrid from '../_components/customer_grid';
import SelectionPage from '../_components/customer_selection_page';
import CustomerCart from '../_components/customer_cart';
import PreviousOrders from './recentOrder/page';
import DrinksPage from '../_components/drinks';
import EntreesPage from '../_components/entrees';
import SidesPage from '../_components/sides';

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ combos: { name: string; items: Record<string, { id: number; name: string }[]> }[] }>({
    combos: [],
  });

  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    setSelectedCategory(null);
  }, []);

  const handleGridClick = (category: string) => {
    setSelectedCategory(category);
    setShowCart(false); // Hide cart when selecting a category
  };

  const handleCartClick = () => {
    setShowCart(true); // Show the cart view
  };

  const handleHomeClick = () => {
    setSelectedCategory(null); // Reset any selected category
    setShowCart(false);       // Hide the cart view, returning to CustomerGrid
  };

  const addComboToCart = (
    packageName: string,
    packageItems: Record<string, { id: number; name: string }[]>
  ) => {
    console.log(packageItems);
  
    // Prepare the cart data structure to include the new format
    const formattedItems = Object.fromEntries(
      Object.entries(packageItems).map(([step, items]) => [
        step,
        items.map(({ id, name }) => ({ id, name })),
      ])
    );
  
    setCart((prevCart) => ({
      ...prevCart,
      combos: [
        ...prevCart.combos,
        {
          name: packageName,
          items: formattedItems,
        },
      ],
    }));
  };
  

  const showRecentOrders = (category: string) => {
    setSelectedCategory(category)
    setShowCart(false);
  };

  return (
    <div className="h-full flex flex-col">
      <MenuBar onCartClick={handleCartClick} onHomeClick={handleHomeClick} onItemClick={handleGridClick}/>
      
      {/* Circular Button Below MenuBar */}
      <div className="flex justify-end mt-8 pr-8">
        <button
          onClick={() => showRecentOrders("recentOrders")} // Call showRecentOrders function
          className="w-20 h-20 rounded-full bg-blue-500 text-white text-center flex items-center justify-center shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-300 ease-in-out"
        >
          Show Recent Order
        </button>
      </div>
  
      <div className="flex-1 p-8 mt-2 h-full">
        {showCart ? (
          <CustomerCart setCart={setCart} cart={cart} />
        ) : selectedCategory && ["bowl", "plate", "biggerPlate"].includes(selectedCategory) ? (
          <SelectionPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addComboToCart={addComboToCart}
          />
        ) : selectedCategory === "drinks" ? (
          <DrinksPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addComboToCart={addComboToCart}
          />
        ) : selectedCategory === "appetizers" ? (
          <SidesPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addComboToCart={addComboToCart}
          />
        ) : selectedCategory === "entrees" ? (
          <EntreesPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addComboToCart={addComboToCart}
          />
        ) : selectedCategory === "recentOrders" ? (
          <PreviousOrders />
        ) : (
          <CustomerGrid onClick={handleGridClick} />
        )}
      </div>
    </div>
  );
  
}
