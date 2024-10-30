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
        <li key={ingredient.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1 }}>{ingredient.name} (Quantity: {ingredient.quantity})</span>
          <button
            onClick={() => {
              const newName = prompt('Edit ingredient name:', ingredient.name);
              const newQuantity = prompt('Edit ingredient quantity:', ingredient.quantity.toString());
              if (newName && newQuantity) onEdit(ingredient.id, newName, Number(newQuantity));
            }}
            style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '4px', marginRight: '8px' }}
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(ingredient.id)}
            style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px' }}
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
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        value={newIngredient}
        onChange={(e) => setNewIngredient(e.target.value)}
        style={{ border: '1px solid #ccc', padding: '8px', marginRight: '8px' }}
        placeholder="New ingredient"
      />
      <input
        type="number"
        value={newQuantity}
        onChange={(e) => setNewQuantity(Number(e.target.value))}
        style={{ border: '1px solid #ccc', padding: '8px', marginRight: '8px' }}
        placeholder="Quantity"
        min="1"
      />
      <button onClick={onAdd} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', borderRadius: '4px' }}>
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