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
      console.log("There onItemClick not defined. Category: ", category);
    });

  return (
    <nav className="top-0 z-10 w-full bg-[#d1282e] p-4 text-white">
      <div className="row flex justify-around">
        {/* Use a button with onClick to trigger the home function */}
        <button onClick={onHomeClick} className="text-white">
          Home
        </button>
        <button className="text-white">Combo</button>
        <button onClick={() => onItemClick("entrees")} className="text-white">
          Entree
        </button>
        <button
          onClick={() => onItemClick("appetizers")}
          className="text-white"
        >
          Appetizers
        </button>
        <button onClick={() => onItemClick("drinks")} className="text-white">
          Drinks
        </button>
        <Link href="/chatbot" passHref>
          BambooBot
        </Link>
        <button onClick={onCartClick} className="text-white">
          Cart
        </button>
      </div>
    </nav>
  );
}
