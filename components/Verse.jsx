const Verse = ({ items, compared = false }) => {
  let out = items.map((verse) => {
    return (
      <article key={verse.id} className="pb-2">
        <span className="font-bold italic text-xs text-gray-400 relative bottom-1">
          {/* TODO this needs to be cleaned up */}
          {verse.b !== items[0].b && verse.title_short + ":"}
          {verse.c !== items[0].c && verse.c + ":"}
          {verse.v}
        </span>{" "}
        {compared ? verse.compared : verse.t}
      </article>
    );
  });
  return out;
};

export default Verse;
