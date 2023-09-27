"use client";
import { useState, useEffect } from "react";
import Selector from "./Selector";

const Lookup = () => {
  const [books, setBooks] = useState(null);
  const [chapters, setChapters] = useState(0);
  const [verses, setVerses] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(0);
  const [bookLabel, setBookLabel] = useState("Book...");
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [chapterLabel, setChapterLabel] = useState("Chapter...");
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [verseLabel, setVerseLabel] = useState("Verse...");

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.items);
        setLoading(false);
      });
  }, []);

  const selectBook = (order, label) => {
    // this gets weird because the book at index 0
    // has order = 1 and order is being used for lookups, etc.
    setChapters(books[order - 1].chapters);
    setSelectedBook(books[order - 1].order);
    setBookLabel(label);
    setSelectedChapter(0);
    setVerses(0);
    setSelectedVerse(null);
  };

  const selectChapter = async (c, label) => {
    let verse_count = await getVerseCount(selectedBook, c);
    setSelectedChapter(c);
    setChapterLabel(label);
    setVerses(verse_count.count);
    setSelectedVerse(null);
  };

  const selectVerse = async (v, label) => {
    let verse = await getSelectedVerse(selectedBook, selectedChapter, v);
    setSelectedVerse(verse.verse);
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
    let params = { direction, from: selectedVerse.id };
    let response = await fetch("/api/verse/slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let verse = await response.json();
    let verse_count = await getVerseCount(verse.verse.b, verse.verse.c);

    setVerses(verse_count.count);
    setSelectedBook(verse.verse.b);
    setBookLabel(verse.verse.title_short);
    setSelectedChapter(verse.verse.c);
    setChapterLabel("Chapter " + verse.verse.c);
    setSelectedVerse(verse.verse);
    setVerseLabel("Verse " + verse.verse.v);
  };

  const outputVerse = () => {
    if (selectedVerse) {
      return (
        <div className="w-full border-2 border-green-500 border-t-0 p-4 text-xl rounded rounded-t-none">
          <div className="text-sm font-mono border-b border-gray-400 mb-3 flex-between">
            <div className="font-bold">
              {selectedVerse.title_short} {selectedVerse.c}:{selectedVerse.v}
            </div>
            <div className="flex gap-3">
              {selectedVerse.id > 1001001 && (
                <button
                  type="button"
                  className="slideButton"
                  onClick={() => slideVerse("prev")}
                >
                  prev
                </button>
              )}
              {selectedVerse.id < 66022021 && (
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
          {selectedVerse.t}
        </div>
      );
    }
  };

  if (isLoading)
    return <div className="text-xl text-green-600 p-4">Loading...</div>;
  if (!books)
    return <div className="text-xl text-green-600 p-4">No Books Found</div>;

  return (
    <div className="p-4">
      <div className="flex gap-3 w-full text-xl">
        <Selector
          label={bookLabel}
          items={books}
          value_field="order"
          label_field="title_short"
          select={selectBook}
        />
        {chapters > 0 && (
          <Selector
            label={chapterLabel}
            items={formatChapters(chapters)}
            value_field="order"
            label_field="label"
            select={selectChapter}
          />
        )}
        {verses > 0 && (
          <Selector
            label={verseLabel}
            items={formatVerses(verses)}
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
