import { LookupContext } from "@app/context/LookupContext";
import { useContext } from "react";

const VerseOutput = ({ slideVerse }) => {
  const { currentSelection } = useContext(LookupContext);

  const verses = currentSelection.verse;

  if (currentSelection.verse) {
    return (
      <div
        className="w-full border-2 border-green-500 border-t-0 p-4 text-base rounded rounded-t-none"
        data-testid="versewrapper"
      >
        <div className="text-sm font-mono border-b border-gray-400 mb-3 flex-between">
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
              >
                prev
              </button>
            )}
            {verses[verses.length - 1].id < 66022021 && (
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
        {verses.map((verse) => {
          return (
            <div className="inline px-1" key={verse.v}>
              <span className="font-bold italic text-xs text-gray-400 relative bottom-1">
                *
              </span>{" "}
              {verse.t}
            </div>
          );
        })}
      </div>
    );
  }
};

export default VerseOutput;
