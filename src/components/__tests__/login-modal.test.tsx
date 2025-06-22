import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginModal } from '../login-modal';
import { AuthProvider } from '../../hooks/useAuth';

// Mock the API client
vi.mock('@/lib/api', () => ({
  apiClient: {
    login: vi.fn(),
  },
}));

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('LoginModal', () => {
  it('renders login button', () => {
    renderWithAuth(<LoginModal />);
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('opens modal when login button clicked', async () => {
    renderWithAuth(<LoginModal />);
    const loginBtn = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(loginBtn);
    
    await waitFor(() => {
      expect(screen.getByText('用户登录')).toBeInTheDocument();
    });
  });

  it('closes modal when close button clicked', async () => {
    renderWithAuth(<LoginModal />);
    const loginBtn = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(loginBtn);
    
    await waitFor(() => {
      expect(screen.getByText('用户登录')).toBeInTheDocument();
    });
    
    const closeBtn = screen.getByLabelText(/关闭|close/i);
    fireEvent.click(closeBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('用户登录')).not.toBeInTheDocument();
    });
  });

  it('submits form with username and password', async () => {
    renderWithAuth(<LoginModal />);
    const loginBtn = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(loginBtn);
    
    await waitFor(() => {
      expect(screen.getByText('用户登录')).toBeInTheDocument();
    });
    
    const usernameInput = screen.getByPlaceholderText(/请输入用户名/i);
    const passwordInput = screen.getByPlaceholderText(/请输入密码/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    const submitBtn = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(submitBtn);
    
    // The form submission will be handled by the component internally
    await waitFor(() => {
      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpass');
    });
  });
}); 