"use client";

import { useState } from "react";

const PlainSelector = ({ value, items, value_field, label_field, select }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      {showDropdown && (
        <div
          className="absolute top-0 bottom-0 left-0 right-0"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
      <div className="relative ">
        <div
          className="plainSelector"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          {value}{" "}
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
                  className="hover:bg-gray-200 px-3 py-1 cursor-pointer block"
                  onClick={() => {
                    select(i);
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
    </>
  );
};

export default PlainSelector;
