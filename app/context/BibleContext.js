"use client";

import { useState } from "react";
import { createContext } from "react";
export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState({
    version: "King James Version",
    table: "t_kjv",
  });

  return (
    <BibleContext.Provider
      value={{
        currentVersion,
        setCurrentVersion,
        versions,
        setVersions,
      }}
    >
      <div>{children}</div>
    </BibleContext.Provider>
  );
};
