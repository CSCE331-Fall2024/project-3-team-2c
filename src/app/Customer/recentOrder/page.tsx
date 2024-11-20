"use client";
import { useEffect, useMemo, useState } from 'react';
import MenuBar from '../../_components/customer_menu_bar';
import { api } from '~/trpc/react';
import Container from './Container';


// insert a function for reorder button
// get the data from the table: total price, list of items ordered, order date
// list of items contain individual items, such as drinks and meals.
// in case it is a meal, then use subItems to list out the entrees and sides.


export default function PreviousOrders() {
    const { data: orders } = api.orders.getLatestOrdersByCustomer.useQuery(1);

    const orderItemIds = useMemo(() => {
        return orders?.map(order => {
            return order.containers;
        }) || [];
    }, [orders]);
   
    

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<{ individualItems: string[]; combos: { name: string; items: Record<string, string[]> }[] }>({
    individualItems: [],
    combos: [],
  });
  const [showCart, setShowCart] = useState(false);
  useEffect(() => {
    setSelectedCategory(null);
  }, []);
  const handleCartClick = () => {
    console.log("Cart button clicked");
    setShowCart(true); // Show the cart view
  };


    const handleHomeClick = () => {
        console.log("Home button clicked");
        setSelectedCategory(null); // Reset any selected category
        setShowCart(false);       // Hide the cart view, returning to CustomerGrid
    };    


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
                            {order.containers.map((eachContainer) => (<Container mainList = {eachContainer.mainIds} 
                            sideList = {eachContainer.sideIds} sizeId={eachContainer.sizeId}/>)
                            )}
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

