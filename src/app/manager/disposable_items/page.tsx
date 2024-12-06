"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import Header from "~/app/_components/header";
import { api } from "~/trpc/react";

interface Item {
  id: number;
  name: string;
  quantity: number;
}

interface ItemOptional {
  id?: number;
  name?: string;
  quantity?: number;
}


/**
 * DisposableItemsPage Component
 * 
 * This component provides a user interface for managing disposable items in an inventory system. 
 * It allows users to view, add, edit, and delete items, with changes reflected in real-time.
 * 
 * **Key Features:**
 * - **Fetch Disposable Items:** Retrieves all disposable items from the backend and displays them in a table.
 * - **Add Item:** Opens a dialog to create a new item and save it to the backend.
 * - **Edit Item:** Opens a dialog pre-filled with item details for updating.
 * - **Delete Item:** Removes an item from the inventory after user confirmation.
 * - **Real-Time Updates:** Refreshes the table after every add, edit, or delete operation.
 * 
 * @returns {JSX.Element} A page for managing disposable items in the inventory.
 */
export default function DisposableItemsPage() {
  const updateMutation = api.disposable.updateDisposableItem.useMutation();
  const addMutation = api.disposable.addDisposableItem.useMutation();
  const deleteMutation = api.disposable.deleteDisposableItem.useMutation();

  const [items, setItems] = useState<Item[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ItemOptional>({});

  const fetchItems = () => {
    const { data: items } = api.disposable.getAllDisposableItems.useQuery();
    setItems(items ?? []);
  };

  const handleEdit = (item: Item) => {
    setFormValues(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormValues({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (formValues.id) {
      const tmp = { ...formValues, id: formValues.id };
      updateMutation.mutate(tmp);
    } else {
      const tmp = {
        name: formValues.name ?? "",
        quantity: formValues.quantity ?? 0,
      };
      addMutation.mutate(tmp);
    }

    setIsDialogOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);

      fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">
          Manage Disposable Items
        </h1>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.quantity}
                </td>
                <td className="flex gap-2 border border-gray-300 px-4 py-2">
                  <Button variant="outline" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button className="mt-4" onClick={handleAdd}>
          Add Item
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {formValues.id ? "Edit Item" : "Add Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues({ ...formValues, name: e.target.value })
                }
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={formValues.quantity}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>
            <Button type="submit" className="mt-4" onClick={handleSave}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
