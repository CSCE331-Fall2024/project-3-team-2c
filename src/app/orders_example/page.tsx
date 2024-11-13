"use client";

import { api } from "~/trpc/react";
import { Suspense, useEffect, useState } from "react";

export default function OrdersPage() {
  const orders = api.orders.getAllOrders.useQuery();

  const placeOrder = () => {
    api.orders.placeOrder.useMutation({});
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
