"use client";
import React, { useState, useEffect } from "react";
import { Card } from "~/app/card_component/Card";
import { api } from "~/trpc/react";

interface Item {
  id: number;
  name: string;
  type: string;
}

export default function menuItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newContent, setNewContent] = useState<string>("");
  const [newType, setNewType] = useState<string>("entree");
  const [editId, setEditId] = useState<number | null>(null);

  const { data, refetch } = api.menu.getAllMenuItems.useQuery();

  // Sync items state with query data
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const enableEditing = (id: number) => {
    setEditId(id);
  };

  const deleteMutation = api.menu.deleteMenuItem.useMutation();
  const deleteItem = async (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        refetch(); // Refresh the list after deletion
      },
    });
  };

  const updateMutation = api.menu.updateMenuItem.useMutation();
  const saveEdit = async (id: number, newContent: string) => {
    updateMutation.mutate(
      { id, name: newContent },
      {
        onSuccess: () => {
          refetch(); // Refresh the list after update
          setEditId(null);
        },
      }
    );
  };

  const addMutation = api.menu.addMenuItem.useMutation();
  const addItem = async () => {
    if (newContent.trim() !== "") {
      addMutation.mutate(
        { name: newContent, type: newType },
        {
          onSuccess: () => {
            refetch(); // Refresh the list after addition
            setNewContent("");
            setNewType("entree");
            setEditId(null);
          },
        }
      );
    }
  };

  return (
    <div>
      <header
        style={{
          backgroundColor: "red",
          padding: "1rem",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <nav>
          <a href="/" style={{ cursor: "pointer", marginRight: "1rem" }}>
            Home
          </a>
          <a href="#employees" style={{ marginRight: "1rem" }}>
            Employees
          </a>
          <a
            href="#menu-items"
            className="mr-4 text-xl font-bold"
            style={{ marginRight: "1rem" }}
          >
            Menu Items
          </a>
          <a href="#ingredients" style={{ marginRight: "1rem" }}>
            Ingredients
          </a>
          <a href="#disposables">Disposables</a>
        </nav>
      </header>

      <div className="p-4">
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={newContent}
            placeholder="Add new item"
            onChange={(e) => setNewContent(e.target.value)}
            className="mr-2 rounded border p-2"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="mr-2 rounded border p-2"
          >
            <option value="ENTREE">Entree</option>
            <option value="DRINK">Drink</option>
            <option value="SIDE">Side</option>
          </select>
          <button
            onClick={addItem}
            className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 place-items-center gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div key={item.id}>
              <Card
                imageUrl="/dog.jpg"
                name={item.name}
                onEdit={() => enableEditing(item.id)}
                onDelete={() => deleteItem(item.id)}
                isEditing={editId === item.id}
                onSave={(newContent) => saveEdit(item.id, newContent)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
