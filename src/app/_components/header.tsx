import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";


/**
 * Header Component
 * 
 * This component renders the main navigation header for the Panda Express Manager application.
 * It includes navigation links to different management sections and a dropdown menu for selecting reports.
 * 
 * **Features:**
 * - **Navigation Links:** Home, Menu Items, Ingredients, Disposable Items, Employees.
 * - **Reports Dropdown:** Allows users to select and navigate to different report pages.
 * 
 */
const Header = () => {
  const router = useRouter();

  const handleRedirect = (value: string) => {
    switch (value) {
      case "Report 1":
        router.push(""); // Redirect to the desired page
        break;
      case "Report 2":
        router.push("");
        break;
      case "Report 3":
        router.push("");
        break;
      case "Report 4":
        router.push("");
        break;
      default:
        break;
    }
  };

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
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-red-600 px-4 py-2 text-white">
                Reports
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem
                    key="Sales Report"
                    title="Sales Report/Product Usage"
                    href="/manager/reports/sales"
                  />

                  <ListItem
                    key="X Report"
                    title="X Report"
                    href="/manager/reports/x"
                  />

                  <ListItem
                    key="Z Report"
                    title="Z Report"
                    href="/manager/reports/z"
                  />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default Header;
