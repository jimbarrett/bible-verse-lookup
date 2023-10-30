"use client";

import { LookupContext } from "@app/context/LookupContext";
import VersionSelector from "@components/VersionSelector";
import { useContext } from "react";
import PerPageSelector from "@components/PerPageSelector";
import ComparisonSelector from "@components/ComparisonSelector";

const LookupBar = () => {
  const { compareActive, setCompareActive, currentSelection } =
    useContext(LookupContext);

  const toggleCompare = () => {
    setCompareActive((prev) => !prev);
  };

  const showCompareVersion = () => {
    if (currentSelection.verse < 1) {
      return "";
    } else if (compareActive) {
      return <ComparisonSelector />;
    }
    return (
      <div
        className="text-xs italic underline text-blue-600 hover:text-blue-400 font-bold cursor-pointer"
        onClick={toggleCompare}
      >
        Select a version to compare
      </div>
    );
  };

  return (
    <div className="w-full flex justify-between pb-4 items-end ">
      <div className="w-2/5 flex items-end gap-3">
        <div className="w-1/2">
          <VersionSelector />
        </div>
        <div className="w-1/2">{showCompareVersion()}</div>
      </div>
      <div className="max-w-1/2">
        <PerPageSelector />
      </div>
    </div>
  );
};

export default LookupBar;
