"use client";

import { useAuth } from "@/hooks/useAuth";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

export function LoginModal({
  onSuccess,
  onClose,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const [username, setUsername] = useState("bob");
  const [password, setPassword] = useState("123456");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(username, password);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      setError("登录失败，请检查用户名和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={6}
      w="100%"
      boxShadow="lg"
      position="relative"
    >
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          用户登录
        </Text>
        {onClose && (
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        )}
      </HStack>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Box width="100%">
            <Text mb={2} fontWeight="medium">
              用户名
            </Text>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </Box>
          <Box width="100%">
            <Text mb={2} fontWeight="medium">
              密码
            </Text>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </Box>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            disabled={isLoading}
          >
            {isLoading ? "登录中..." : "登录"}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
