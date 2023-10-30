"use client";
import { BibleContext } from "@app/context/BibleContext";
import { LookupContext } from "@app/context/LookupContext";
import { useContext, useEffect } from "react";
import PlainSelector from "@components/PlainSelector";

const ComparisonSelector = () => {
  const { versions, selectedVersion, compareVersion, setCompareVersion } =
    useContext(BibleContext);
  const { setCompareActive } = useContext(LookupContext);

  useEffect(() => {
    if (!compareVersion.version) setCompareVersion(selectedVersion);
  }, []);

  const doVersionSelect = async (data) => {
    setCompareVersion(data);
  };

  const toggleCompare = () => {
    setCompareActive((prev) => !prev);
  };

  return (
    <>
      <label className="pr-2 text-xs italic">
        Compare Version{" "}
        <span
          onClick={toggleCompare}
          className="text-xs italic text-blue-600 hover:text-blue-400 cursor-pointer ml-1 hover:underline"
        >
          (Cancel)
        </span>
      </label>
      <PlainSelector
        value={compareVersion.version}
        items={versions}
        value_field="id"
        label_field="version"
        select={doVersionSelect}
      />
    </>
  );
};

export default ComparisonSelector;
