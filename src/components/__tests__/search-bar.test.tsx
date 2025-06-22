import { Film } from "@/types";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../test/test-utils";
import { SearchBar } from "../search-bar";

describe("SearchBar", () => {
  const mockFilms: Film[] = [
    {
      id: "1",
      movieName: "Action Movie",
      des: "",
      sort: ["Action"],
      publichTime: 0,
      commentCount: 0,
      totalCommentNum: 0,
      fraction: 0,
      posterUrl: "",
    },
    {
      id: "2",
      movieName: "Comedy Movie",
      des: "",
      sort: ["Comedy"],
      publichTime: 0,
      commentCount: 0,
      totalCommentNum: 0,
      fraction: 0,
      posterUrl: "",
    },
  ];
  const mockOnSearch = vi.fn();
  const mockOnSortChange = vi.fn();

  it("renders input and button", () => {
    render(
      <SearchBar
        films={mockFilms}
        onSearch={mockOnSearch}
        selectedSort=""
        onSortChange={mockOnSortChange}
      />
    );
    const inputs = screen.getAllByPlaceholderText(/搜索电影/);
    expect(inputs.length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /搜索/i })).toBeInTheDocument();
  });

  it("calls onSearch when button clicked", () => {
    render(
      <SearchBar
        films={mockFilms}
        onSearch={mockOnSearch}
        selectedSort=""
        onSortChange={mockOnSortChange}
      />
    );
    const inputs = screen.getAllByPlaceholderText(/搜索电影/);
    fireEvent.change(inputs[0], { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /搜索/i }));
    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("calls onSortChange when select changed", () => {
    render(
      <SearchBar
        films={mockFilms}
        onSearch={mockOnSearch}
        selectedSort=""
        onSortChange={mockOnSortChange}
      />
    );
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "Action" },
    });
    expect(mockOnSortChange).toHaveBeenCalledWith("Action");
  });
});
