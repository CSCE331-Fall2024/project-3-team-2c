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

export const Card: React.FC<SquareBlockProps> = ({ imageUrl, name, onEdit, onDelete, isEditing, onSave }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [editContent, setEditContent] = useState(name);

    return (
        <div
            className="relative flex flex-col items-center justify-start w-48 h-48 border rounded-lg shadow-md p-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image src={imageUrl} alt="Food Picture Here" width={64} height={96} className="mb-4" />

            {isEditing ? (
                <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full text-center border rounded mb-6"
                />
            ) : (
                <p className="text-center font-bold text-gray-700 mb-6">{name}</p>
            )}

            {isHovered && (
                <div className="absolute bottom-2 flex space-x-2">
                    {isEditing ? (
                        <button
                            onClick={() => onSave(editContent)}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={onEdit}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};