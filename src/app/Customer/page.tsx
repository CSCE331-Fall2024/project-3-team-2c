"use client";

import { useEffect, useState } from 'react';
import MenuBar from '../_components/cashier_menu_bar';
import CustomerGrid from '../_components/cashier_customer_grid';
import SelectionPage from '../_components/cashier_selection_page';

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCategory(null);
  }, []);

  const handleGridClick = (category: string) => {
    if (["bowl", "plate", "biggerplate"].includes(category.toLowerCase())) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <MenuBar />
      <div className="flex-grow flex items-center justify-center p-8 mt-16"> {/* Adjust margin to account for MenuBar height */}
        {selectedCategory ? (
          <SelectionPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
          />
        ) : (
          <CustomerGrid onClick={handleGridClick} />
        )}
      </div>
    </div>
  );
}
