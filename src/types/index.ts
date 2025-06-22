export interface Film {
  id: string;
  movieName: string;
  des: string;
  sort: string[];
  publichTime: number;
  commentCount: number;
  totalCommentNum: number;
  fraction: number;
  posterUrl: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

export interface Review {
  id: string;
  userId: string;
  filmId: string;
  score: number;
  comment: string;
  timestamp: number;
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface FilmsResponse {
  data: Film[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface FilmsParams {
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
} 