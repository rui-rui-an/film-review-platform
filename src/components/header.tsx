"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  Portal,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { LoginModal } from "./login-modal";

export function Header() {
  const { user, logout } = useAuth();

  // 使用固定的颜色值，因为 Chakra UI v3 的颜色模式处理方式不同
  const headerBg = "white";
  const borderColor = "gray.200";
  const welcomeTextColor = "gray.600";

  return (
    <Box
      as="header"
      bg={headerBg}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
      w="100%"
    >
      <Flex px={4} py={4} justify="space-between" align="center">
        <Box>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="blue.500"
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              电影评分平台
            </Text>
          </Link>
        </Box>

        <HStack gap={4}>
          <Text color={welcomeTextColor}>欢迎来到电影评分平台</Text>
          {user ? (
            <>
              <Text color="blue.600">{user.username}</Text>
              <Button onClick={logout}>退出</Button>
            </>
          ) : (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button colorScheme="blue">登录</Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <LoginModal />
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
