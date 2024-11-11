// "use client";

// import { useEffect, useState } from 'react';
// import MenuBar from '../_components/customer_menu_bar';
// import CustomerGrid from '../_components/customer_grid';
// import SelectionPage from '../_components/customer_selection_page';

// export default function CustomerPage() {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//   useEffect(() => {
//     setSelectedCategory(null);
//   }, []);

//   const handleGridClick = (category: string) => {
//     if (["bowl", "plate", "biggerplate"].includes(category.toLowerCase())) {
//       setSelectedCategory(category);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col h-full">
//       <MenuBar />
//       <div className="flex-1 p-8 mt-16 h-full"> {/* Ensure there’s enough space for the MenuBar */}
//         {selectedCategory ? (
//           <SelectionPage 
//             category={selectedCategory} 
//             setSelectedCategory={setSelectedCategory}
//           />
//         ) : (
//           <CustomerGrid onClick={handleGridClick} />
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from 'react';
import MenuBar from '../_components/customer_menu_bar';
import CustomerGrid from '../_components/customer_grid';
import SelectionPage from '../_components/customer_selection_page';

export default function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ items: string[]; combos: Record<string, string[]>[] }>({
    items: [],
    combos: [],
  });

  console.log(cart);
  
  useEffect(() => {
    setSelectedCategory(null);
  }, []);

  const handleGridClick = (category: string) => {
    if (["bowl", "plate", "biggerplate"].includes(category.toLowerCase())) {
      setSelectedCategory(category);
    }
  };

  const addItemToCart = (item: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: [...prevCart.items, item],
    }));
  };

  const addComboToCart = (packageName: string, packageItems: Record<string, string[]>) => {
    setCart((prevCart) => ({
      ...prevCart,
      combos: [...prevCart.combos, { [packageName]: packageItems }],
    }));
  };

  return (
    <div className="h-full flex flex-col h-full">
      <MenuBar />
      <div className="flex-1 p-8 mt-16 h-full">
        {selectedCategory ? (
          <SelectionPage 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            addItemToCart={addItemToCart}
            addComboToCart={addComboToCart}
          />
        ) : (
          <CustomerGrid onClick={handleGridClick} />
        )}
      </div>
    </div>
  );
}
