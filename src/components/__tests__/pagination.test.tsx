import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from '../pagination';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 12,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination controls', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByRole('button', { name: /上一页/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /下一页/i })).toBeInTheDocument();
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: /下一页/i });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  });

  it('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    
    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole('button', { name: /上一页/i });
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    const prevButton = screen.getByRole('button', { name: /上一页/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    
    const nextButton = screen.getByRole('button', { name: /下一页/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const pageButton = screen.getByRole('button', { name: '3' });
    await user.click(pageButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('does not call onPageChange when clicking current page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    
    render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);

    const currentPageButton = screen.getByRole('button', { name: '1' });
    await user.click(currentPageButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders all page numbers when total pages is 5 or less', () => {
    render(<Pagination {...defaultProps} totalPages={5} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('renders ellipsis when total pages is more than 5', () => {
    render(<Pagination {...defaultProps} totalPages={10} />);

    // Should show ellipsis buttons
    const ellipsisButtons = screen.getAllByRole('button', { name: '...' });
    expect(ellipsisButtons.length).toBeGreaterThan(0);
  });

  it('renders correct page numbers for current page in first 3 pages', () => {
    render(<Pagination {...defaultProps} currentPage={2} totalPages={10} />);

    // Should show: 1, 2, 3, 4, ..., 10
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('renders correct page numbers for current page in last 3 pages', () => {
    render(<Pagination {...defaultProps} currentPage={9} totalPages={10} />);

    // Should show: 1, ..., 7, 8, 9, 10
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('renders correct page numbers for current page in middle', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

    // Should show: 1, ..., 4, 5, 6, ..., 10
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('disables ellipsis buttons', () => {
    render(<Pagination {...defaultProps} totalPages={10} />);

    const ellipsisButtons = screen.getAllByRole('button', { name: '...' });
    ellipsisButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('shows current page as active', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const currentPageButton = screen.getByRole('button', { name: '3' });
    expect(currentPageButton).toHaveClass('chakra-button');
  });
}); 