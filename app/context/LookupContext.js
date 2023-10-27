"use client";

import { useState } from "react";
import { createContext } from "react";
export const LookupContext = createContext();
import { defaultLabels } from "@app/data/defaultLabels";
import { defaultSelections } from "@app/data/defaultSelections";

export const LookupProvider = ({ children }) => {
  const [selectors, setSelectors] = useState({
    books: [],
    chapters: 0,
    verses: 0,
  });
  const [currentSelection, setCurrentSelection] = useState(defaultSelections);
  const [labels, setLabels] = useState(defaultLabels);
  const [perPage, setPerPage] = useState(1);
  const [compareActive, setCompareActive] = useState(false);

  return (
    <LookupContext.Provider
      value={{
        selectors,
        setSelectors,
        currentSelection,
        setCurrentSelection,
        labels,
        setLabels,
        perPage,
        setPerPage,
        compareActive,
        setCompareActive,
      }}
    >
      <div>{children}</div>
    </LookupContext.Provider>
  );
};
