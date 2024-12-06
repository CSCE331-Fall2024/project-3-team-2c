import { useState } from "react";

interface DisposableItem {
  id: number;
  name: string;
  quantity: number;
}



/**
 * EditDisposableItems Component
 * 
 * This component provides an interface for managing disposable items within an application.
 * It allows users to perform the following actions:
 * 
 * - **Display Items:** Shows a list of disposable items, each with a name and quantity.
 * - **Edit Quantity:** Enables users to edit the quantity of existing items.
 * - **Delete Items:** Allows users to remove items from the list.
 * - **Add New Items:** Provides a form for users to add new disposable items with a specified name and quantity.
 * 
 * **Functions:**
 * 
 * - `handleInputChange`: Updates the state for either the `newItem` or the `editingItem` based on user input.
 * - `handleSave`: Saves the changes made to an existing item's quantity and updates the `items` list accordingly.
 * - `handleDelete`: Removes an item from the `items` list based on its `id`.
 * - `handleAddItem`: Adds a new item to the `items` list after validating the input fields.
 * 
 * **Rendering:**
 * 
 * - **Item List:** Displays each disposable item with its name and quantity, along with "Edit Quantity" and "Delete" buttons.
 * - **Edit Form:** When an item is being edited, a form appears allowing the user to update the item's quantity.
 * - **Add New Item Form:** Provides input fields for adding a new disposable item with a name and quantity.
 * 
 * **User Feedback:**
 * 
 * - Alerts users upon successful addition or update of items.
 * - Validates input fields to ensure that both name and quantity are provided when adding a new item.
 * 
 * @returns {JSX.Element} The rendered EditDisposableItems component.
 */
const EditDisposableItems = () => {
  const [items, setItems] = useState<DisposableItem[]>([
    { id: 1, name: "Napkins", quantity: 10 },
    { id: 2, name: "Forks", quantity: 20 },
    { id: 3, name: "Spoons", quantity: 30 },
  ]);

  const [editingItem, setEditingItem] = useState<DisposableItem | null>(null);
  const [newItem, setNewItem] = useState<DisposableItem>({
    id: 0,
    name: "",
    quantity: 0,
  });

  const handleInputChange = (
    field: keyof DisposableItem,
    value: string | number,
    isNew = false,
  ) => {
    if (isNew) {
      setNewItem({ ...newItem, [field]: value });
    } else if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const handleSave = () => {
    if (editingItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? editingItem : item,
        ),
      );
      setEditingItem(null);
      alert("Item quantity updated successfully!");
    }
  };

  const handleDelete = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity >= 0) {
      setItems((prevItems) => [...prevItems, { ...newItem, id: Date.now() }]);
      setNewItem({ id: 0, name: "", quantity: 0 });
      alert("New item added successfully!");
    } else {
      alert("Please provide a name and quantity for the new item.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Disposable Item Management</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            <span>
              {item.name} - Quantity: {item.quantity}
            </span>
            <button
              onClick={() => setEditingItem(item)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              Edit Quantity
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              style={{ marginLeft: "10px", padding: "5px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editingItem && (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
          }}
        >
          <h2>Edit Item Quantity</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label>
            <input
              type="text"
              value={editingItem.name}
              disabled
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Quantity:</label>
            <input
              type="number"
              value={editingItem.quantity}
              onChange={(e) =>
                handleInputChange("quantity", Number(e.target.value))
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button
            onClick={handleSave}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Save
          </button>
          <button
            onClick={() => setEditingItem(null)}
            style={{
              padding: "10px 20px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid #ddd",
          paddingTop: "10px",
        }}
      >
        <h2>Add New Item</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => handleInputChange("name", e.target.value, true)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Quantity:</label>
          <input
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              handleInputChange("quantity", Number(e.target.value), true)
            }
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleAddItem}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default EditDisposableItems;
