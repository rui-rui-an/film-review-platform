export interface Film {
  id: string;
  title: string;
  description: string;
  genre: string[];
  releaseDate: number;
  ratingCount: number;
  totalRating: number;
  averageRating: number;
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