import Verse from "./Verse";
import { render, screen, act } from "../../node_modules/@testing-library/react";
import { singleVerse, versesNextBook, versesNextChapter } from "@data/verse";

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
