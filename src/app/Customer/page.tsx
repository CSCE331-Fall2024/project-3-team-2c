"use client";

import { useEffect, useState } from 'react';
import MenuBar from '../_components/customer_menu_bar';
import CustomerGrid from '../_components/customer_grid';
import SelectionPage from '../_components/customer_selection_page';
import CustomerCart from '../_components/customer_cart';
import PreviousOrders from './recentOrder/page';

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ individualItems: string[]; combos: { name: string; items: Record<string, string[]> }[] }>({
    individualItems: [],
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
    console.log("Cart button clicked");
    setShowCart(true); // Show the cart view
  };

  const handleHomeClick = () => {
    console.log("Home button clicked");
    setSelectedCategory(null); // Reset any selected category
    setShowCart(false);       // Hide the cart view, returning to CustomerGrid
  };

  const addItemToCart = (item: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      individualItems: [...prevCart.individualItems, item],
    }));
  };

  const addComboToCart = (packageName: string, packageItems: Record<string, string[]>) => {
    setCart((prevCart) => ({
      ...prevCart,
      combos: [...prevCart.combos, { name: packageName, items: packageItems }],
    }));
  };

  const showRecentOrders = (category: string) => {
    setSelectedCategory(category)
    setShowCart(false);
  };

  return (
    <div className="h-full flex flex-col">
      <MenuBar onCartClick={handleCartClick} onHomeClick={handleHomeClick} />
      
      {/* Circular Button Below MenuBar */}
      <div className="flex justify-end mt-8 pr-8">
        <button
          onClick={() => showRecentOrders("recentOrders")} // Call showRecentOrders function
          className="w-20 h-20 rounded-full bg-blue-500 text-white text-center flex items-center justify-center shadow-md hover:bg-blue-600 hover:scale-110 transition-all duration-300 ease-in-out"
        >
          Show Recent Order
        </button>
      </div>
  
      <div className="flex-1 p-8 mt-16 h-full">
        {showCart ? (
          <CustomerCart cart={cart} />
        ) : selectedCategory === "selectionPage" ? (
          <SelectionPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addComboToCart={addComboToCart}
          />
        ) : selectedCategory === "recentOrders" ? (
          <PreviousOrders />
        ) : (
          <CustomerGrid onClick={() => handleGridClick("selectionPage")} />
        )}
      </div>
    </div>
  );
  
}
