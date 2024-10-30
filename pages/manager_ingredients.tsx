"use client"
import React, { useState } from 'react';

// Ingredient interface
interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

// Initial ingredients list
const initialIngredients: Ingredient[] = [
  { id: 1, name: 'Tomato', quantity: 2 },
  { id: 2, name: 'Onion', quantity: 5 },
  { id: 3, name: 'Garlic', quantity: 10 },
];



// Main component
export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [newIngredient, setNewIngredient] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(1);

  const addIngredient = () => {
    if (newIngredient.trim() === '' || newQuantity <= 0) return;
    const newId = ingredients.length ? ingredients[ingredients.length - 1].id + 1 : 1;
    setIngredients([...ingredients, { id: newId, name: newIngredient, quantity: newQuantity }]);
    setNewIngredient('');
    setNewQuantity(1);
  };

  const editIngredient = (id: number, newName: string, newQuantity: number) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, name: newName, quantity: newQuantity } : ingredient
      )
    );
  };

  const deleteIngredient = (id: number) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Ingredients</h1>
      <AddIngredientForm
        newIngredient={newIngredient}
        newQuantity={newQuantity}
        setNewIngredient={setNewIngredient}
        setNewQuantity={setNewQuantity}
        onAdd={addIngredient}
      />
      <IngredientList
        ingredients={ingredients}
        onEdit={editIngredient}
        onDelete={deleteIngredient}
      />
    </div>
  );
}