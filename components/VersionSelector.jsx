"use client";
import { BibleContext } from "@app/context/BibleContext";
import { useContext, useEffect, useState } from "react";

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

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <>
      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-0 bottom-0 bg-transparent z-10"
          onClick={toggleDropdown}
        ></div>
      )}
      <div className="px-4 w-full flex justify-end relative">
        <div className="w-1/5" onClick={toggleDropdown}>
          <div className="p-2 border border-gray-200 rounded cursor-pointer flex items-center gap-2 text-gray-600 w-full justify-between z-20">
            {currentVersion.version || "Select a Version"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          {showDropdown && (
            <div className="absolute top-full z-20 bg-white border border-gray-400 p-2">
              {versions.map((version) => {
                return (
                  <div
                    className="w-full p-1 cursor-pointer hover:bg-gray-300"
                    key={version.id}
                    onClick={() =>
                      setCurrentVersion({
                        table: version.table,
                        version: version.version,
                      })
                    }
                  >
                    {version.version}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VersionSelector;
