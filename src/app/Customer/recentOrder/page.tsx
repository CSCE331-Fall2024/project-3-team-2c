"use client";
import { useEffect, useState } from 'react';
import MenuBar from '../../_components/customer_menu_bar';
import { api } from '~/trpc/react';

// insert a function for reorder button
// get the data from the table: total price, list of items ordered, order date
// list of items contain individual items, such as drinks and meals.
// in case it is a meal, then use subItems to list out the entrees and sides.

interface Item{
    name: string;
    type: string;
    price: number;
    quantity: number;
    subItems?: string[];
}
interface Order {
    total: number;
    items: Item[];
    date: string;
}




export default function PreviousOrders() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ individualItems: string[]; combos: { name: string; items: Record<string, string[]> }[] }>({
    individualItems: [],
    combos: [],
    });
    const [showCart, setShowCart] = useState(false);

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
    const { data: orders } = api.orders.getLatestOrdersByCustomer.useQuery(0);

    // const placeOrdersMutation = api.orders.placeOrder.useMutation();

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
                    <div key={order?.id} className="border p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-bold">Order on {order?.timestamp ? new Date(order.timestamp).toLocaleDateString() : "Unknown Date"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold">${order?.total}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {order?.containers.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                    <div className="flex justify-between items-center">
                                        <p>
                                            {item.sizeId}
                                        </p>
                                        {/*<p className="text-right">${item.price.toFixed(2)}</p>*/}
                                    </div>
                                    {item.mainItems && item.mainItems.length > 0 && item.sideItems && item.sideItems.length > 0 && (
                                        <ul className="ml-4 mt-1 text-sm text-gray-500 list-disc">
                                            {item.mainItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>{subItem.itemId ?? "none"}</li>
                                            ))}

                                            {item.sideItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>{subItem.itemId ?? "none"}</li>
                                            ))}
                                        </ul>
                                        
                                    )}
                                </div>
                            ))}
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