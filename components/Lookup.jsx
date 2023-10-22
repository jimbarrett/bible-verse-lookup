"use client";
import { useState, useContext, useEffect } from "react";
import Selector from "./Selector";
import VerseOutput from "./VerseOutput";
import { BibleContext } from "@app/context/BibleContext";
import { LookupContext } from "@app/context/LookupContext";
import { defaultLabels } from "@app/data/defaultLabels";
import LookupBar from "./LookupBar";

const findBooks = async () => {
  const response = await fetch("/api/books");
  const res = await response.json();
  return res;
};

const Lookup = () => {
  const { currentVersion } = useContext(BibleContext);
  const {
    selectors,
    setSelectors,
    currentSelection,
    setCurrentSelection,
    labels,
    setLabels,
    perPage,
  } = useContext(LookupContext);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    findBooks()
      .then((data) => setSelectors({ ...selectors, books: data.items }))
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (
      currentSelection.book &&
      currentSelection.chapter &&
      currentSelection.verse
    ) {
      selectVerse(
        currentSelection.verse[0].v,
        "Verse " + currentSelection.verse[0].v
      );
    }
  }, [currentVersion, perPage]);

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
    let params = { b, c, v, version: currentVersion.table, take: perPage };
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
    const referenceID =
      direction == "prev"
        ? currentSelection.verse[0].id
        : currentSelection.verse[currentSelection.verse.length - 1].id;
    let params = {
      direction,
      from: referenceID,
      version: currentVersion.table,
      take: perPage,
    };
    let response = await fetch("/api/verse/slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let jsonVerse = await response.json();
    // TODO :
    // have to manually sort these as I couldn't find a way to do this sensibly in sql
    // find a better way.
    if (direction == "prev") {
      jsonVerse.verse.sort((a, b) => {
        return a.id > b.id;
      });
    }
    let verses = jsonVerse.verse;
    let verse_count = await getVerseCount(verses[0].b, verses[0].c);

    setSelectors({ ...selectors, verses: verse_count.count });
    setCurrentSelection({
      ...currentSelection,
      book: verses[0].b,
      chapter: verses[0].c,
      verse: verses,
    });
    setLabels({
      book: verses[0].title_short,
      chapter: "Chapter " + verses[0].c,
      verse: "Verse " + verses[0].v,
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
    <div className="px-4">
      <LookupBar />
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
