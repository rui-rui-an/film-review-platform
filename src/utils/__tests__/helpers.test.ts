import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  calculateAverageRating, 
  filterFilmsByGenre, 
  searchFilms, 
  generateReviewId, 
  getUniqueGenres, 
  truncateText 
} from '../helpers';
import { Film, Review } from '@/types';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats timestamp correctly', () => {
      const timestamp = 1672531200000; // 2023-01-01
      const result = formatDate(timestamp);
      expect(result).toMatch(/2023年1月1日/);
    });

    it('handles different timestamps', () => {
      const timestamp = 1640995200000; // 2022-01-01
      const result = formatDate(timestamp);
      expect(result).toMatch(/2022年1月1日/);
    });
  });

  describe('calculateAverageRating', () => {
    it('calculates average rating correctly', () => {
      const reviews: Review[] = [
        { id: '1', userId: 'user1', filmId: 'film1', score: 4, comment: 'Good', timestamp: 1234567890 },
        { id: '2', userId: 'user2', filmId: 'film1', score: 5, comment: 'Great', timestamp: 1234567890 },
        { id: '3', userId: 'user3', filmId: 'film1', score: 3, comment: 'Okay', timestamp: 1234567890 }
      ];
      const result = calculateAverageRating(reviews);
      expect(result).toBe(4);
    });

    it('returns 0 for empty reviews array', () => {
      const reviews: Review[] = [];
      const result = calculateAverageRating(reviews);
      expect(result).toBe(0);
    });

    it('rounds to one decimal place', () => {
      const reviews: Review[] = [
        { id: '1', userId: 'user1', filmId: 'film1', score: 4, comment: 'Good', timestamp: 1234567890 },
        { id: '2', userId: 'user2', filmId: 'film1', score: 5, comment: 'Great', timestamp: 1234567890 }
      ];
      const result = calculateAverageRating(reviews);
      expect(result).toBe(4.5);
    });
  });

  describe('filterFilmsByGenre', () => {
    const mockFilms: Film[] = [
      {
        id: '1',
        title: 'Action Movie',
        description: 'An action film',
        genre: ['Action', 'Adventure'],
        releaseDate: 1672531200000,
        ratingCount: 10,
        totalRating: 45,
        averageRating: 4.5,
        posterUrl: '/action.jpg'
      },
      {
        id: '2',
        title: 'Comedy Movie',
        description: 'A comedy film',
        genre: ['Comedy'],
        releaseDate: 1672531200000,
        ratingCount: 5,
        totalRating: 20,
        averageRating: 4.0,
        posterUrl: '/comedy.jpg'
      }
    ];

    it('filters films by genre correctly', () => {
      const result = filterFilmsByGenre(mockFilms, 'Action');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Action Movie');
    });

    it('returns all films when no genre is specified', () => {
      const result = filterFilmsByGenre(mockFilms, '');
      expect(result).toEqual(mockFilms);
    });

    it('returns empty array when genre not found', () => {
      const result = filterFilmsByGenre(mockFilms, 'Horror');
      expect(result).toHaveLength(0);
    });
  });

  describe('searchFilms', () => {
    const mockFilms: Film[] = [
      {
        id: '1',
        title: 'The Matrix',
        description: 'A sci-fi action film',
        genre: ['Action', 'Sci-Fi'],
        releaseDate: 1672531200000,
        ratingCount: 10,
        totalRating: 45,
        averageRating: 4.5,
        posterUrl: '/matrix.jpg'
      },
      {
        id: '2',
        title: 'Comedy Central',
        description: 'A funny comedy',
        genre: ['Comedy'],
        releaseDate: 1672531200000,
        ratingCount: 5,
        totalRating: 20,
        averageRating: 4.0,
        posterUrl: '/comedy.jpg'
      }
    ];

    it('searches by title', () => {
      const result = searchFilms(mockFilms, 'Matrix');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Matrix');
    });

    it('searches by description', () => {
      const result = searchFilms(mockFilms, 'sci-fi');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Matrix');
    });

    it('searches by genre', () => {
      const result = searchFilms(mockFilms, 'Comedy');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Comedy Central');
    });

    it('returns all films when no query is specified', () => {
      const result = searchFilms(mockFilms, '');
      expect(result).toEqual(mockFilms);
    });

    it('is case insensitive', () => {
      const result = searchFilms(mockFilms, 'matrix');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Matrix');
    });
  });

  describe('generateReviewId', () => {
    it('generates correct review ID', () => {
      const userId = 'user123';
      const filmId = 'film456';
      const result = generateReviewId(userId, filmId);
      expect(result).toBe('user123-film456');
    });

    it('handles different IDs', () => {
      const userId = 'test-user';
      const filmId = 'test-film';
      const result = generateReviewId(userId, filmId);
      expect(result).toBe('test-user-test-film');
    });
  });

  describe('getUniqueGenres', () => {
    const mockFilms: Film[] = [
      {
        id: '1',
        title: 'Action Movie',
        description: 'An action film',
        genre: ['Action', 'Adventure'],
        releaseDate: 1672531200000,
        ratingCount: 10,
        totalRating: 45,
        averageRating: 4.5,
        posterUrl: '/action.jpg'
      },
      {
        id: '2',
        title: 'Comedy Movie',
        description: 'A comedy film',
        genre: ['Comedy', 'Action'],
        releaseDate: 1672531200000,
        ratingCount: 5,
        totalRating: 20,
        averageRating: 4.0,
        posterUrl: '/comedy.jpg'
      }
    ];

    it('returns unique genres sorted alphabetically', () => {
      const result = getUniqueGenres(mockFilms);
      expect(result).toEqual(['Action', 'Adventure', 'Comedy']);
    });

    it('returns empty array for empty films array', () => {
      const result = getUniqueGenres([]);
      expect(result).toEqual([]);
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('returns original text if shorter than max length', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });

    it('returns original text if equal to max length', () => {
      const text = 'Exactly ten chars';
      const result = truncateText(text, 17);
      expect(result).toBe('Exactly ten chars');
    });

    it('truncates text when length is greater than max length', () => {
      const text = 'Exactly ten chars';
      const result = truncateText(text, 10);
      expect(result).toBe('Exactly te...');
    });

    it('handles empty string', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });
  });
}); 