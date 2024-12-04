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
      items.map((item) =>
        item.id === id ? { ...item, content: newContent } : item,
      ),
    );
    setEditId(null); // Disable editing mode after saving
  };

return (
  <div>
    <header
      style={{
        backgroundColor: "#ff5c5c",  // Soft red for a modern look
        padding: "1.5rem",
        color: "#fff",
        textAlign: "center",
        borderBottom: "3px solid #fff",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Menu Items</h1>
      <nav>
        <a
          href="#employees"
          style={{
            marginRight: "1.5rem",
            textDecoration: "none",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "color 0.3s",
          }}
        >
          Employees
        </a>
        <a
          href="#menu-items"
          style={{
            marginRight: "1.5rem",
            textDecoration: "none",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "color 0.3s",
          }}
        >
          Menu Items
        </a>
        <a
          href="#ingredients"
          style={{
            marginRight: "1.5rem",
            textDecoration: "none",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "color 0.3s",
          }}
        >
          Ingredients
        </a>
        <a
          href="#disposables"
          style={{
            textDecoration: "none",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "color 0.3s",
          }}
        >
          Disposables
        </a>
      </nav>
    </header>

    <div style={{ padding: "2rem 3rem", backgroundColor: "#f9f9f9" }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem",
            border: "1px solid #ddd",
            marginBottom: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px", // Soft rounded corners
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {editId === item.id ? (
            <input
              type="text"
              value={item.content}
              onChange={(e) =>
                setItems(
                  items.map((el) =>
                    el.id === item.id
                      ? { ...el, content: e.target.value }
                      : el
                  )
                )
              }
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                flex: 1,
              }}
            />
          ) : (
            <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
              {item.content}
            </span>
          )}

          <div>
            {editId === item.id ? (
              <button
                style={{
                  margin: "0 0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4CAF50",  // Green button for save
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.3s",
                }}
                onClick={() => saveEdit(item.id, item.content)}
              >
                Save
              </button>
            ) : (
              <button
                style={{
                  margin: "0 0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f0ad4e",  // Yellow for Edit
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.3s",
                }}
                onClick={() => enableEditing(item.id)}
              >
                Edit
              </button>
            )}
            <button
              style={{
                margin: "0 0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#d9534f",  // Red for Delete
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background-color 0.3s",
              }}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add new item section */}
      <div style={{ marginTop: "2rem" }}>
        <input
          type="text"
          value={newContent}
          placeholder="Add new item"
          onChange={(e) => setNewContent(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1.2rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "1rem",
            width: "80%",
          }}
        />
        <button
          onClick={addItem}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#5bc0de",  // Light blue for Add button
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1.2rem",
            transition: "background-color 0.3s",
          }}
        >
          Add
        </button>
      </div>
    </div>
  </div>
);

};

export default MenuItemsPage;
