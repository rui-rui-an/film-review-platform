"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { LoginModal } from "./login-modal";

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 使用固定的颜色值，因为 Chakra UI v3 的颜色模式处理方式不同
  const headerBg = "white";
  const borderColor = "gray.200";
  const welcomeTextColor = "gray.600";

  return (
    <Box
      as="header"
      bg={headerBg}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        py={4}
        justify="space-between"
        align="center"
      >
        <Text fontSize="xl" fontWeight="bold" color="blue.500">
          电影评分平台
        </Text>

        <HStack spacing={4}>
          <Text color={welcomeTextColor}>欢迎来到电影评分平台</Text>
          <Button colorScheme="blue" onClick={onOpen}>
            登录
          </Button>
        </HStack>
      </Flex>

      <LoginModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
