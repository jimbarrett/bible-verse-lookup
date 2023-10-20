"use client";

import { useState } from "react";
import { createContext } from "react";
export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const [version, setVersion] = useState("t_kjv");
  const [books, setBooks] = useState([]);

  return (
    <BibleContext.Provider
      value={{
        version,
        setVersion,
        books,
        setBooks,
      }}
    >
      <div>{children}</div>
    </BibleContext.Provider>
  );
};
