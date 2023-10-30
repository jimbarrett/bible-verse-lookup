import { LookupContext } from "@app/context/LookupContext";
import { BibleContext } from "@app/context/BibleContext";
import { useContext, useEffect, useState } from "react";
import Verse from "@components/Verse";

const VerseBox = ({ slideVerse }) => {
  const { currentSelection, compareActive, setCompareActive } =
    useContext(LookupContext);
  const { selectedVersion, compareVersion } = useContext(BibleContext);

  const verses = currentSelection.verse;

  const toggleCompare = () => {
    setCompareActive((prev) => !prev);
  };

  if (currentSelection.verse) {
    return (
      <div
        className="w-full border-2 border-green-500 border-t-0 p-4 text-base rounded rounded-t-none"
        data-testid="versewrapper"
      >
        <div className="text-sm font-mono border-b border-gray-400 flex-between">
          <div className="font-bold">
            {verses[0].title_short} {verses[0].c}:{verses[0].v}
            {verses.length > 1 && (
              <>
                <span className="px-1">-</span>
                {verses[verses.length - 1].title_short}{" "}
                {verses[verses.length - 1].c}:{verses[verses.length - 1].v}
              </>
            )}
          </div>
          <div className="flex gap-3">
            {verses[0].id > 1001001 && (
              <button
                type="button"
                className="slideButton"
                onClick={() => slideVerse("prev")}
                title="Previous"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            )}
            {verses[verses.length - 1].id < 66022021 && (
              <button
                type="button"
                className="slideButton"
                onClick={() => slideVerse("next")}
                title="Next"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="text-sm font-mono border-b border-gray-400 mb-3 flex py-1 items-center">
          <div className="w-1/2 p-2">{selectedVersion.version}</div>
          {compareActive && (
            <div className="w-1/2 flex flex-row items-center justify-between">
              {compareVersion.version}
              <button
                onClick={toggleCompare}
                className="toggleButtonCancel ml-2"
                title="Close Comparison"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex w-full">
          <div
            className={`flex flex-col px-1 ${
              compareActive ? "w-1/2 border-r border-green-500" : "w-full"
            }`}
          >
            <Verse items={verses} />
          </div>
          {compareActive && (
            <div className="flex flex-col w-1/2 px-1 pl-2 border-l border-green-500">
              <Verse items={verses} compared={true} />
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default VerseBox;
