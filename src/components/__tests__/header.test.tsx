import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../header';
import { AuthProvider } from '../../hooks/useAuth';
import { createContext } from 'react';
import type { UserSession } from '@/types';

// 引入 useAuth 的 context
import * as useAuthModule from '../../hooks/useAuth';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('Header', () => {
  it('renders site title', () => {
    renderWithAuth(<Header />);
    expect(screen.getByText('电影评分平台')).toBeInTheDocument();
  });

  it('renders login button when user is not logged in', () => {
    renderWithAuth(<Header />);
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('renders logout button when user is logged in', () => {
    // 自定义Provider
    const TestAuthProvider = ({ children }: { children: React.ReactNode }) => {
      const value = {
        user: { id: '1', username: 'testuser', email: 'test@example.com' } as UserSession,
        login: async () => {},
        logout: () => {},
        isLoading: false,
      };
      // @ts-ignore
      return <useAuthModule.AuthContext.Provider value={value}>{children}</useAuthModule.AuthContext.Provider>;
    };
    render(
      <TestAuthProvider>
        <Header />
      </TestAuthProvider>
    );
    expect(screen.getByRole('button', { name: /退出/i })).toBeInTheDocument();
    expect(screen.getByText(/欢迎，testuser/i)).toBeInTheDocument();
  });

  it('shows login modal when login button clicked', () => {
    renderWithAuth(<Header />);
    const loginBtn = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(loginBtn);
    // 检查弹窗标题是否出现
    expect(screen.getByText('用户登录')).toBeInTheDocument();
  });
}); 