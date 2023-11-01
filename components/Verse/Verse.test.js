import Verse from "./Verse";
import { render, screen, act } from "../../node_modules/@testing-library/react";

const singleVerse = [
  {
    id: 1,
    b: 1,
    title_short: "One",
    c: 1,
    v: 1,
    t: "First Verse",
    compared: "Compared First Verse",
  },
];

const versesNextChapter = [
  {
    id: 1,
    b: 1,
    title_short: "One",
    c: 1,
    v: 1,
    t: "First Verse",
    compared: "Compared First Verse",
  },
  {
    id: 2,
    b: 1,
    title_short: "One",
    c: 2,
    v: 1,
    t: "Second Verse",
    compared: "Compared Second Verse",
  },
];
const versesNextBook = [
  {
    id: 1,
    b: 1,
    title_short: "One",
    c: 2,
    v: 1,
    t: "First Verse",
    compared: "Compared First Verse",
  },
  {
    id: 2,
    b: 2,
    title_short: "Two",
    c: 1,
    v: 1,
    t: "Second First Verse",
    compared: "Compared Second First Verse",
  },
];

describe("Verse component", () => {
  it("renders single verse", async () => {
    await act(() => {
      render(<Verse items={singleVerse} />);
    });
    // doesn't display book abbr.
    expect(screen.queryByText("One")).toBe(null);
    // displays verse content
    expect(screen.getByText("First Verse")).toBeInTheDocument();
    // doesn't display compared verse content
    expect(screen.queryByText("Compared First Verse")).toBe(null);
  });

  it("renders single verse with compare text", async () => {
    await act(() => {
      render(<Verse items={singleVerse} compared={true} />);
    });
    // displays compared verse content
    expect(screen.getByText("Compared First Verse")).toBeInTheDocument();
    // doesn't display  verse content
    expect(screen.queryByText("First Verse")).toBe(null);
  });

  it("renders same book, chapter changes", async () => {
    await act(() => {
      render(<Verse items={versesNextChapter} />);
    });
    // displays chapter with verse number
    expect(screen.getByText("2:1")).toBeInTheDocument();
  });

  it("renders book changes", async () => {
    await act(() => {
      render(<Verse items={versesNextBook} />);
    });
    // displays book abbr with chapter number
    expect(screen.getByText("Two:1:1")).toBeInTheDocument();
  });
});
