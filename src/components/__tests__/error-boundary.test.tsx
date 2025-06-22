import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { ErrorBoundary } from "../error-boundary";

// 测试用组件，抛出错误
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Normal component</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Normal component")).toBeInTheDocument();
  });

  it("catches error and renders fallback UI", () => {
    // 屏蔽错误输出
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/出现了一些问题/)).toBeInTheDocument();
  });
});
