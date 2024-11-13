import Link from 'next/link';
import React from 'react';

interface MenuBarProps {
  onCartClick: () => void;
  onHomeClick: () => void;
}

export default function MenuBar({ onCartClick, onHomeClick }: MenuBarProps) {
  return (
    <nav className="bg-[#d1282e] text-white p-4 fixed top-0 w-full z-10">
      <div className="flex row justify-around">
        {/* Use a button with onClick to trigger the home function */}
        <button onClick={onHomeClick} className="text-white">Home</button>
        <Link href="/combo" passHref>
          Combo
        </Link>
        <Link href="/entree" passHref>
          Entree
        </Link>
        <Link href="/appetizers" passHref>
          Appetizers
        </Link>
        <Link href="/drinks" passHref>
          Drinks
        </Link>
        {/* Use a button to trigger the cart function */}
        <button onClick={onCartClick} className="text-white">Cart</button>
      </div>
    </nav>
  );
}
