"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Card } from "~/app/card_component/Card";
import Header from "~/app/_components/header";

interface Item {
  id: number;
  name: string;
  type: string;
}

export default function MenuItemsPage() {
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
        refetch()
          .then(() => {
            setEditId(null);
          })
          .catch((e) => {
            console.log(e);
          }); // Refresh the list after deletion
      },
    });
  };

  const updateMutation = api.menu.updateMenuItem.useMutation();
  const saveEdit = async (id: number, newContent: string) => {
    updateMutation.mutate(
      { id, name: newContent },
      {
        onSuccess: () => {
          refetch()
            .then(() => {
              setEditId(null);
            })
            .catch((e) => {
              console.log(e);
            }); // Refresh the list after update
        },
      },
    );
  };

  const addMutation = api.menu.addMenuItem.useMutation();
  const addItem = async () => {
    if (newContent.trim() !== "") {
      addMutation.mutate(
        { name: newContent, type: newType },
        {
          onSuccess: () => {
            refetch()
              .then(() => {
                // Refresh the list after addition
                setNewContent("");
                setNewType("entree");
                setEditId(null);
              })
              .catch((e) => {
                console.log(e);
              });
          },
        },
      );
    }
  };

  return (
    <div>
      {/* Header Component */}
      <Header />
  
      <div className="p-6 bg-gray-100">
        {/* New Item Input Section */}
        <div className="mb-8 flex justify-center items-center space-x-4">
          <input
            type="text"
            value={newContent}
            placeholder="Add new item"
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ENTREE">Entree</option>
            <option value="DRINK">Drink</option>
            <option value="SIDE">Side</option>
          </select>
          <button
            onClick={addItem}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
  
        {/* Menu Item Cards Grid */}
        <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="w-full max-w-xs">
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
