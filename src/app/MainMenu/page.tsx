"use client"

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function MainMenu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FEC6B5] p-5">
      <header className="text-center mb-10 text-3xl font-bold">PANDA EXPRESS</header>
      <div className="grid grid-cols-2 gap-5">

        <Link href="./manager/menu_item">
          <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
            <span className="text-2xl font-bold text-black z-10">Manager</span>
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food1.jpg')" }}
            ></div>
          </div>
        </Link>

        <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
          <span className="text-2xl font-bold text-black z-10">Cashier</span>
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
            style={{ backgroundImage: "url('/MainMenuImages/food2.jpeg')" }}
          >
          </div>
        </div>
        
        <Link href="./Customer">
          <div 
            className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
            <span className="text-2xl font-bold text-black z-10">Customer</span>
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food3.jpg')" }}
            ></div>
          </div>
        </Link>


        <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
          <span className="text-2xl font-bold text-black z-10">Menu Board</span>
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
            style={{ backgroundImage: "url('/MainMenuImages/food4.jpg')" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
