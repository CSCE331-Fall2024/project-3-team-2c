"use client";

import React, { useState } from "react";

interface Item {
    id: number;
    content: string;
}

const MenuItemsPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
        { id: 1, content: "Orange Chicken" },
        { id: 2, content: "Bejing Beef" },
    ]);

    const [newContent, setNewContent] = useState("");
    const [editId, setEditId] = useState<number | null>(null); // Holds the id of the item being edited

    const addItem = () => {
        const newItem: Item = {
            id: Date.now(),
            content: newContent || "New Item",
        };
        setItems([...items, newItem]);
        setNewContent(""); // Clear input after adding
    };

    const enableEditing = (id: number) => {
        setEditId(id);
    };

    const deleteItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const saveEdit = (id: number, newContent: string) => {
        setItems(
            items.map((item) => (item.id === id ? { ...item, content: newContent } : item))
        );
        setEditId(null); // Disable editing mode after saving
    };


    return (
        <div>
            <header style={{ backgroundColor: "red", padding: "1rem", color: "#fff", textAlign: "center" }}>
                <h1>Menu Items</h1>
                <nav>
                    <a href="#employees" style={{ marginRight: "1rem" }}>Employees</a>
                    <a href="#menu-items" style={{ marginRight: "1rem" }}>Menu Items</a>
                    <a href="#ingredients" style={{ marginRight: "1rem" }}>Ingredients</a>
                    <a href="#disposables">Disposables</a>
                </nav>
            </header>

            <div style={{ padding: "1rem" }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem",
                            border: "1px solid #ddd",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {editId === item.id ? (
                            <input
                                type="text"
                                value={item.content}
                                onChange={(e) =>
                                    setItems(
                                        items.map((el) =>
                                            el.id === item.id ? { ...el, content: e.target.value } : el
                                        )
                                    )
                                }
                            />
                        ) : (
                            <span>{item.content}</span>
                        )}

                        <div>
                            {editId === item.id ? (
                                <button
                                    style={{ margin: "0 0.5rem" }}
                                    onClick={() => saveEdit(item.id, item.content)}
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    style={{ margin: "0 0.5rem" }}
                                    onClick={() => enableEditing(item.id)}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                style={{ margin: "0 0.5rem" }}
                                onClick={() => deleteItem(item.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add new item section */}
                <div style={{ marginTop: "1rem" }}>
                    <input
                        type="text"
                        value={newContent}
                        placeholder="Add new item"
                        onChange={(e) => setNewContent(e.target.value)}
                        style={{ marginRight: "0.5rem" }}
                    />
                    <button onClick={addItem}>Add</button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemsPage;