import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchBar } from '../search-bar';
import { Film } from '@/types';
import { getUniqueGenres } from '@/utils/helpers';

// Mock the helpers function
vi.mock('@/utils/helpers', () => ({
  getUniqueGenres: vi.fn()
}));

describe('SearchBar Component', () => {
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

  const defaultProps = {
    films: mockFilms,
    searchQuery: '',
    selectedGenre: '',
    onSearchChange: vi.fn(),
    onGenreChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getUniqueGenres to return test genres
    (getUniqueGenres as any).mockReturnValue(['Action', 'Adventure', 'Comedy']);
  });

  it('renders search input and genre select', () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getAllByPlaceholderText('搜索电影标题、描述或类型...')[0]).toBeInTheDocument();
    expect(screen.getAllByText('选择类型')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /搜索/i })[0]).toBeInTheDocument();
  });

  it('displays all available genres in select dropdown', () => {
    render(<SearchBar {...defaultProps} />);

    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];
    fireEvent.click(genreSelect);

    expect(screen.getAllByText('Action')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Adventure')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Comedy')[0]).toBeInTheDocument();
  });

  it('calls onSearchChange when search button is clicked', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    
    render(<SearchBar {...defaultProps} onSearchChange={onSearchChange} />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    const searchButtons = screen.getAllByRole('button', { name: /搜索/i });
    const searchButton = searchButtons[0];

    await user.type(searchInput, 'test search');
    await user.click(searchButton);

    expect(onSearchChange).toHaveBeenCalledWith('test search');
  });

  it('calls onSearchChange when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    
    render(<SearchBar {...defaultProps} onSearchChange={onSearchChange} />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    
    await user.type(searchInput, 'test search');
    await user.keyboard('{Enter}');

    expect(onSearchChange).toHaveBeenCalledWith('test search');
  });

  it('calls onGenreChange when genre is selected', async () => {
    const user = userEvent.setup();
    const onGenreChange = vi.fn();
    
    render(<SearchBar {...defaultProps} onGenreChange={onGenreChange} />);

    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];
    
    await user.selectOptions(genreSelect, 'Action');

    expect(onGenreChange).toHaveBeenCalledWith('Action');
  });

  it('initializes input value with searchQuery prop', () => {
    render(<SearchBar {...defaultProps} searchQuery="initial search" />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    expect(searchInput).toHaveValue('initial search');
  });

  it('sets selected genre from selectedGenre prop', () => {
    render(<SearchBar {...defaultProps} selectedGenre="Action" />);

    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];
    expect(genreSelect).toHaveValue('Action');
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar {...defaultProps} />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    
    await user.type(searchInput, 'new search term');

    expect(searchInput).toHaveValue('new search term');
  });

  it('calls getUniqueGenres with films prop', () => {
    render(<SearchBar {...defaultProps} />);
    expect(getUniqueGenres).toHaveBeenCalledWith(mockFilms);
  });

  it('handles empty search query', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    
    render(<SearchBar {...defaultProps} onSearchChange={onSearchChange} />);

    const searchButtons = screen.getAllByRole('button', { name: /搜索/i });
    const searchButton = searchButtons[0];
    
    await user.click(searchButton);

    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('handles genre selection change', async () => {
    const user = userEvent.setup();
    const onGenreChange = vi.fn();
    
    render(<SearchBar {...defaultProps} onGenreChange={onGenreChange} />);

    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];
    
    // Select different genres
    await user.selectOptions(genreSelect, 'Action');
    expect(onGenreChange).toHaveBeenCalledWith('Action');

    await user.selectOptions(genreSelect, 'Comedy');
    expect(onGenreChange).toHaveBeenCalledWith('Comedy');
  });

  it('maintains input state independently of searchQuery prop', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    
    const { rerender } = render(
      <SearchBar {...defaultProps} searchQuery="" onSearchChange={onSearchChange} />
    );

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    
    // Type in the input
    await user.type(searchInput, 'user typed text');
    expect(searchInput).toHaveValue('user typed text');

    // Re-render with different searchQuery prop
    rerender(
      <SearchBar {...defaultProps} searchQuery="new prop value" onSearchChange={onSearchChange} />
    );

    // Input should still show user's typed text, not the prop value
    expect(searchInput).toHaveValue('user typed text');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar {...defaultProps} />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];
    const searchButtons = screen.getAllByRole('button', { name: /搜索/i });
    const searchButton = searchButtons[0];

    expect(searchInput).toBeInTheDocument();
    expect(genreSelect).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });
}); 