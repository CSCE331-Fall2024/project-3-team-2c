"use client";

import React, { useState } from "react";
import { Card } from "../../card_component/card"


interface Item {
    id: number;
    content: string;
}

const MenuItemsPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
        { id: 1, content: "Orange Chicken" },
        { id: 2, content: "Beijing Beef" },
    ]);
    const [newContent, setNewContent] = useState<string>(""); // State for the new item content
    const [editId, setEditId] = useState<number | null>(null);

    // Enable editing of an item
    const enableEditing = (id: number) => {
        setEditId(id);
    };

    // Delete an item
    const deleteItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    // Save an edited item
    const saveEdit = (id: number, newContent: string) => {
        setItems(items.map((item) => (item.id === id ? { ...item, content: newContent } : item)));
        setEditId(null); // Disable editing mode after saving
    };

    // Add a new item
    const addItem = () => {
        if (newContent.trim() !== "") {
            const newItem: Item = {
                id: Date.now(),
                content: newContent,
            };
            setItems([...items, newItem]);
            setNewContent(""); // Clear input after adding
        }
    };

    return (
        <div>
            <header style={{ backgroundColor: "red", padding: "1rem", color: "#fff", textAlign: "center" }}>
                <nav>
                    <a href="#employees" style={{ marginRight: "1rem" }}>Employees</a>
                    <a href="#menu-items" className="font-bold text-xl mr-4" style={{ marginRight: "1rem" }}>Menu Items</a>
                    <a href="#ingredients" style={{ marginRight: "1rem" }}>Ingredients</a>
                    <a href="#disposables">Disposables</a>
                </nav>
            </header>

            <div className="p-4">
                {/* Add new item section */}
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        value={newContent}
                        placeholder="Add new item"
                        onChange={(e) => setNewContent(e.target.value)}
                        className="border p-2 rounded mr-2"
                    />
                    <button
                        onClick={addItem}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>

                {/* Render the list of cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 place-items-center">
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            imageUrl="https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
                            name={item.content}
                            onEdit={() => enableEditing(item.id)}
                            onDelete={() => deleteItem(item.id)}
                            isEditing={editId === item.id}
                            onSave={(newContent) => saveEdit(item.id, newContent)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default MenuItemsPage;
