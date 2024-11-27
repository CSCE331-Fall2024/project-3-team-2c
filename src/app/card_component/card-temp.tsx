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

export const CardTemp: React.FC<SquareBlockProps> = ({
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
