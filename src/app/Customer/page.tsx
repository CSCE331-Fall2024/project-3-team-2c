"use client";

import { useEffect, useState } from 'react';
import MenuBar from '../_components/customer_menu_bar';
import CustomerGrid from '../_components/customer_grid';
import SelectionPage from '../_components/customer_selection_page';
import CustomerCart from '../_components/customer_cart';

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

  return (
    <div className="h-full flex flex-col">
      <MenuBar onCartClick={handleCartClick} onHomeClick={handleHomeClick} />
      <div className="flex-1 p-8 mt-16 h-full">
        {showCart ? (
          <CustomerCart cart={cart} />
        ) : selectedCategory ? (
          <SelectionPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addComboToCart={addComboToCart}
          />
        ) : (
          <CustomerGrid onClick={handleGridClick} />
        )}
      </div>
    </div>
  );
}
