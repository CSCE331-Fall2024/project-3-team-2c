"use client";

import { useState } from 'react';
import MenuBar from '../_components/cashier_menu_bar';
import CustomerGrid from '../_components/cashier_customer_grid';
import SelectionPage from '../_components/cashier_selection_page';

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleGridClick = (category: string) => {
    if (["bowl", "plate", "biggerPlate"].includes(category.toLowerCase())) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <MenuBar />
      <div className="flex-grow flex items-center justify-center p-8">
        {selectedCategory ? (
          <SelectionPage category={selectedCategory} />
        ) : (
          <CustomerGrid onClick={handleGridClick} />
        )}
      </div>
    </div>
  );
}
