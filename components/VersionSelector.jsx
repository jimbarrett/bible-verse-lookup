"use client";
import { BibleContext } from "@app/context/BibleContext";
import { useContext, useEffect } from "react";
import PlainSelector from "./PlainSelector";

const fetchVersions = async () => {
  const response = await fetch("/api/versions", { cache: "no-store" });
  const res = await response.json();
  return res;
};

const VersionSelector = () => {
  const { versions, setVersions, selectedVersion, setSelectedVersion } =
    useContext(BibleContext);

  useEffect(() => {
    if (versions.length < 1) {
      fetchVersions().then((data) => setVersions(data.versions));
    }
  }, []);

  const doVersionSelect = (data) => {
    setSelectedVersion(data);
  };

  return (
    <>
      <label className="pr-2 text-xs italic">Select Version</label>
      <PlainSelector
        value={selectedVersion.version}
        items={versions}
        value_field="id"
        label_field="version"
        select={doVersionSelect}
      />
    </>
  );
};

export default VersionSelector;
