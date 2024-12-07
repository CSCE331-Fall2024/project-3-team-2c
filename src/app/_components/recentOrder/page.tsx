import React from 'react';
import { api } from '~/trpc/react';
import Container from './Container';

/**
 * PreviousOrders Component
 * 
 * This component fetches and displays the latest orders for a customer.
 * Each order includes multiple containers, and each container displays
 * its associated main and side menu items along with size information.
 * 
 * @returns {JSX.Element} The rendered PreviousOrders component.
 */


export default function PreviousOrders({
    addComboToCart,
}: {
    addComboToCart: (comboName: string, comboItems: Record<string, { id: number; name: string }[]>) => void;
}) {
    const { data: orders } = api.orders.getLatestOrdersByCustomer.useQuery(1);

    return (
        <div className="h-full flex flex-col bg-gray-100 p-6">
            <div className="flex-1 overflow-y-auto space-y-6">
                {orders?.map((order) => (
                    <div
                        key={order?.orderId}
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xl font-semibold text-gray-700">
                                    Order on {order?.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'Unknown Date'}
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
                                    sizeId={eachContainer.sizeId}
                                    addComboToCart={addComboToCart}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
