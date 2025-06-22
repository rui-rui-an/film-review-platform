"use client";

import { Alert, Box, Button, Stack, Text } from "@chakra-ui/react";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={6} textAlign="center">
          <Alert status="error" borderRadius="md" mb={4}>
            <FiAlertTriangle />
            <Text ml={2}>出现了一些问题。请刷新页面重试。</Text>
          </Alert>

          <Stack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              错误详情
            </Text>
            <Text fontSize="sm" color="gray.600" fontFamily="mono">
              {this.state.error?.message}
            </Text>

            <Button
              colorScheme="blue"
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              刷新页面
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}

// 函数式错误边界 Hook
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error("Error handled by hook:", error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
