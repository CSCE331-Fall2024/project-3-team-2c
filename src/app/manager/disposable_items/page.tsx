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

export default function DisposableItemsPage() {
  const [items, setItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    id: null,
    name: "",
    quantity: "",
  });

  const fetchItems = async () => {
    const res = await fetch("/api/disposable_items");
    const data = await res.json();
    setItems(data);
  };

  const handleEdit = (item) => {
    setFormValues(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormValues({ id: null, name: "", quantity: "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (formValues.id) {
      await fetch("/api/disposable_items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
    } else {
      const { id, ...newItem } = formValues;
      await fetch("/api/disposable_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
    }

    setIsDialogOpen(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const response = await fetch(`/api/disposable_items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchItems();
      } else {
        console.error("Failed to delete item");
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 bg-white">
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
                  setFormValues({ ...formValues, quantity: e.target.value })
                }
              />
            </div>
            <Button className="mt-4" onClick={handleSave}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
