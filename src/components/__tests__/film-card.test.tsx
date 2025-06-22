import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilmCard } from '../film-card';
import { Film } from '@/types';

// Mock the film data with correct field names
const mockFilm: Film = {
  id: '1',
  movieName: 'Test Movie',
  des: 'This is a test movie description',
  sort: ['Action'],
  posterUrl: '/test-poster.jpg',
  publichTime: 1672531200000, // 2023-01-01 timestamp
  fraction: 4.5,
  commentCount: 10,
  totalCommentNum: 45
};

describe('FilmCard', () => {
  it('renders film information correctly', () => {
    render(<FilmCard film={mockFilm} />);
    
    // Check if the title is displayed
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    
    // Check if the description is displayed
    expect(screen.getByText('This is a test movie description')).toBeInTheDocument();
    
    // Check if the genre is displayed
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('displays the correct rating', () => {
    render(<FilmCard film={mockFilm} />);
    
    // Check if the rating is displayed
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders film poster with correct alt text', () => {
    render(<FilmCard film={mockFilm} />);
    
    const posterImage = screen.getByAltText('Test Movie');
    expect(posterImage).toBeInTheDocument();
    expect(posterImage).toHaveAttribute('src');
  });
}); 