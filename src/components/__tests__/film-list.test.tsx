import { Film } from "@/types";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { FilmList } from "../film-list";

describe("FilmList", () => {
  const mockFilms: Film[] = [
    {
      id: "1",
      movieName: "Test Movie 1",
      des: "A test movie description",
      sort: ["Action"],
      publichTime: 1672531200000,
      commentCount: 10,
      totalCommentNum: 45,
      fraction: 4.5,
      posterUrl: "/test-poster-1.jpg",
    },
    {
      id: "2",
      movieName: "Test Movie 2",
      des: "Another test movie description",
      sort: ["Comedy"],
      publichTime: 1672531200000,
      commentCount: 5,
      totalCommentNum: 20,
      fraction: 4.0,
      posterUrl: "/test-poster-2.jpg",
    },
  ];

  it("renders film list", () => {
    render(<FilmList films={mockFilms} loading={false} />);
    expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
  });

  it("renders loading skeleton", () => {
    render(<FilmList films={[]} loading={true} />);
    expect(
      document.querySelectorAll(".chakra-skeleton").length
    ).toBeGreaterThan(0);
  });

  it("renders error message", () => {
    render(<FilmList films={[]} loading={false} error="加载失败" />);
    expect(screen.getByText("加载失败")).toBeInTheDocument();
  });

  it("renders empty message", () => {
    render(<FilmList films={[]} loading={false} />);
    expect(screen.getByText(/暂无电影数据/)).toBeInTheDocument();
  });
});
