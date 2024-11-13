"use client";

import { api } from "~/trpc/react";
import { Suspense } from "react";

export default function OrdersPage() {
  const { data: orders } = api.orders.getAllOrders.useQuery();

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
          <div>
            {orders?.map((order) => {
              return (
                <div key={order?.id}>
                  <h2>Order {order?.id}</h2>
                  <p>Total: {order?.total}</p>
                  <p>Containers:</p>
                  {order?.containers.map((container) => {
                    return (
                      <>
                        <p>
                          ---------------------------------------------------------
                        </p>
                        <p>
                          ---------------------------------------------------------
                        </p>
                        <p>Container {container.id}</p>
                        <p>Size: {container.sizeId}</p>
                        <p>
                          Main Items:{" "}
                          {container.mainItems.map(({ itemId }) => itemId)}
                        </p>
                        <p>
                          Side Items:{" "}
                          {container.sideItems.map(({ itemId }) => itemId)}
                        </p>
                        <p>
                          ---------------------------------------------------------
                        </p>
                        <p>
                          ---------------------------------------------------------
                        </p>
                      </>
                    );
                  })}
                </div>
              );
            })}
          </div>
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
