import PlainSelector from ".";
import {
  fireEvent,
  render,
  screen,
  within,
  act,
} from "../../node_modules/@testing-library/react";

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponse("[]");
});

describe("Plain Selector component", () => {
  const selFunction = jest.fn();
  const items = [
    { order: 1, title_short: "One" },
    { order: 2, title_short: "Two" },
    { order: 3, title_short: "Three" },
  ];
  const params = {
    value: "One",
    items,
    value_field: "order",
    label_field: "title_short",
    select: selFunction,
  };

  it("renders", async () => {
    await act(() => {
      render(<PlainSelector {...params} />);
    });
    expect(await screen.getByText("One")).toBeInTheDocument();
  });

  it("renders dropdown on click", async () => {
    await act(() => {
      const container = render(<PlainSelector {...params} />);
    });
    fireEvent.click(screen.getByText("One"));
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("selector backdrop is displayed when the dropdown is active", async () => {
    await act(() => {
      const container = render(<PlainSelector {...params} />);
    });
    fireEvent.click(screen.getByText("One"));
    expect(screen.getByTestId("selector-backdrop")).toBeInTheDocument();
  });

  it("clicking selector backdrop closes the dropdown", async () => {
    await act(() => {
      const container = render(<PlainSelector {...params} />);
    });
    fireEvent.click(screen.getByText("One"));
    fireEvent.click(screen.getByTestId("selector-backdrop"));
    expect(screen.queryByTestId("dropdown")).toBe(null);
    expect(screen.queryByTestId("selector-backdrop")).toBe(null);
  });

  it("calls callback on list item click", async () => {
    await act(() => {
      const container = render(<PlainSelector {...params} />);
    });
    fireEvent.click(screen.getByText("One"));
    const dropdownBox = await screen.getByTestId("dropdown");
    fireEvent.click(await within(dropdownBox).getByText("Two"));
    expect(selFunction).toHaveBeenCalledWith({ order: 2, title_short: "Two" });
  });
});
