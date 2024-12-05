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
  type: string;
}

interface ItemOptional {
  id?: number;
  name?: string;
  type?: string;
}

export default function MenuItemsPage() {
  const updateMutation = api.menu.updateMenuItem.useMutation();
  const addMutation = api.menu.addMenuItem.useMutation();
  const deleteMutation = api.menu.deleteMenuItem.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ItemOptional>({});
  const { data: items, refetch } = api.menu.getAllMenuItems.useQuery();

  const fetchItems = async () => {
    await refetch();
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
        type: formValues.type ?? "",
      };
      addMutation.mutate(tmp);
    }

    setIsDialogOpen(false);
    await fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);

      await fetchItems();
    }
  };

  return (
    <>
      <Header />
      <div className="bg-white p-6">
        <h1 className="mb-4 flex justify-center text-xl font-bold">
          Manage Menu Items
        </h1>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.type}
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
              <select
                value={formValues.type}
                onChange={(e) =>
                  setFormValues({ ...formValues, type: e.target.value })
                }
                className="w-full rounded border px-2 py-1"
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="entree">Entree</option>
                <option value="side">Side</option>
                <option value="drink">Drink</option>
              </select>
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
