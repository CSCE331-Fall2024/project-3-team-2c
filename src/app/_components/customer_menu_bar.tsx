// src/components/MenuBar.tsx
import Link from 'next/link';

export default function MenuBar() {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full z-10">
      <div className="flex row justify-around">
        <Link href="/">Home</Link>
        <Link href="/combo">Combo</Link>
        <Link href="/entree">Entree</Link>
        <Link href="/appetizers">Appetizers</Link>
        <Link href="/drinks">Drinks</Link>
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
  );
}
