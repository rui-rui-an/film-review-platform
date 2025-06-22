import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFilms, useFilm } from '../useFilms';
import { apiClient } from '@/lib/api';
import { Film } from '@/types';

// Mock the API client
vi.mock('@/lib/api', () => ({
  apiClient: {
    getFilms: vi.fn(),
    getFilm: vi.fn()
  }
}));

// Test component for useFilms
function TestUseFilmsComponent() {
  const { films, loading, error, pagination, refetch, changePage, changePageSize } = useFilms();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="films-count">{films.length}</div>
      <div data-testid="current-page">{pagination.currentPage}</div>
      <div data-testid="total-pages">{pagination.totalPages}</div>
      <div data-testid="total">{pagination.total}</div>
      <button 
        data-testid="refetch-btn" 
        onClick={() => refetch({ search: 'test' })}
      >
        Refetch
      </button>
      <button 
        data-testid="change-page-btn" 
        onClick={() => changePage(2)}
      >
        Change Page
      </button>
      <button 
        data-testid="change-page-size-btn" 
        onClick={() => changePageSize(20)}
      >
        Change Page Size
      </button>
    </div>
  );
}

// Test component for useFilm
function TestUseFilmComponent({ filmId }: { filmId: string }) {
  const { film, loading, refetch } = useFilm(filmId);
  
  return (
    <div>
      <div data-testid="film-loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="film-title">{film?.title || 'No Film'}</div>
      <button data-testid="refetch-film-btn" onClick={refetch}>
        Refetch Film
      </button>
    </div>
  );
}

describe('useFilms Hook', () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('useFilms', () => {
    const mockFilms: Film[] = [
      {
        id: '1',
        title: 'Test Movie 1',
        description: 'A test movie',
        genre: ['Action'],
        releaseDate: 1672531200000,
        ratingCount: 10,
        totalRating: 45,
        averageRating: 4.5,
        posterUrl: '/test1.jpg'
      },
      {
        id: '2',
        title: 'Test Movie 2',
        description: 'Another test movie',
        genre: ['Comedy'],
        releaseDate: 1672531200000,
        ratingCount: 5,
        totalRating: 20,
        averageRating: 4.0,
        posterUrl: '/test2.jpg'
      }
    ];

    const mockResponse = {
      data: mockFilms,
      total: 2,
      totalPages: 1,
      currentPage: 1
    };

    it('loads films on mount', async () => {
      mockApiClient.getFilms.mockResolvedValue(mockResponse);

      render(<TestUseFilmsComponent />);

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('films-count')).toHaveTextContent('2');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('total-pages')).toHaveTextContent('1');
      expect(screen.getByTestId('total')).toHaveTextContent('2');
    });

    it('handles API errors', async () => {
      mockApiClient.getFilms.mockRejectedValue(new Error('API Error'));

      render(<TestUseFilmsComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('API Error');
    });

    it('refetches films with search parameters', async () => {
      mockApiClient.getFilms.mockResolvedValue(mockResponse);

      render(<TestUseFilmsComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      const refetchButton = screen.getByTestId('refetch-btn');
      
      await act(async () => {
        refetchButton.click();
      });

      await waitFor(() => {
        expect(mockApiClient.getFilms).toHaveBeenCalledWith({
          search: 'test',
          genre: undefined,
          page: 1,
          pageSize: 12
        });
      });
    });

    it('changes page correctly', async () => {
      mockApiClient.getFilms.mockResolvedValue(mockResponse);

      render(<TestUseFilmsComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      const changePageButton = screen.getByTestId('change-page-btn');
      
      await act(async () => {
        changePageButton.click();
      });

      await waitFor(() => {
        expect(mockApiClient.getFilms).toHaveBeenCalledWith({
          search: undefined,
          genre: undefined,
          page: 2,
          pageSize: 12
        });
      });
    });

    it('changes page size correctly', async () => {
      mockApiClient.getFilms.mockResolvedValue(mockResponse);

      render(<TestUseFilmsComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      const changePageSizeButton = screen.getByTestId('change-page-size-btn');
      
      await act(async () => {
        changePageSizeButton.click();
      });

      await waitFor(() => {
        expect(mockApiClient.getFilms).toHaveBeenCalledWith({
          search: undefined,
          genre: undefined,
          page: 1,
          pageSize: 20
        });
      });
    });

    it('handles pagination response correctly', async () => {
      const paginatedResponse = {
        data: [mockFilms[0]],
        total: 2,
        totalPages: 2,
        currentPage: 1
      };

      mockApiClient.getFilms.mockResolvedValue(paginatedResponse);

      render(<TestUseFilmsComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('films-count')).toHaveTextContent('1');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('total-pages')).toHaveTextContent('2');
      expect(screen.getByTestId('total')).toHaveTextContent('2');
    });
  });

  describe('useFilm', () => {
    const mockFilm: Film = {
      id: '1',
      title: 'Test Movie',
      description: 'A test movie',
      genre: ['Action'],
      releaseDate: 1672531200000,
      ratingCount: 10,
      totalRating: 45,
      averageRating: 4.5,
      posterUrl: '/test.jpg'
    };

    it('loads a single film', async () => {
      mockApiClient.getFilm.mockResolvedValue(mockFilm);

      render(<TestUseFilmComponent filmId="1" />);

      expect(screen.getByTestId('film-loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('film-loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('film-title')).toHaveTextContent('Test Movie');
    });

    it('handles film not found', async () => {
      mockApiClient.getFilm.mockRejectedValue(new Error('Film not found'));

      render(<TestUseFilmComponent filmId="999" />);

      await waitFor(() => {
        expect(screen.getByTestId('film-loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('film-title')).toHaveTextContent('No Film');
    });

    it('refetches film data', async () => {
      mockApiClient.getFilm.mockResolvedValue(mockFilm);

      render(<TestUseFilmComponent filmId="1" />);

      await waitFor(() => {
        expect(screen.getByTestId('film-loading')).toHaveTextContent('Not Loading');
      });

      const refetchButton = screen.getByTestId('refetch-film-btn');
      
      await act(async () => {
        refetchButton.click();
      });

      await waitFor(() => {
        expect(mockApiClient.getFilm).toHaveBeenCalledTimes(2);
      });
    });

    it('does not fetch when filmId is empty', async () => {
      render(<TestUseFilmComponent filmId="" />);

      // Should show loading initially, then not loading since no fetch happens
      await waitFor(() => {
        expect(screen.getByTestId('film-loading')).toHaveTextContent('Not Loading');
      }, { timeout: 3000 });
      expect(screen.getByTestId('film-title')).toHaveTextContent('No Film');
      expect(mockApiClient.getFilm).not.toHaveBeenCalled();
    });

    it('updates when filmId changes', async () => {
      mockApiClient.getFilm.mockResolvedValue(mockFilm);

      const { rerender } = render(<TestUseFilmComponent filmId="1" />);

      await waitFor(() => {
        expect(screen.getByTestId('film-title')).toHaveTextContent('Test Movie');
      });

      const newMockFilm = { ...mockFilm, id: '2', title: 'New Movie' };
      mockApiClient.getFilm.mockResolvedValue(newMockFilm);

      rerender(<TestUseFilmComponent filmId="2" />);

      await waitFor(() => {
        expect(screen.getByTestId('film-title')).toHaveTextContent('New Movie');
      });
    });
  });
}); 