import { Film, Review } from "@/types";

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.score, 0);
  return total / reviews.length;
}

export function filterFilmsByGenre(films: Film[], genre: string): Film[] {
  if (!genre) return films;
  return films.filter(film => film.sort.includes(genre));
}

export function searchFilms(films: Film[], query: string): Film[] {
  if (!query.trim()) return films;
  
  const lowercaseQuery = query.toLowerCase();
  return films.filter(film => 
    film.movieName.toLowerCase().includes(lowercaseQuery) ||
    film.des.toLowerCase().includes(lowercaseQuery) ||
    film.sort.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
}

export function generateReviewId(userId: string, filmId: string): string {
  return `${userId}-${filmId}`;
}

export function getUniqueGenres(films: Film[]): string[] {
  const genres = films.flatMap(film => film.sort);
  const uniqueGenres = new Set(genres);
  return Array.from(uniqueGenres).sort();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
} 