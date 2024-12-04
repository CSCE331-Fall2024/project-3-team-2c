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

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    id: null,
    name: "",
    quantity: "",
  });

  const fetchIngredients = async () => {
    const res = await fetch("/api/ingredients");
    const data = await res.json();
    setIngredients(data);
  };

  const handleEdit = (ingredient) => {
    setFormValues(ingredient);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormValues({ id: null, name: "", quantity: "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (formValues.id) {
      await fetch("/api/ingredients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
    } else {
      const { id, ...newIngredient } = formValues;
      await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIngredient),
      });
    }

    setIsDialogOpen(false);
    fetchIngredients();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      const response = await fetch(`/api/ingredients`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchIngredients();
      } else {
        console.error("Failed to delete ingredient");
      }
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 bg-white">
        <h1 className="mb-4 flex justify-center text-xl font-bold">
          Manage Ingredients
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
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {ingredient.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ingredient.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ingredient.quantity}
                </td>
                <td className="flex gap-2 border border-gray-300 px-4 py-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(ingredient)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(ingredient.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button className="mt-4" onClick={handleAdd}>
          Add Ingredient
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {formValues.id ? "Edit Ingredient" : "Add Ingredient"}
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
