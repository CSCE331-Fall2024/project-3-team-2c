import React from 'react';

interface CustomerGridProps {
  onClick: (category: string) => void;
}

const CustomerGrid: React.FC<CustomerGridProps> = ({ onClick }) => {
  return (
    <div 
      className="h-full flex justify-center items-center p-10 bg-cover bg-center border-4 border-black rounded-lg"
      style={{ 
        backgroundImage: "url('/CustomerImages/pandaexpressbg.png')",
      }}
    >
      <div className="grid grid-cols-3 gap-8 justify-center items-center bg-white p-6 rounded-xl shadow-lg">
        {[ 
          { label: 'Bowl', price: '$8', value: 'bowl' },
          { label: 'Plate', price: '$10', value: 'plate' },
          { label: 'Bigger Plate', price: '$12', value: 'biggerPlate' },
          { label: 'Appetizers', price: '', value: 'appetizers' },
          { label: 'Drinks', price: '', value: 'drinks' },
          { label: 'Entrees', price: '', value: 'entrees' },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => onClick(item.value)}
            className="grid-item flex flex-col justify-center items-center text-center aspect-w-1 aspect-h-1 p-5 bg-[#ce123c] text-white rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-400 shadow-md hover:shadow-xl"
          >
            <span className="text-lg font-semibold">{item.label}</span>
            {item.price && <span className="text-sm font-light">{item.price}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerGrid;
