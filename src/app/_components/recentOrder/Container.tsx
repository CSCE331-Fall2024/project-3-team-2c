"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

/**
 * Container Component
 * 
 * This component fetches and displays menu items based on provided main and side list IDs,
 * as well as the size type associated with a container. It retrieves data using tRPC hooks
 * and renders the size name along with the list of main and side menu items.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {number[]} props.mainList - An array of IDs for the main menu items.
 * @param {number[]} props.sideList - An array of IDs for the side menu items.
 * @param {number} props.sizeId - The ID representing the size type.
 * @returns {JSX.Element} The rendered Container component.
 */
export default function Container({
  mainList,
  sideList,
  sizeId,
  addComboToCart,
}: {
  mainList: number[];
  sideList: number[];
  sizeId: number;
  addComboToCart: (
    comboName: string,
    comboItems: Record<string, { id: number; name: string }[]>
  ) => void;
}) {
  const [isReordering, setIsReordering] = useState(false); // State for button click indication

  const temp = api.menu.getMenuItemsByIds.useQuery(mainList);
  const main = temp.data!;
  const temp2 = api.menu.getMenuItemsByIds.useQuery(sideList);
  const side = temp2.data!;
  const temp3 = api.containers.getSizeFromId.useQuery(sizeId);
  const sizeType = temp3.data!;

  const handleReorder = () => {
    setIsReordering(true); // Set state to true on click

    let sizeName = sizeType.name;
    if (sizeName == "single_item") {
      sizeName = "item";
    } else if (sizeName == "bigger_plate") {
      sizeName = "biggerplate";
    }

    const mainArray = main.map((entree) => ({
      id: entree.id,
      name: entree.name,
    }));
    const sideArray = side.map((side) => ({
      id: side.id,
      name: side.name,
    }));

    addComboToCart(sizeName, {
      Side: sideArray,
      Entree: mainArray,
    });

    // Simulate feedback (e.g., reset state after a delay)
    setTimeout(() => {
      setIsReordering(false);
    }, 2000); // Reset state after 2 seconds
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">
          {sizeType?.name ? sizeType.name : "none"}
        </p>
      </div>
      <ul className="ml-4 mt-1 list-disc text-sm text-gray-500">
        {main?.map((subItem, subIndex) => (
          <li key={subIndex}>{subItem.name ?? "none"}</li>
        ))}
        {side?.map((subItem, subIndex) => (
          <li key={subIndex}>{subItem.name ?? "none"}</li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <button
          className={`px-4 py-2 rounded ${
            isReordering ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
          } text-white`}
          onClick={handleReorder}
          disabled={isReordering} // Disable button during reordering
        >
          {isReordering ? "Processing..." : "Reorder"}
        </button>
      </div>
    </div>
  );
}
