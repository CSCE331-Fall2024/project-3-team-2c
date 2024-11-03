import Link from "next/link";


export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/manager/menu_item">Go to Menu Items</Link>
          <Link href="/customer/menu_item">Kiosk GUI</Link>
        </li>
        {/* Add other links as needed */}
      </ul>
    </nav>
  );
}