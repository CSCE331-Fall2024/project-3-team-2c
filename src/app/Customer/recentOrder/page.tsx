"use client";
import { useEffect, useState } from 'react';

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
    const [orders, setOrders] = useState<Order[]>([
        {
            total: 12.99,
            date: "9/4/2014",
            items: [
                {
                    name: "Plate",
                    type: "Meal",
                    quantity: 1,
                    price: 12.99,
                    subItems: ["Orange Chicken", "Black Pepper Chicken", "White Rice"]
                },
              
            ]
        },
        {
            total: 15.99,
            date: "9/4/2014",
            items: [
                {
                    name: "Bigger Plate",
                    type: "TMeal",
                    quantity: 1,
                    price: 15.99,
                    subItems: ["Orange Chicken", "Kungpao Chicken", "Black Pepper Chicken", "White Rice"]
                },
                
            ]
        }
    ]);

    return (
        <div className="p-4" style={{ backgroundColor: '#ce123c', color: 'white' }}>
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            <div className="space-y-6">
                {orders.map((order, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-bold">Order on {order.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {order.items.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                    <div className="flex justify-between items-center">
                                        <p>
                                            {item.quantity} x {item.name}
                                        </p>
                                        <p className="text-right">${item.price.toFixed(2)}</p>
                                    </div>
                                    {/* Render subItems if they exist */}
                                    {item.subItems && item.subItems.length > 0 && (
                                        <ul className="ml-4 mt-1 text-sm text-gray-500 list-disc">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>{subItem}</li>
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