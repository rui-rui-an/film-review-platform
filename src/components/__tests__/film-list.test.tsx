import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilmList } from '../film-list';
import { Film } from '@/types';

const mockFilms: Film[] = [
  {
    id: '1',
    title: 'Test Movie',
    description: 'A test movie',
    genre: ['Action'],
    releaseDate: 1672531200000,
    ratingCount: 10,
    totalRating: 45,
    averageRating: 4.5,
    posterUrl: '/test.jpg',
  },
  {
    id: '2',
    title: 'Another Movie',
    description: 'Another test movie',
    genre: ['Comedy'],
    releaseDate: 1672531200000,
    ratingCount: 5,
    totalRating: 20,
    averageRating: 4.0,
    posterUrl: '/test2.jpg',
  },
];

describe('FilmList', () => {
  it('renders loading skeleton when loading', () => {
    render(<FilmList films={[]} loading={true} />);
    // Check for skeleton elements by their class name
    const skeletons = document.querySelectorAll('.chakra-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message when error is present', () => {
    render(<FilmList films={[]} loading={false} error="出错啦" />);
    expect(screen.getByText('出错啦')).toBeInTheDocument();
  });

  it('renders empty message when no films', () => {
    render(<FilmList films={[]} loading={false} emptyMessage="没有电影" />);
    expect(screen.getByText('没有电影')).toBeInTheDocument();
  });

  it('renders film cards when films are present', () => {
    render(<FilmList films={mockFilms} loading={false} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Another Movie')).toBeInTheDocument();
  });
}); 