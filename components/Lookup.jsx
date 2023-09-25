"use client";
import { useState, useEffect } from "react";

const Lookup = () => {
  const [books, setBooks] = useState(null);
  const [chapters, setChapters] = useState(0);
  const [verses, setVerses] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState(null);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.items);
        setLoading(false);
      });
  }, []);

  const bookSelector = () => {
    return (
      <select
        value={selectedBook}
        className="bcvSelector"
        onChange={(e) => {
          selectBook(parseInt(e.target.value));
        }}
      >
        <option value="0">Book...</option>
        {books.map((book, index) => {
          return (
            <option
              key={book.order}
              value={index + 1}
              //   onClick={() => selectBook(parseInt(book.order))}
            >
              {book.title_short}
            </option>
          );
        })}
      </select>
    );
  };

  const chapterSelector = () => {
    let options = [];
    options.push(
      <option value="0" key="0">
        Chapter...
      </option>
    );
    for (let i = 1; i <= chapters; i++) {
      options.push(
        <option value={i} key={i}>
          Chapter {i}
        </option>
      );
    }
    if (chapters > 0) {
      return (
        <select
          value={selectedChapter}
          className="bcvSelector"
          onChange={(e) => {
            selectChapter(parseInt(e.target.value));
          }}
        >
          {options}
        </select>
      );
    }
  };
  const verseSelector = () => {
    let options = [];
    options.push(
      <option value="0" key="0">
        Verse...
      </option>
    );
    for (let i = 1; i <= verses; i++) {
      options.push(
        <option value={i} key={i}>
          Verse {i}
        </option>
      );
    }
    if (verses > 0) {
      let sv = 0;
      if (selectedVerse?.v) sv = selectedVerse.v;
      return (
        <select
          value={sv}
          className="bcvSelector"
          onChange={(e) => {
            selectVerse(parseInt(e.target.value));
          }}
        >
          {options}
        </select>
      );
    }
  };

  const selectBook = (index) => {
    // this gets weird because the book at index 0
    // has order = 1 and order is being used for lookups, etc.
    setChapters(books[index - 1].chapters);
    setSelectedBook(books[index - 1].order);
    setSelectedChapter(0);
    setVerses(0);
    setSelectedVerse(null);
  };

  const selectChapter = async (c) => {
    let verse_count = await getVerseCount(selectedBook, c);
    setSelectedChapter(c);
    setVerses(verse_count.count);
    setSelectedVerse(null);
  };

  const selectVerse = async (v) => {
    let verse = await getSelectedVerse(selectedBook, selectedChapter, v);
    setSelectedVerse(verse.verse);
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
    setSelectedChapter(verse.verse.c);
    setSelectedVerse(verse.verse);
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
      <div className="columns-3 w-full text-xl">
        <div>{bookSelector()}</div>
        <div>{chapterSelector()}</div>
        <div>{verseSelector()}</div>
      </div>
      {outputVerse()}
    </div>
  );
};

export default Lookup;
