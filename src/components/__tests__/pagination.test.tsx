import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../test/test-utils";
import { Pagination } from "../pagination";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();
  const mockOnPageSizeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pagination controls", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );
    expect(screen.getByRole("button", { name: /上一页/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /下一页/i })).toBeInTheDocument();
  });

  it("calls onPageChange when next/prev clicked", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /上一页/i }));
    fireEvent.click(screen.getByRole("button", { name: /下一页/i }));
    expect(mockOnPageChange).toHaveBeenCalled();
  });
});
