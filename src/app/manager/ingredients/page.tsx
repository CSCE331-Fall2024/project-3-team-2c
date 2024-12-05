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

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

interface IngredientOptional {
  id?: number;
  name?: string;
  quantity?: number;
}

export default function IngredientsPage() {
  const addMutation = api.ingredients.addIngredient.useMutation();
  const updateMutation = api.ingredients.updateIngredient.useMutation();
  const deleteMutation = api.ingredients.deleteIngredient.useMutation();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IngredientOptional>({});

  const fetchIngredients = () => {
    const { data: ingredients } = api.ingredients.getAllIngredients.useQuery();
    setIngredients(ingredients ?? []);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setFormValues(ingredient);
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
    fetchIngredients();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      deleteMutation.mutate(id);
      fetchIngredients();
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-white p-6">
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
                  setFormValues({
                    ...formValues,
                    quantity: Number(e.target.value),
                  })
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
