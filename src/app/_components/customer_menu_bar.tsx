import Link from 'next/link';
import React from 'react';

interface MenuBarProps {
  onCartClick: () => void;
  onHomeClick: () => void;
  onItemClick: (category:string) => void;
}

export default function MenuBar({ onCartClick, onHomeClick, onItemClick }: MenuBarProps) {
  return (
    <nav className="bg-[#d1282e] text-white p-4 top-0 w-full z-10">
      <div className="flex row justify-around">
        {/* Use a button with onClick to trigger the home function */}
        <button onClick={onHomeClick} className="text-white">Home</button>
        <button className="text-white">Combo</button>
        <button onClick={() => onItemClick("entrees")} className="text-white">Entree</button>
        <button onClick={() => onItemClick("appetizers")} className="text-white">Appetizers</button>
        <button onClick={() => onItemClick("drinks")} className="text-white">Drinks</button>
        <Link href="/chatbot" passHref>
          BambooBot
        </Link>
        <button onClick={onCartClick} className="text-white">Cart</button>
      </div>
    </nav>
  );
}
