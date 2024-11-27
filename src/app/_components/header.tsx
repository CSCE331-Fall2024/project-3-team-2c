import React from "react";
import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-red-600 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Panda Express Manager</h1>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <Link href="/" passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    "px-4 py-2 text-white hover:text-yellow-300 hover:underline",
                  )}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/manager/menu_item" passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    "px-4 py-2 text-white hover:text-yellow-300 hover:underline",
                  )}
                >
                  Menu Items
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/manager/ingredients" passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    "px-4 py-2 text-white hover:text-yellow-300 hover:underline",
                  )}
                >
                  Ingredients
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/manager/disposable_items" passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    "px-4 py-2 text-white hover:text-yellow-300 hover:underline",
                  )}
                >
                  Disposable Items
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/manager/employees" passHref legacyBehavior>
                <NavigationMenuLink
                  className={cn(
                    "px-4 py-2 text-white hover:text-yellow-300 hover:underline",
                  )}
                >
                  Employees
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
