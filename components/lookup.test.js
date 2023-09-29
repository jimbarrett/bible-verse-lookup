import Lookup from "@components/Lookup";
import { render, screen, act } from "../node_modules/@testing-library/react";

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponse("[]");
});

describe("Lookup component", () => {
  it("renders with no books", async () => {
    fetch.mockResponse(JSON.stringify({ items: [] }));

    await act(() => {
      render(<Lookup />);
    });
    await screen.getByTestId("booknotfound");
  });

  it("renders with books returned", async () => {
    const booksFound = [
      {
        order: 1,
        title_short: "Genesis",
        chapters: 50,
      },
    ];
    fetch.mockResponse(JSON.stringify({ items: booksFound }));
    await act(() => {
      render(<Lookup />);
    });

    expect(await screen.getByText("Book...")).toBeInTheDocument();
  });
});
