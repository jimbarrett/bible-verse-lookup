"use client";

import { useState } from "react";
import { createContext } from "react";
export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const [version, setVersion] = useState("t_kjv");
  const [books, setBooks] = useState([]);
  const [selectors, setSelectors] = useState({
    books: [],
    chapters: 0,
    verses: 0,
  });

  return (
    <BibleContext.Provider
      value={{
        version,
        setVersion,
        books,
        setBooks,
        selectors,
        setSelectors,
      }}
    >
      <div>{children}</div>
    </BibleContext.Provider>
  );
};
