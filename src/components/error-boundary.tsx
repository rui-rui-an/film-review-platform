"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Text, Button, VStack, Alert, AlertIcon } from '@chakra-ui/react';

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
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={8} textAlign="center">
          <VStack spacing={4}>
            <Alert status="error">
              <AlertIcon />
              应用出现错误
            </Alert>
            
            <Text fontSize="lg" fontWeight="bold">
              抱歉，应用遇到了一个错误
            </Text>
            
            <Text color="gray.600">
              我们已经记录了这个错误，并将尽快修复
            </Text>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                mt={4} 
                p={4} 
                bg="gray.100" 
                borderRadius="md" 
                textAlign="left"
                maxW="600px"
                overflow="auto"
              >
                <Text fontWeight="bold" mb={2}>错误详情:</Text>
                <Text fontSize="sm" fontFamily="mono">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <>
                    <Text fontWeight="bold" mt={4} mb={2}>组件堆栈:</Text>
                    <Text fontSize="sm" fontFamily="mono">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </Box>
            )}
            
            <Button 
              colorScheme="blue" 
              onClick={this.handleReset}
              mt={4}
            >
              重试
            </Button>
          </VStack>
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
    console.error('Error handled by hook:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
} 