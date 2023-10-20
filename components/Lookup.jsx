"use client";
import { useState, useEffect, useContext } from "react";
import Selector from "./Selector";
import { BibleContext } from "@app/context/BibleContext";

const findBooks = async () => {
  const response = await fetch("/api/books");

  const res = await response.json();
  return res;
};

const Lookup = () => {
  const { books, setBooks, selectors, setSelectors } = useContext(BibleContext);
  const [currentSelection, setCurrentSelection] = useState({
    book: 0,
    chapter: 0,
    verse: 0,
  });
  const [isLoading, setLoading] = useState(true);
  const [bookLabel, setBookLabel] = useState("Book...");
  const [chapterLabel, setChapterLabel] = useState("Chapter...");
  const [verseLabel, setVerseLabel] = useState("Verse...");

  useEffect(() => {
    findBooks()
      .then((data) => setSelectors({ ...selectors, books: data.items }))
      .then(() => setLoading(false));
  }, []);

  const selectBook = (order, label) => {
    // this gets weird because the book at index 0
    // has order = 1 and order is being used for lookups, etc.
    setSelectors({
      ...selectors,
      chapters: selectors.books[order - 1].chapters,
      verses: 0,
    });
    setCurrentSelection({
      ...currentSelection,
      book: selectors.books[order - 1].order,
      chapter: 0,
      verse: 0,
    });
    setBookLabel(label);
    setChapterLabel("Chapter...");
  };

  const selectChapter = async (c, label) => {
    let verse_count = await getVerseCount(currentSelection.book, c);
    setCurrentSelection({ ...currentSelection, chapter: c, verse: 0 });
    setSelectors({ ...selectors, verses: verse_count.count });
    setChapterLabel(label);
    setVerseLabel("Verse...");
  };

  const selectVerse = async (v, label) => {
    let verse = await getSelectedVerse(
      currentSelection.book,
      currentSelection.chapter,
      v
    );
    setCurrentSelection({ ...currentSelection, verse: verse.verse });
    setVerseLabel(label);
  };

  const formatChapters = (chapterCount) => {
    let chapterArr = [];
    for (let i = 1; i <= chapterCount; i++) {
      chapterArr.push({ order: i, label: "Chapter " + i });
    }
    return chapterArr;
  };

  const formatVerses = (verseCount) => {
    let verseArr = [];
    for (let i = 1; i <= verseCount; i++) {
      verseArr.push({ order: i, label: "Verse " + i });
    }
    return verseArr;
  };

  const getSelectedVerse = async (b, c, v) => {
    let params = { b, c, v };
    let response = await fetch("/api/verse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let verse = await response.json();
    return verse;
  };

  const getVerseCount = async (book, chapter) => {
    let params = { b: book, c: chapter };
    let response = await fetch("/api/verse/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let verse_count = await response.json();
    return verse_count;
  };

  const slideVerse = async (direction) => {
    let params = { direction, from: currentSelection.verse.id };
    let response = await fetch("/api/verse/slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let verse = await response.json();
    let verse_count = await getVerseCount(verse.verse.b, verse.verse.c);

    setSelectors({ ...selectors, verses: verse_count.count });
    setCurrentSelection({
      ...currentSelection,
      book: verse.verse.b,
      chapter: verse.verse.c,
      verse: verse.verse,
    });
    setBookLabel(verse.verse.title_short);
    setChapterLabel("Chapter " + verse.verse.c);
    setVerseLabel("Verse " + verse.verse.v);
  };

  const outputVerse = () => {
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

  if (isLoading)
    return (
      <div className="text-xl text-green-600 p-4" data-testid="loading">
        Loading...
      </div>
    );
  if (!selectors.books.length)
    return (
      <div className="text-xl text-green-600 p-4" data-testid="booknotfound">
        No Books Found
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex gap-3 w-full text-lg" data-testid="selectors">
        <Selector
          label={bookLabel}
          items={selectors.books}
          value_field="order"
          label_field="title_short"
          select={selectBook}
        />
        {selectors.chapters > 0 && (
          <Selector
            label={chapterLabel}
            items={formatChapters(selectors.chapters)}
            value_field="order"
            label_field="label"
            select={selectChapter}
          />
        )}
        {selectors.verses > 0 && (
          <Selector
            label={verseLabel}
            items={formatVerses(selectors.verses)}
            value_field="order"
            label_field="label"
            select={selectVerse}
          />
        )}
      </div>
      {outputVerse()}
    </div>
  );
};

export default Lookup;
