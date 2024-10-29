import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "~/components/ui/navigation-menu"
import "./managerMenu.css"; 

export default function ManagerMenu() {
    return (
        <main>
            <h1>
                Manager Menu
            </h1>
            <NavigationMenu>
                <NavigationMenuList className="horizontal-tabs">
                    {/* Tab for Employee */}
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/employees">Employees</NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Tab for Menu Items */}
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/menu-items">Menu Items</NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Tab for Inventory */}
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/inventory">Inventory</NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Tab for Records */}
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/records">Records</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </main>
    );
}
