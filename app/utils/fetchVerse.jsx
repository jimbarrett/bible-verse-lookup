export const lookupVerse = async (b, c, v, table) => {
  let params = { b, c, v, version: table, take: perPage };
  let response = await fetch("/api/verse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  let verse = await response.json();
  return verse.verse;
};

export const slideVerse = async (direction) => {
  const referenceID =
    direction == "prev"
      ? currentSelection.verse[0].id
      : currentSelection.verse[currentSelection.verse.length - 1].id;
  let params = {
    direction,
    from: referenceID,
    version: selectedVersion.table,
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

  // If we have a comparison we have to do this whole thing over again.
  // TODO : Fix this!
  if (compareVersion) {
    console.log("compare");
    let params = {
      direction,
      from: referenceID,
      version: compareVersion.table,
      take: perPage,
    };
    let response = await fetch("/api/verse/slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    let jsonVerse = await response.json();
    if (direction == "prev") {
      jsonVerse.verse.sort((a, b) => {
        return a.id > b.id;
      });
    }
    let compVerses = jsonVerse.verse;
    setCompareSelection({
      ...compareSelection,
      book: compVerses[0].b,
      chapter: compVerses[0].c,
      verse: compVerses,
    });
    console.log(compareSelection);
  }
};
