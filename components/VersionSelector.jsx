"use client";
import { BibleContext } from "@app/context/BibleContext";
import { useContext, useEffect, useState } from "react";
import PlainSelector from "./PlainSelector";

const fetchVersions = async () => {
  const response = await fetch("/api/versions", { cache: "no-store" });
  const res = await response.json();
  return res;
};

const VersionSelector = () => {
  const { versions, setVersions, currentVersion, setCurrentVersion, books } =
    useContext(BibleContext);

  useEffect(() => {
    if (versions.length < 1) {
      fetchVersions().then((data) => setVersions(data.versions));
    }
  }, []);

  const doVersionSelect = (data) => {
    setCurrentVersion(data);
  };

  return (
    <PlainSelector
      value={currentVersion.version}
      items={versions}
      value_field="id"
      label_field="version"
      select={doVersionSelect}
    />
  );
};

export default VersionSelector;
