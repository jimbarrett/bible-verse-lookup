"use client";

import { useState } from "react";
import { createContext } from "react";
export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState({
    version: "King James Version",
    table: "t_kjv",
  });
  const [compareVersion, setCompareVersion] = useState({
    version: "Bible in Basic English",
    table: "t_bbe",
  });

  return (
    <BibleContext.Provider
      value={{
        selectedVersion,
        setSelectedVersion,
        compareVersion,
        setCompareVersion,
        versions,
        setVersions,
      }}
    >
      <div>{children}</div>
    </BibleContext.Provider>
  );
};
