import Link from "next/link";
import React from "react";

interface MenuBarProps {
  onCartClick: () => void;
  onHomeClick: () => void;
  onItemClick?: (category: string) => void;
}

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
        {/* <Link
          href="/chatbot"
          passHref
          className="text-white font-semibold hover:underline hover:text-gray-200 transition duration-300 transform hover:scale-105 flex-grow text-center"
        >
          BambooBot
        </Link> */}
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
