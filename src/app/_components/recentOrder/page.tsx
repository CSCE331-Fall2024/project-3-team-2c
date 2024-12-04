"use client";
import { useEffect, useMemo, useState } from 'react';
import MenuBar from '../customer_menu_bar';
import { api } from '~/trpc/react';
import Container from './Container';
import { containers } from '~/server/db/schema';

// Insert a function for reorder button
// Get the data from the table: total price, list of items ordered, order date
// List of items contain individual items, such as drinks and meals.
// In case it is a meal, then use subItems to list out the entrees and sides.

export default function PreviousOrders() {
    const { data: orders } = api.orders.getLatestOrdersByCustomer.useQuery(1);
    const orderItemIds = useMemo(() => {
        return orders?.map(order => {
            return order.containers;
        }) ?? [];
    }, [orders]);

    return (
        <div className="h-full flex flex-col bg-gray-100 p-6">
            {/* Scrollable container for the orders, ensuring it fits the parent container height */}
            <div className="flex-1 overflow-y-auto space-y-6">
                {orders?.map((order) => (
                    <div key={order?.orderId} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xl font-semibold text-gray-700">
                                    Order on {order?.timestamp ? new Date(order.timestamp).toLocaleDateString() : "Unknown Date"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">${order?.total}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {order.containers.map((eachContainer, index) => (
                                <Container 
                                    key={eachContainer.containerId || index}
                                    mainList={eachContainer.mainIds} 
                                    sideList={eachContainer.sideIds} 
                                    sizeId={eachContainer.sizeId} />
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300">
                                Reorder
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
