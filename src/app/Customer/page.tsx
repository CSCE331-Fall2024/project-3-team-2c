"use client";

import { useEffect, useState } from 'react';
import MenuBar from '../_components/customer_menu_bar';
import CustomerGrid from '../_components/customer_grid';
import SelectionPage from '../_components/customer_selection_page';

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
    <div className="h-full flex flex-col bg-gray-100">
      <MenuBar />
      <div className="flex-1 p-8 mt-16"> {/* Ensure there’s enough space for the MenuBar */}
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
