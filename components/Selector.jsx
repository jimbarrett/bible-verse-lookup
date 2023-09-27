"use client";

import { useState } from "react";

const Selector = ({ label, items, value_field, label_field, select }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative w-1/3">
      <div
        className="bcvSelector"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {label}{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
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
