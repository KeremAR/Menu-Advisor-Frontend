"use client";
import React, { useState } from "react";

const Combobox = ({ items, value, onChange, onSearch, placeholder }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (itemId) => {
    onChange(itemId === value ? "" : itemId);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border p-2 rounded w-full text-left"
      >
        {value ? items.find((item) => item.id === value)?.name : placeholder}
      </button>
      {open && (
        <div className="absolute bg-white border rounded mt-2 w-full z-10">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="border-b p-2 w-full"
          />
          <div className="max-h-32 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`p-2 cursor-pointer ${value === item.id ? "bg-gray-200" : ""}`}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="p-2">No items found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Combobox;
