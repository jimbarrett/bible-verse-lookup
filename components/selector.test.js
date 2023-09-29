import Selector from "./Selector";
import {
  fireEvent,
  render,
  screen,
  within,
  act,
} from "../node_modules/@testing-library/react";

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponse("[]");
});

describe("Selector component", () => {
  const selFunction = jest.fn();
  const items = [
    { order: 1, title_short: "One", chapters: 1 },
    { order: 2, title_short: "Two", chapters: 2 },
    { order: 3, title_short: "Three", chapters: 3 },
  ];
  const params = {
    label: "Label",
    items,
    value_field: "order",
    label_field: "title_short",
    select: selFunction,
  };

  it("renders", async () => {
    await act(() => {
      render(<Selector {...params} />);
    });
    expect(await screen.getByText("Label")).toBeInTheDocument();
  });

  it("renders dropdown on click", async () => {
    await act(() => {
      const container = render(<Selector {...params} />);
    });
    fireEvent.click(screen.getByText("Label"));
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("calls callback on list item click", async () => {
    await act(() => {
      const container = render(<Selector {...params} />);
    });
    fireEvent.click(screen.getByText("Label"));
    const dropdownBox = await screen.getByTestId("dropdown");
    fireEvent.click(await within(dropdownBox).getByText("Two"));
    expect(selFunction).toHaveBeenCalledWith(2, "Two");
  });
});
