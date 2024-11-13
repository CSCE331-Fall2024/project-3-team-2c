"use client";

import { api } from "~/trpc/react";
import { Suspense, useEffect, useState } from "react";

export default function OrdersPage() {
  const orders = api.orders.getAllOrders.useQuery();

  // making a separate mutation in the root of the function is absolutely necessary
  const placeOrdersMutation = api.orders.placeOrder.useMutation();

  const placeOrder = () => {
    placeOrdersMutation.mutate({
      customerId: 1,
      containers: [{ sizeId: 1, mainIds: [1], sideIds: [1] }],
    });
  };

  return (
    <>
      <div>
        <h1>Orders</h1>

        <p>These are the orders:</p>
        <Suspense fallback={<div>Loading...</div>}>
          {JSON.stringify(orders.data)}
        </Suspense>
      </div>
      <div>
        <button
          onClick={() => {
            placeOrder();
          }}
        >
          Place Order
        </button>
      </div>
    </>
  );
}
