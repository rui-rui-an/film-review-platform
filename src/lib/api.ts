import { Film, Review, User } from "@/types";
import { cacheManager } from "./cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PaginationParams {
  _page?: number;
  _limit?: number;
  _start?: number;
  _end?: number;
}

interface FilmsResponse {
  data: Film[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// 自定义错误类
class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

class ApiClient {
  private retryAttempts = 2;
  private requestTimeout = 10000; // 10秒超时

  private async requestWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (retryCount < this.retryAttempts) {
        // 指数退避重试
        const delay = 1000 * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.requestWithRetry<T>(url, options, retryCount + 1);
      }

      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return new Error("网络连接失败，请检查网络连接");
    }

    if (error instanceof Error && error.name === "AbortError") {
      return new Error("请求超时，请稍后重试");
    }

    return new Error("未知错误，请稍后重试");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; totalCount?: number }> {
    const url = `${API_BASE_URL}${endpoint}`;
    const cacheKey = this.getCacheKey(endpoint, options);

    // 检查缓存（仅对GET请求）
    if (options.method === "GET" || !options.method) {
      const cached = cacheManager.get<{ data: T; totalCount?: number }>(
        cacheKey
      );
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await this.requestWithRetry<T>(url, options);
      const data = await response.json();
      const totalCountHeader = response.headers.get("X-Total-Count");
      const totalCount = totalCountHeader
        ? Number(totalCountHeader)
        : undefined;
      // 缓存GET请求
      if (options.method === "GET" || !options.method) {
        cacheManager.set(cacheKey, { data, totalCount });
      }
      return { data, totalCount };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private getCacheKey(endpoint: string, options: RequestInit = {}): string {
    const method = options.method || "GET";
    const body = options.body ? JSON.stringify(options.body) : "";
    return `${method}:${endpoint}:${body}`;
  }

  // 清除缓存
  clearCache(): void {
    cacheManager.clear();
  }

  // 清除特定端点的缓存
  clearCacheForEndpoint(endpoint: string): void {
    const keys = cacheManager.getStats().keys;
    keys.forEach((key) => {
      if (key.includes(endpoint)) {
        cacheManager.delete(key);
      }
    });
  }

  // Film APIs
  async getFilms(params?: {
    search?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
  }): Promise<FilmsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("q", params.search);
    if (params?.sort) searchParams.append("sort_like", params.sort);
    if (params?.page) searchParams.append("_page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("_limit", params.pageSize.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/films?${queryString}` : "/films";

    // 只用后端分页和totalCount
    const { data, totalCount } = await this.request<Film[]>(endpoint);
    const total = totalCount ?? data.length;
    const pageSize = params?.pageSize || 12;
    const currentPage = params?.page || 1;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async getFilm(id: string): Promise<Film> {
    try {
      const response = await this.request<Film>(`/films/${id}`);
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch film:", error);
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("电影不存在");
      }
      throw new Error("获取电影详情失败，请稍后重试");
    }
  }

  // User APIs
  async login(username: string, password: string): Promise<User> {
    try {
      const response = await this.request<User[]>(
        `/users?username=${username}`
      );
      const users = response.data || response;
      const user = users.find((u) => u.password === password);

      if (!user) {
        throw new Error("用户名或密码错误");
      }

      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("登录失败，请检查用户名和密码");
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const response = await this.request<User>(`/users/${id}`);
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw new Error("获取用户信息失败");
    }
  }

  // Review APIs
  async getReviews(filmId?: string): Promise<Review[]> {
    try {
      const endpoint = filmId ? `/reviews?filmId=${filmId}` : "/reviews";
      const response = await this.request<Review[]>(endpoint);
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      throw new Error("获取评价失败，请稍后重试");
    }
  }

  async createReview(review: Omit<Review, "id">): Promise<Review> {
    try {
      const response = await this.request<Review>("/reviews", {
        method: "POST",
        body: JSON.stringify(review),
      });

      // 清除相关缓存
      this.clearCacheForEndpoint("/reviews");
      this.clearCacheForEndpoint(`/films/${review.filmId}`);

      return response.data || response;
    } catch (error) {
      console.error("Failed to create review:", error);
      throw new Error("创建评价失败，请稍后重试");
    }
  }

  async updateReview(id: string, review: Partial<Review>): Promise<Review> {
    try {
      const response = await this.request<Review>(`/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify(review),
      });

      // 清除相关缓存
      this.clearCacheForEndpoint("/reviews");
      if (review.filmId) {
        this.clearCacheForEndpoint(`/films/${review.filmId}`);
      }

      return response.data || response;
    } catch (error) {
      console.error("Failed to update review:", error);
      throw new Error("更新评价失败，请稍后重试");
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await this.request(`/reviews/${id}`, {
        method: "DELETE",
      });

      // 清除相关缓存
      this.clearCacheForEndpoint("/reviews");
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw new Error("删除评价失败，请稍后重试");
    }
  }

  async updateFilmRating(
    filmId: string,
    ratingData: {
      commentCount: number;
      totalCommentNum: number;
      fraction: number;
    }
  ): Promise<Film> {
    try {
      const response = await this.request<Film>(`/films/${filmId}`, {
        method: "PATCH",
        body: JSON.stringify(ratingData),
      });

      // 清除相关缓存
      this.clearCacheForEndpoint(`/films/${filmId}`);
      this.clearCacheForEndpoint("/films");

      return response.data || response;
    } catch (error) {
      console.error("Failed to update film rating:", error);
      throw new Error("更新电影评分失败，请稍后重试");
    }
  }
}

export const apiClient = new ApiClient();
