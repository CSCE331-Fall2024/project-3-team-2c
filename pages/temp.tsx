"use client";

import React, { useState } from "react";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

const MenuItemsPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: "Tomato", quantity: 2 },
    { id: 2, name: "Onion", quantity: 5 },
  ]);

  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now(),
      name: newName || "New Ingredient",
      quantity: newQuantity,
    };
    setIngredients([...ingredients, newIngredient]);
    setNewName("");
    setNewQuantity(1);
  };

  const updateIngredient = (id: number) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, name: editName, quantity: editQuantity }
          : ingredient
      )
    );
    setEditId(null);
    setEditName("");
    setEditQuantity(1);
  };

  const deleteIngredient = (id: number) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  return (
    <div>
      <header style={{ 
        padding: "1rem", 
        borderBottom: "1px solid #ddd", 
        backgroundColor: "red",
        textAlign: "center"}}>
        <h1 style={{ color: "white"}}>Edit Ingredients</h1>
        <nav>
          <a href="#employees" style={{ marginRight: "1rem" }}>
            Employees
          </a>
          <a href="#menu-items" style={{ marginRight: "1rem" }}>
            Menu Items
          </a>
          <a href="#ingredients" style={{ marginRight: "1rem" }}>
            Ingredients
          </a>
          <a href="#disposables">Disposables</a>
        </nav>
      </header>

      <div style={{ padding: "1rem" }}>
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              border: "1px solid #ddd",
              marginBottom: "0.5rem",
            }}
          >
            {editId === ingredient.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(Number(e.target.value))}
                  style={{ marginRight: "0.5rem" }}
                />
                <button onClick={() => updateIngredient(ingredient.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span>
                  {ingredient.name} (Quantity: {ingredient.quantity})
                </span>
                <div>
                  <button
                    onClick={() => {
                      setEditId(ingredient.id);
                      setEditName(ingredient.name);
                      setEditQuantity(ingredient.quantity);
                    }}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteIngredient(ingredient.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New Ingredient"
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            placeholder="Quantity"
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={addIngredient}>Add Ingredient</button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemsPage;