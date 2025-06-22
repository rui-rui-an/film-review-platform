import { Film } from "@/types";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { FilmCard } from "../film-card";

describe("FilmCard", () => {
  const mockFilm: Film = {
    id: "1",
    movieName: "Test Movie",
    des: "A test movie description",
    sort: ["Action", "Adventure"],
    publichTime: 1672531200000,
    commentCount: 10,
    totalCommentNum: 45,
    fraction: 4.5,
    posterUrl: "/test-poster.jpg",
  };

  it("renders film information correctly", () => {
    render(<FilmCard film={mockFilm} />);
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("A test movie description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });
});
