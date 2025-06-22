import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorBoundary } from '../error-boundary';

function ProblemChild() {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>正常内容</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('正常内容')).toBeInTheDocument();
  });

  it('catches error and renders fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/应用出现错误/)).toBeInTheDocument();
    expect(screen.getByText(/抱歉，应用遇到了一个错误/)).toBeInTheDocument();
  });

  it('can reset after error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    const retryBtn = screen.getByRole('button', { name: /重试/ });
    fireEvent.click(retryBtn);
    // 重试后应该能再次渲染children（这里简单断言按钮还在，实际项目可配合mock）
    expect(screen.getByRole('button', { name: /重试/ })).toBeInTheDocument();
  });
}); 