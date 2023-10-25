import { LookupContext } from "@app/context/LookupContext";
import { BibleContext } from "@app/context/BibleContext";
import { useContext, useEffect, useState } from "react";
import ComparisonSelector from "./ComparisonSelector";
import Verse from "./Verse";

const VerseBox = ({ slideVerse }) => {
  const { currentSelection } = useContext(LookupContext);
  const { selectedVersion } = useContext(BibleContext);

  const [compareActive, setCompareActive] = useState(false);

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
          <div className="w-1/2 p-2">
            {selectedVersion.version}
            {!compareActive && (
              <button className="toggleButton ml-2" onClick={toggleCompare}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </button>
            )}
          </div>
          {compareActive && (
            <div className="w-1/2 flex flex-row items-center">
              <ComparisonSelector />
              <button
                onClick={toggleCompare}
                className="toggleButtonCancel ml-2"
                title="Close Comparison"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
