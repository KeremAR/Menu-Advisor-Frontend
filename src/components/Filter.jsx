"use client"
import React, { useState } from 'react';

function Filter() {
  const [selectedCategory, setSelectedCategory] = useState('Drinks');
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col items-start space-y-6 md:w-[800px] lg:w-[1000px] xl:w-[1200px]">
      <div className="text-lg font-bold mb-4">Categories</div>
      <div className="mb-4">
        <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 mr-3 px-4 rounded-full mb-2 text-left" onClick={() => handleCategoryChange('Drinks')}>
          Coffees
        </button>
        <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full mb-2 text-left" onClick={() => handleCategoryChange('Foods')}>
          Foods
        </button>
      </div>
      <div className="space-x-4">
        {selectedCategory === 'Drinks' && (
          <>
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Cold Coffees
            </button>
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Hot Coffees
            </button>
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Milkshakes
            </button>
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Frozens
            </button>
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Frappucinos
            </button>
          </>
        )}
        {selectedCategory === 'Foods' && (
          <>
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Deserts
            </button>
            
            <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-full text-left">
              Sandwiches
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Filter;
