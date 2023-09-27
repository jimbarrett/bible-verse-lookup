"use client";

import { useState } from "react";

const Selector = ({ label, items, value_field, label_field, select }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <div
        className="bcvSelector"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {label}
      </div>
      {showDropdown && (
        <div className="dropDown">
          {items.map((i) => {
            return (
              <span
                key={i[value_field]}
                className="hover:bg-green-200 px-3 py-1 cursor-pointer block"
                onClick={() => {
                  select(i[value_field], i[label_field]);
                  setShowDropdown((prev) => !prev);
                }}
              >
                {i[label_field]}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Selector;
