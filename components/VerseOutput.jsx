import { LookupContext } from "@app/context/LookupContext";
import { useContext } from "react";

const VerseOutput = ({ slideVerse }) => {
  const { currentSelection, setCurrentSelection } = useContext(LookupContext);

  if (currentSelection.verse) {
    return (
      <div
        className="w-full border-2 border-green-500 border-t-0 p-4 text-base rounded rounded-t-none"
        data-testid="versewrapper"
      >
        <div className="text-sm font-mono border-b border-gray-400 mb-3 flex-between">
          <div className="font-bold">
            {currentSelection.verse.title_short} {currentSelection.verse.c}:
            {currentSelection.verse.v}
          </div>
          <div className="flex gap-3">
            {currentSelection.verse.id > 1001001 && (
              <button
                type="button"
                className="slideButton"
                onClick={() => slideVerse("prev")}
              >
                prev
              </button>
            )}
            {currentSelection.verse.id < 66022021 && (
              <button
                type="button"
                className="slideButton"
                onClick={() => slideVerse("next")}
              >
                next
              </button>
            )}
          </div>
        </div>
        {currentSelection.verse.t}
      </div>
    );
  }
};

export default VerseOutput;
