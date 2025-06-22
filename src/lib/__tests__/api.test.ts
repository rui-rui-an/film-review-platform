import { Film, Review, User } from "@/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../api";
import { cacheManager } from "../cache";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the cache manager
vi.mock("../cache", () => ({
  cacheManager: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    getStats: vi.fn(() => ({ size: 0, keys: [] })),
  },
}));

// 工具函数：生成带 headers.get 的 mock response
function createMockResponse({
  ok = true,
  jsonData = {},
  headers = {} as Record<string, string>,
} = {}) {
  return {
    ok,
    json: async () => jsonData,
    headers: {
      get: (key: string) => headers[key],
    },
  };
}

describe("ApiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset cache
    cacheManager.clear();
    // Reset fetch mock
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getFilms", () => {
    it("fetches films successfully", async () => {
      const mockFilms: Film[] = [
        {
          id: "1",
          movieName: "Test Movie",
          des: "A test movie",
          sort: ["Action"],
          publichTime: 1672531200000,
          commentCount: 10,
          totalCommentNum: 45,
          fraction: 4.5,
          posterUrl: "/test.jpg",
        },
      ];

      // Mock response with correct structure
      mockFetch.mockResolvedValue(
        createMockResponse({
          jsonData: mockFilms,
          headers: { "X-Total-Count": "1" },
        })
      );

      const result = await apiClient.getFilms();

      expect(result.data).toEqual(mockFilms);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it("handles search parameters", async () => {
      const mockFilms: Film[] = [];

      mockFetch.mockResolvedValue(
        createMockResponse({
          jsonData: mockFilms,
          headers: { "X-Total-Count": "0" },
        })
      );

      await apiClient.getFilms({
        search: "action",
        sort: "Action",
        page: 2,
        pageSize: 10,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/films?q=action&sort_like=Action&_page=2&_limit=10",
        expect.any(Object)
      );
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(apiClient.getFilms()).rejects.toThrow(
        "未知错误，请稍后重试"
      );
    });

    it("retries failed requests", async () => {
      // Mock the retry behavior - first request fails, second succeeds
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(
          createMockResponse({
            jsonData: [],
            headers: { "X-Total-Count": "0" },
          })
        );

      const result = await apiClient.getFilms();
      expect(result.data).toEqual([]);
    });

    it("fails after max retry attempts", async () => {
      // All requests fail
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(apiClient.getFilms()).rejects.toThrow(
        "未知错误，请稍后重试"
      );
    });
  });

  describe("getFilm", () => {
    it("fetches a single film successfully", async () => {
      const mockFilm: Film = {
        id: "1",
        movieName: "Test Movie",
        des: "A test movie",
        sort: ["Action"],
        publichTime: 1672531200000,
        commentCount: 10,
        totalCommentNum: 45,
        fraction: 4.5,
        posterUrl: "/test.jpg",
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: mockFilm }));

      const result = await apiClient.getFilm("1");

      expect(result).toEqual(mockFilm);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/films/1",
        expect.any(Object)
      );
    });

    it("handles 404 errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: { get: () => undefined },
      });

      await expect(apiClient.getFilm("999")).rejects.toThrow("电影不存在");
    });
  });

  describe("login", () => {
    it("logs in successfully with correct credentials", async () => {
      const mockUser: User = {
        id: "1",
        username: "testuser",
        password: "password123",
        email: "test@example.com",
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: [mockUser] }));

      const result = await apiClient.login("testuser", "password123");

      expect(result).toEqual(mockUser);
    });

    it("throws error for incorrect password", async () => {
      const mockUser: User = {
        id: "1",
        username: "testuser",
        password: "password123",
        email: "test@example.com",
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: [mockUser] }));

      await expect(
        apiClient.login("testuser", "wrongpassword")
      ).rejects.toThrow("登录失败，请检查用户名和密码");
    });

    it("throws error for non-existent user", async () => {
      mockFetch.mockResolvedValue(createMockResponse({ jsonData: [] }));

      await expect(apiClient.login("nonexistent", "password")).rejects.toThrow(
        "登录失败，请检查用户名和密码"
      );
    });
  });

  describe("getUser", () => {
    it("fetches user successfully", async () => {
      const mockUser: User = {
        id: "1",
        username: "testuser",
        password: "password123",
        email: "test@example.com",
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: mockUser }));

      const result = await apiClient.getUser("1");

      expect(result).toEqual(mockUser);
    });
  });

  describe("getReviews", () => {
    it("fetches all reviews when no filmId provided", async () => {
      const mockReviews: Review[] = [
        {
          id: "1",
          userId: "1",
          filmId: "1",
          score: 5,
          comment: "Great movie!",
          timestamp: 1672531200000,
        },
      ];

      mockFetch.mockResolvedValue(
        createMockResponse({ jsonData: mockReviews })
      );

      const result = await apiClient.getReviews();

      expect(result).toEqual(mockReviews);
    });

    it("fetches reviews for specific film", async () => {
      const mockReviews: Review[] = [];

      mockFetch.mockResolvedValue(
        createMockResponse({ jsonData: mockReviews })
      );

      await apiClient.getReviews("1");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/reviews?filmId=1",
        expect.any(Object)
      );
    });
  });

  describe("createReview", () => {
    it("creates review successfully", async () => {
      const newReview = {
        userId: "1",
        filmId: "1",
        score: 5,
        comment: "Great movie!",
        timestamp: 1672531200000,
      };

      const mockReview: Review = {
        id: "1",
        ...newReview,
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: mockReview }));

      const result = await apiClient.createReview(newReview);

      expect(result).toEqual(mockReview);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/reviews",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newReview),
        })
      );
    });
  });

  describe("updateReview", () => {
    it("updates review successfully", async () => {
      const updateData = {
        score: 4,
        comment: "Updated comment",
      };

      const mockReview: Review = {
        id: "1",
        userId: "1",
        filmId: "1",
        score: 4,
        comment: "Updated comment",
        timestamp: 1672531200000,
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: mockReview }));

      const result = await apiClient.updateReview("1", updateData);

      expect(result).toEqual(mockReview);
    });
  });

  describe("deleteReview", () => {
    it("deletes review successfully", async () => {
      mockFetch.mockResolvedValue(createMockResponse({ jsonData: {} }));

      await apiClient.deleteReview("1");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/reviews/1",
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("updateFilmRating", () => {
    it("updates film rating successfully", async () => {
      const ratingData = {
        commentCount: 11,
        totalCommentNum: 50,
        fraction: 4.5,
      };

      const mockFilm: Film = {
        id: "1",
        movieName: "Test Movie",
        des: "A test movie",
        sort: ["Action"],
        publichTime: 1672531200000,
        commentCount: 11,
        totalCommentNum: 50,
        fraction: 4.5,
        posterUrl: "/test.jpg",
      };

      mockFetch.mockResolvedValue(createMockResponse({ jsonData: mockFilm }));

      const result = await apiClient.updateFilmRating("1", ratingData);

      expect(result).toEqual(mockFilm);
    });
  });

  describe("clearCache", () => {
    it("clears the cache", () => {
      apiClient.clearCache();
      expect(cacheManager.clear).toHaveBeenCalled();
    });
  });
});
