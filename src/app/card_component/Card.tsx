import React, { useState } from "react";
import Image from "next/image";

interface SquareBlockProps {
  imageUrl: string;
  name: string;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSave: (newName: string) => void;
}

/**
 * Card Component
 * 
 * This component represents a reusable square block UI element with an image, name, 
 * and action buttons (Edit, Save, Delete). It supports both viewing and editing modes.
 * 
 * **Props:**
 * - `imageUrl` (string): URL of the image to display.
 * - `name` (string): The name or title displayed on the card.
 * - `onEdit` (function): Callback triggered when the "Edit" button is clicked.
 * - `onDelete` (function): Callback triggered when the "Delete" button is clicked.
 * - `isEditing` (boolean): Determines whether the card is in editing mode.
 * - `onSave` (function): Callback triggered when the "Save" button is clicked, passing the edited content as an argument.
 * 
 * **Features:**
 * - Displays an image and name in the default view.
 * - Allows editing the name in editing mode.
 * - Hover state reveals action buttons for editing or deleting.
 * - Responsive to user interactions via callback props.
 * 
 * @returns {JSX.Element} A styled card component with interactive functionality.
 */
export const Card: React.FC<SquareBlockProps> = ({
  imageUrl,
  name,
  onEdit,
  onDelete,
  isEditing,
  onSave,
}) => {
  console.log("Card Props:", { name, isEditing });
  const [isHovered, setIsHovered] = useState(false);
  const [editContent, setEditContent] = useState(name);

  return (
    <div
      className="relative flex h-48 w-48 flex-col items-center justify-start rounded-lg border p-4 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={imageUrl}
        alt="Food Picture Here"
        width={64}
        height={96}
        className="mb-4"
      />

      {isEditing ? (
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="mb-6 w-full rounded border text-center"
        />
      ) : (
        <p className="mb-6 text-center font-bold text-gray-700">{name}</p>
      )}

      {isHovered && (
        <div className="absolute bottom-2 flex space-x-2">
          {isEditing ? (
            <button
              onClick={() => onSave(editContent)}
              className="rounded bg-green-500 px-3 py-1 text-sm text-white"
            >
              Save
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
            >
              Edit
            </button>
          )}
          <button
            onClick={onDelete}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
