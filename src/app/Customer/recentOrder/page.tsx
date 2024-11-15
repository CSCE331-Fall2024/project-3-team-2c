"use client";
import { useMemo, useState } from 'react';
import MenuBar from '../../_components/customer_menu_bar';
import { api } from '~/trpc/react';
import { tap } from 'node:test/reporters';
import { NavigationMenuSub } from '@radix-ui/react-navigation-menu';
import Item from './Item';


// insert a function for reorder button
// get the data from the table: total price, list of items ordered, order date
// list of items contain individual items, such as drinks and meals.
// in case it is a meal, then use subItems to list out the entrees and sides.


export default function PreviousOrders() {
    const { data: orders } = api.orders.getLatestOrdersByCustomer.useQuery(1);

    const orderItemIds = useMemo(() => {
        return orders?.map(order => {
            const ids: number[] = [];
            order?.containers?.forEach(container => {
                // Collect item IDs from mainItems
                container.mainIds.forEach(mainItem => {
                    if (mainItem !== null) {
                        ids.push(mainItem);
                    }
                });
                // Collect item IDs from sideItems
                container.sideIds.forEach(sideItem => {
                    if (sideItem !== null) {
                        ids.push(sideItem);
                    }
                });
            });
            return ids;
        }) || [];
    }, [orders]);
   
    

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<{ individualItems: string[]; combos: { name: string; items: Record<string, string[]> }[] }>({
    individualItems: [],
    combos: [],
  });
  const [showCart, setShowCart] = useState(false);
  });
  const [showCart, setShowCart] = useState(false);

  const handleCartClick = () => {
    console.log("Cart button clicked");
    setShowCart(true); // Show the cart view
  };
  const handleCartClick = () => {
    console.log("Cart button clicked");
    setShowCart(true); // Show the cart view
  };

    const handleHomeClick = () => {
        console.log("Home button clicked");
        setSelectedCategory(null); // Reset any selected category
        setShowCart(false);       // Hide the cart view, returning to CustomerGrid
    };    
    // hard-coded customer id 0
    

    //const {output: ordering} = api.menu.getMenuItemsByIds.useQuery( [1, 2, 3] )
    


    

  // const placeOrdersMutation = api.orders.placeOrder.useMutation();
  // const placeOrdersMutation = api.orders.placeOrder.useMutation();

  // const placeOrder = () => {
  //     placeOrdersMutation.mutate({
  //     customerId: 1,
  //     containers: [{ sizeId: 1, mainIds: [1], sideIds: [1] }],
  //     });
  // };
  // const placeOrder = () => {
  //     placeOrdersMutation.mutate({
  //     customerId: 1,
  //     containers: [{ sizeId: 1, mainIds: [1], sideIds: [1] }],
  //     });
  // };

    return (
        <div className="h-full flex flex-col">
            <MenuBar onCartClick={handleCartClick} onHomeClick={handleHomeClick} />
            <h2 className="text-2xl font-bold p-8 border-t-4 border-black" style={{ backgroundColor: '#d1282e', color: 'white' }}>Your Orders</h2>
            
            <div className="space-y-6">
                {orders?.map((order) => (
                    <div key={order?.orderId} className="border p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-bold">Order on {order?.timestamp ? new Date(order.timestamp).toLocaleDateString() : "Unknown Date"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold">${order?.total}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {orderItemIds.map((orderArray) =>(<Item orderId = {orderArray}/>))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                Reorder
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

