import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { Header } from "../header";

describe("Components", () => {
  describe("Header", () => {
    it("renders site title", () => {
      render(<Header />);
      expect(screen.getByText("电影评分平台")).toBeInTheDocument();
    });

    it("renders login button", () => {
      render(<Header />);
      expect(screen.getByRole("button", { name: /登录/i })).toBeInTheDocument();
    });
  });
});
