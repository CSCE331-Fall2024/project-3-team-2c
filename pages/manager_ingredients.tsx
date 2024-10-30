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

// IngredientList component
const IngredientList: React.FC<{
  ingredients: Ingredient[];
  onEdit: (id: number, newName: string, newQuantity: number) => void;
  onDelete: (id: number) => void;
}> = ({ ingredients, onEdit, onDelete }) => {
  return (
    <ul>
      {ingredients.map((ingredient) => (
        <li key={ingredient.id} className="mb-2 flex items-center">
          <span className="flex-1">{ingredient.name} (Quantity: {ingredient.quantity})</span>
          <button
            onClick={() => {
              const newName = prompt('Edit ingredient name:', ingredient.name);
              const newQuantity = prompt('Edit ingredient quantity:', ingredient.quantity.toString());
              if (newName && newQuantity) onEdit(ingredient.id, newName, Number(newQuantity));
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(ingredient.id)}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            DELETE
          </button>
        </li>
      ))}
    </ul>
  );
};

// AddIngredientForm component
const AddIngredientForm: React.FC<{
  newIngredient: string;
  newQuantity: number;
  setNewIngredient: (value: string) => void;
  setNewQuantity: (value: number) => void;
  onAdd: () => void;
}> = ({ newIngredient, newQuantity, setNewIngredient, setNewQuantity, onAdd }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={newIngredient}
        onChange={(e) => setNewIngredient(e.target.value)}
        className="border p-2 mr-2"
        placeholder="New ingredient"
      />
      <input
        type="number"
        value={newQuantity}
        onChange={(e) => setNewQuantity(Number(e.target.value))}
        className="border p-2 mr-2"
        placeholder="Quantity"
        min="1"
      />
      <button onClick={onAdd} className="px-4 py-2 bg-green-500 text-white rounded">
        ADD
      </button>
    </div>
  );
};

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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Ingredients</h1>
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