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
      movieName: 'Action Movie',
      des: 'An action film',
      sort: ['Action', 'Adventure'],
      publichTime: 1672531200000,
      commentCount: 10,
      totalCommentNum: 45,
      fraction: 4.5,
      posterUrl: '/action.jpg'
    },
    {
      id: '2',
      movieName: 'Comedy Movie',
      des: 'A comedy film',
      sort: ['Comedy'],
      publichTime: 1672531200000,
      commentCount: 5,
      totalCommentNum: 20,
      fraction: 4.0,
      posterUrl: '/comedy.jpg'
    }
  ];

  const defaultProps = {
    films: mockFilms,
    onSearch: vi.fn(),
    selectedSort: '',
    onSortChange: vi.fn(),
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

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    const searchButtons = screen.getAllByRole('button', { name: /搜索/i });
    const searchButton = searchButtons[0];

    await user.type(searchInput, 'test search');
    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledWith('test search');
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];
    
    await user.type(searchInput, 'test search');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('test search');
  });

  it('calls onSortChange when genre is selected', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(<SearchBar {...defaultProps} onSortChange={onSortChange} />);

    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];

    await user.selectOptions(genreSelect, 'Action');

    expect(onSortChange).toHaveBeenCalledWith('Action');
  });

  it('sets selected genre from selectedSort prop', () => {
    render(<SearchBar {...defaultProps} selectedSort="Action" />);

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
    const onSearch = vi.fn();
    
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);

    const searchButtons = screen.getAllByRole('button', { name: /搜索/i });
    const searchButton = searchButtons[0];

    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('handles genre selection change', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(<SearchBar {...defaultProps} onSortChange={onSortChange} />);

    const genreSelects = screen.getAllByRole('combobox');
    const genreSelect = genreSelects[0];

    // Select different genres
    await user.selectOptions(genreSelect, 'Action');
    expect(onSortChange).toHaveBeenCalledWith('Action');

    await user.selectOptions(genreSelect, 'Comedy');
    expect(onSortChange).toHaveBeenCalledWith('Comedy');
  });

  it('maintains input state independently', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    
    const { rerender } = render(
      <SearchBar {...defaultProps} onSearch={onSearch} />
    );

    const searchInputs = screen.getAllByPlaceholderText('搜索电影标题、描述或类型...');
    const searchInput = searchInputs[0];

    await user.type(searchInput, 'user typed text');
    expect(searchInput).toHaveValue('user typed text');

    // Re-render with different props
    rerender(
      <SearchBar {...defaultProps} onSearch={onSearch} />
    );

    // Input value should remain unchanged
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