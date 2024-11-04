"use client";

import Link from "next/link";
import { redirect } from 'next/navigation'


export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/manager/menu_item">Go to Menu Items</Link>
          <a onClick={() => redirect('/manager/menu_item')} style={{ cursor: "pointer" }}>Menu Items</a>
        </li>
        {/* Add other links as needed */}
      </ul>
    </nav>
  );
}