"use client";
import { BibleContext } from "@app/context/BibleContext";
import { LookupContext } from "@app/context/LookupContext";
import { useContext, useEffect } from "react";
import PlainSelector from "./PlainSelector";

const ComparisonSelector = () => {
  const { versions, selectedVersion, compareVersion, setCompareVersion } =
    useContext(BibleContext);

  useEffect(() => {
    if (!compareVersion.version) setCompareVersion(selectedVersion);
  }, []);

  const doVersionSelect = async (data) => {
    setCompareVersion(data);
  };

  return (
    <>
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
