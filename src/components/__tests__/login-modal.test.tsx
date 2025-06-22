import { AuthProvider } from "@/hooks/useAuth";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginModal } from "../login-modal";

// Mock the API client
vi.mock("@/lib/api", () => ({
  apiClient: {
    login: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("LoginModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders login modal", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    expect(screen.getByText("用户登录")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入用户名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入密码")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登录" })).toBeInTheDocument();
  });

  it("has default values for username and password", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      "请输入用户名"
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "请输入密码"
    ) as HTMLInputElement;

    expect(usernameInput.value).toBe("bob");
    expect(passwordInput.value).toBe("123456");
  });

  it("updates input values when user types", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const usernameInput = screen.getByPlaceholderText("请输入用户名");
    const passwordInput = screen.getByPlaceholderText("请输入密码");

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "newpass" } });

    expect(usernameInput).toHaveValue("newuser");
    expect(passwordInput).toHaveValue("newpass");
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const closeButton = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("shows error message on login failure", async () => {
    const { apiClient } = await import("@/lib/api");
    (apiClient.login as any).mockRejectedValue(new Error("Login failed"));

    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const loginButton = screen.getByRole("button", { name: "登录" });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText("登录失败，请检查用户名和密码")
      ).toBeInTheDocument();
    });
  });

  it("calls onSuccess and onClose on successful login", async () => {
    const { apiClient } = await import("@/lib/api");
    (apiClient.login as any).mockResolvedValue({
      id: "1",
      username: "bob",
      email: "bob@example.com",
    });

    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const loginButton = screen.getByRole("button", { name: "登录" });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("disables login button during submission", async () => {
    const { apiClient } = await import("@/lib/api");
    (apiClient.login as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const loginButton = screen.getByRole("button", { name: "登录" });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent("登录中...");
  });

  it("requires username and password fields", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <AuthProvider>
          <LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />
        </AuthProvider>
      </ChakraProvider>
    );

    const usernameInput = screen.getByPlaceholderText("请输入用户名");
    const passwordInput = screen.getByPlaceholderText("请输入密码");

    expect(usernameInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
  });
});
