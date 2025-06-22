"use client";

import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "./login-modal";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // 颜色模式值
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const welcomeTextColor = useColorModeValue("gray.600", "gray.300");

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <Box as="header" bg={headerBg} boxShadow="sm" borderBottom="1px" borderColor={borderColor}>
      <Flex maxW="1200px" mx="auto" px={4} py={4} align="center" justify="space-between">
        <Heading 
          size="lg" 
          color="brand.600"
          cursor="pointer"
          onClick={handleLogoClick}
          _hover={{ color: "brand.500" }}
          transition="color 0.2s"
        >
          电影评分平台
        </Heading>
        
        <HStack spacing={4}>
          {user ? (
            <HStack spacing={2}>
              <Text fontSize="sm" color={welcomeTextColor}>
                欢迎，{user.username}
              </Text>
              <Button size="sm" variant="outline" onClick={logout}>
                退出
              </Button>
            </HStack>
          ) : (
            <LoginModal />
          )}
        </HStack>
      </Flex>
    </Box>
  );
} 