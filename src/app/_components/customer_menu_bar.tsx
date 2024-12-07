import Link from "next/link";
import React from "react";

interface MenuBarProps {
  onCartClick: () => void;
  onHomeClick: () => void;
  onItemClick?: (category: string) => void;
}

/**
 * MenuBar Component
 * 
 * This component renders a responsive navigation bar with links and buttons for navigating
 * through different sections of the application, such as Home, All Items, Entrees, Sides,
 * Drinks, BambooBot, and Cart. It accepts callback functions as props to handle clicks on
 * the Cart, Home, and specific item category buttons. Additionally, it provides default
 * behavior for item clicks if no handler is provided.
 * 
 * @param {MenuBarProps} props - The properties passed to the component.
 * @param {() => void} props.onCartClick - Callback function invoked when the Cart button is clicked.
 * @param {() => void} props.onHomeClick - Callback function invoked when the Home button is clicked.
 * @param {(category: string) => void} [props.onItemClick] - Optional callback function invoked when an item category button is clicked. Receives the category name as an argument.
 * @returns {JSX.Element} The rendered MenuBar component.
 */
export default function MenuBar({
  onCartClick,
  onHomeClick,
  onItemClick,
}: MenuBarProps) {
  onItemClick =
    onItemClick ??
    ((category) => {
      console.log("onItemClick not defined. Category: ", category);
    });

  return (
    <nav className="top-0 z-10 w-full bg-[#d1282e] p-4 text-white shadow-md">
      <div className="flex justify-between items-center w-full">
        <Link
          aria-label="navbar"
          role="contentinfo"
          href="/MainMenu"
          passHref
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow text-center"
        >
          Home
        </Link>
        <button
          onClick={onHomeClick}
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow"
        >
          All Items
        </button>
        <button
          onClick={() => onItemClick("entrees")}
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow"
        >
          Entree
        </button>
        <button
          onClick={() => onItemClick("appetizers")}
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow"
        >
          Sides
        </button>
        <button
          onClick={() => onItemClick("drinks")}
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow"
        >
          Drinks
        </button>
        <Link
          href="/chatbot"
          passHref
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow text-center"
        >
          BambooBot
        </Link>
        <button
          onClick={onCartClick}
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow"
        >
          Cart
        </button>
      </div>
    </nav>
  );
}
