import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../useAuth';
import { apiClient } from '@/lib/api';

// Mock the API client
vi.mock('@/lib/api', () => ({
  apiClient: {
    login: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component to use the hook
function TestComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('testuser', 'password');
    } catch (error) {
      // 静默处理错误，这是预期的测试行为
      console.log('Login failed as expected:', error instanceof Error ? error.message : String(error));
    }
  };
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.username : 'No User'}</div>
      <button 
        data-testid="login-btn" 
        onClick={handleLogin}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('useAuth Hook', () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('renders children correctly', () => {
      render(
        <AuthProvider>
          <div data-testid="child">Test Child</div>
        </AuthProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('loads user from localStorage on mount', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });

    it('handles invalid localStorage data', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('No User');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });

    it('handles missing localStorage data', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });

  describe('login function', () => {
    it('logs in successfully', async () => {
      const mockUserData = {
        id: '1',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      };

      mockApiClient.login.mockResolvedValue(mockUserData);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(mockApiClient.login).toHaveBeenCalledWith('testuser', 'password');
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        })
      );
    });

    it('handles login failure', async () => {
      mockApiClient.login.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(mockApiClient.login).toHaveBeenCalledWith('testuser', 'password');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });

  describe('logout function', () => {
    it('logs out successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      });

      const logoutButton = screen.getByTestId('logout-btn');
      
      await act(async () => {
        logoutButton.click();
      });

      expect(screen.getByTestId('user')).toHaveTextContent('No User');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
}); 