// CustomerGrid.tsx

import React from 'react';

interface CustomerGridProps {
  onClick: (category: string) => void;
}

const CustomerGrid: React.FC<CustomerGridProps> = ({ onClick }) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <button onClick={() => onClick('bowl')} className="grid-item">Bowl</button>
      <button onClick={() => onClick('plate')} className="grid-item">Plate</button>
      <button onClick={() => onClick('biggerPlate')} className="grid-item">Bigger Plate</button>
      <button onClick={() => onClick('appetizers')} className="grid-item">Appetizers</button>
      <button onClick={() => onClick('drinks')} className="grid-item">Drinks</button>
      <button onClick={() => onClick('entrees')} className="grid-item">Entrees</button>
    </div>
  );
};

export default CustomerGrid;
