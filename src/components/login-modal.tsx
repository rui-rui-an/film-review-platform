"use client";

import { useAuth } from "@/hooks/useAuth";
import { Box, Button, Input } from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react/dialog";
import { Field } from "@chakra-ui/react/field";
import { useToast } from "@chakra-ui/react/toast";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      toast({
        title: "登录成功",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "登录失败",
        description:
          error instanceof Error ? error.message : "请检查用户名和密码",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={{ open: isOpen, onOpenChange: onClose }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>用户登录</Dialog.Header>
          <Dialog.CloseTrigger />

          <Box as="form" onSubmit={handleSubmit} p={6}>
            <Field.Root>
              <Field.Label>用户名</Field.Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
              />
            </Field.Root>

            <Field.Root mt={4}>
              <Field.Label>密码</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </Field.Root>

            <Button type="submit" colorScheme="blue" width="100%" mt={6}>
              登录
            </Button>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
