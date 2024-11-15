"use client";
import React, { useState } from "react";
import { Card } from "../../card_component/card";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { TRPCUntypedClient } from "@trpc/client";

interface Item {
  id: number;
  content: string;
  type: string;
}

const MenuItemsPage: React.FC = () => {
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/manager");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Menu Items:", data.items);
        setItems(
            data.items.map((item: any) => ({
              id: item.id,
              content: item.name,
              type: item.type,
            }))
          );
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    
    fetchMenuItems();
  }, []);

  const [items, setItems] = useState<Item[]>([]);
  const [newContent, setNewContent] = useState<string>("");
  const [newType, setNewType] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  const enableEditing = (id: number) => {
    setEditId(id);
  };

  const deleteItem = async (id: number) => {
      setItems(items.filter((item) => item.id !== id));
      try{
          const response = await fetch("/api/manager", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
          });
  
          if (!response.ok) {
          throw new Error("Failed to delete a menu item");
          }
  
          const data = await response.json();
          console.log("Menu item deleted:", data);
      }
      catch(error){
          console.error("Failed to delete a menu item from the table", error);
      }
  };

  //Save an edited item
  const saveEdit = async (id: number, newContent: string) => {
      try{
          const response = await fetch("/api/manager", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: newContent, id }),
            });
  
            if (!response.ok) {
              throw new Error("Failed to update menu item");
            }
            const data = await response.json();
            console.log("Menu item updated:", data);
      }
      catch(error){
          console.error("Failed to update menu item", error);
      }
      setItems(items.map((item) => (item.id === id ? { ...item, content: newContent } : item)));
      setEditId(null); // Disable editing mode after saving
  };

  //Add a new item
  const addItem = async () => {
      if (newContent.trim() !== "") {
          try {
              console.log("name and type:", newContent, " and ", newType)
              const response = await fetch("/api/manager", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newContent, type: newType }),
              });
  
              if (!response.ok) {
                throw new Error("Failed to add menu item");
              }
              const data = await response.json();
              console.log("Menu item added:", data);
              const newItem: Item = {
                  id: data.id,
                  content: data.name,
                  type: data.type
              };
              setItems([...items, newItem]);
  
              setNewContent("");
              setNewType("entree");
              // setting Edit ID to null fixed the issue of not being able to edit right after adding a new item
              setEditId(null);
            } catch (error) {
              console.error("Error adding menu item:", error);
            }
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
        {/* Add new item section */}
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
            <option>None</option>
            <option value="ENTREE">Entree</option>
            <option value="DRINK">Drink</option>
            <option value="SIDE">Side</option>
          </select>
          <button
            // onClick={addItem}
            className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Render the list of cards */}
        <div className="grid grid-cols-1 place-items-center gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
              <Card
                  key={item.id}
                  imageUrl="/dog.jpg"
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
