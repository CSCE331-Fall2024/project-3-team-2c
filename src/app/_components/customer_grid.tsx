import React from 'react';

interface CustomerGridProps {
  onClick: (category: string) => void;
}

const CustomerGrid: React.FC<CustomerGridProps> = ({ onClick }) => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="grid grid-cols-3 gap-5 justify-center items-center">
        <button 
          onClick={() => onClick('bowl')} 
          className="grid-item aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-400">
          Bowl<br />$8
        </button>
        <button 
          onClick={() => onClick('plate')} 
          className="grid-item aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:g-red-400">
          Plate<br />$10
        </button>
        <button 
          onClick={() => onClick('biggerPlate')} 
          className="grid-item aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-400">
          Bigger Plate<br />$12
        </button>
        <button 
          onClick={() => onClick('appetizers')} 
          className="grid-item aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-400">
          Appetizers
        </button>
        <button 
          onClick={() => onClick('drinks')} 
          className="grid-item aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-400">
          Drinks
        </button>
        <button 
          onClick={() => onClick('entrees')} 
          className="grid-item aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-400">
          Entrees
        </button>
      </div>
    </div>
  );
};

export default CustomerGrid;
