"use client";
import { useState, useContext, useEffect } from "react";
import Selector from "./Selector";
import VerseOutput from "./VerseOutput";
import { BibleContext } from "@app/context/BibleContext";
import { LookupContext } from "@app/context/LookupContext";
import { defaultLabels } from "@app/data/defaultLabels";

const findBooks = async () => {
  const response = await fetch("/api/books", { cache: "no-store" });
  const res = await response.json();
  return res;
};

const Lookup = () => {
  const { books, setBooks, currentVersion } = useContext(BibleContext);
  const {
    selectors,
    setSelectors,
    currentSelection,
    setCurrentSelection,
    labels,
    setLabels,
  } = useContext(LookupContext);
  const [isLoading, setLoading] = useState(true);

  if (selectors.books.length < 1) {
    findBooks()
      .then((data) => setSelectors({ ...selectors, books: data.items }))
      .then(() => setLoading(false));
  }

  useEffect(() => {
    if (
      currentSelection.book &&
      currentSelection.chapter &&
      currentSelection.verse
    ) {
      selectVerse(
        currentSelection.verse.v,
        "Verse " + currentSelection.verse.v
      );
    }
  }, [currentVersion]);

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
    setLabels({ ...defaultLabels, book: label });
  };

  const selectChapter = async (c, label) => {
    let verse_count = await getVerseCount(currentSelection.book, c);
    setCurrentSelection({ ...currentSelection, chapter: c, verse: 0 });
    setSelectors({ ...selectors, verses: verse_count.count });
    setLabels({ ...labels, chapter: label, verse: "Verse..." });
  };

  const selectVerse = async (v, label) => {
    let verse = await getSelectedVerse(
      currentSelection.book,
      currentSelection.chapter,
      v
    );
    setCurrentSelection({ ...currentSelection, verse });
    setLabels({ ...labels, verse: label });
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
    let params = { b, c, v, version: currentVersion.table };
    let response = await fetch("/api/verse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let verse = await response.json();
    return verse.verse;
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
    let params = {
      direction,
      from: currentSelection.verse.id,
      version: currentVersion.table,
    };
    let response = await fetch("/api/verse/slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let jsonVerse = await response.json();
    let verse = jsonVerse.verse;
    let verse_count = await getVerseCount(verse.b, verse.c);

    setSelectors({ ...selectors, verses: verse_count.count });
    setCurrentSelection({
      ...currentSelection,
      book: verse.b,
      chapter: verse.c,
      verse,
    });
    setLabels({
      book: verse.title_short,
      chapter: "Chapter " + verse.c,
      verse: "Verse " + verse.v,
    });
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
          label={labels.book}
          items={selectors.books}
          value_field="order"
          label_field="title_short"
          select={selectBook}
        />
        {selectors.chapters > 0 && (
          <Selector
            label={labels.chapter}
            items={formatChapters(selectors.chapters)}
            value_field="order"
            label_field="label"
            select={selectChapter}
          />
        )}
        {selectors.verses > 0 && (
          <Selector
            label={labels.verse}
            items={formatVerses(selectors.verses)}
            value_field="order"
            label_field="label"
            select={selectVerse}
          />
        )}
      </div>
      <VerseOutput slideVerse={slideVerse} />
    </div>
  );
};

export default Lookup;
