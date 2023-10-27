"use client";

import { LookupContext } from "@app/context/LookupContext";
import VersionSelector from "./VersionSelector";
import { useContext } from "react";
import PerPageSelector from "./PerPageSelector";
import ComparisonSelector from "./ComparisonSelector";

const LookupBar = () => {
  const { compareActive, setCompareActive } = useContext(LookupContext);

  const toggleCompare = () => {
    setCompareActive((prev) => !prev);
  };
  return (
    <div className="w-full flex justify-between pb-4 items-end ">
      <div className="w-2/5 flex items-end gap-3">
        <div className="w-1/2">
          <VersionSelector />
        </div>
        <div className="w-1/2">
          {compareActive ? (
            <ComparisonSelector />
          ) : (
            <div
              className="text-xs italic underline text-blue-600 hover:text-blue-400 font-bold cursor-pointer"
              onClick={toggleCompare}
            >
              Select a version to compare
            </div>
          )}
        </div>
      </div>
      <div className="max-w-1/2">
        <PerPageSelector />
      </div>
    </div>
  );
};

export default LookupBar;
