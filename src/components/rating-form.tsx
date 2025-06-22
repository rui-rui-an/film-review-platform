"use client";

import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { calculateAverageRating } from "@/utils/helpers";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react/dialog";
import { Field } from "@chakra-ui/react/field";
import { useState } from "react";

interface RatingFormProps {
  filmId: string;
  onReviewSubmitted: () => void;
}

export function RatingForm({ filmId, onReviewSubmitted }: RatingFormProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuth();
  const toast = useToast();

  // 登录模态框状态
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loginUsername, setLoginUsername] = useState("bob");
  const [loginPassword, setLoginPassword] = useState("123456");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      // 直接调用API获取用户数据
      const loggedInUser = await apiClient.login(loginUsername, loginPassword);

      // 同时更新认证状态
      await login(loginUsername, loginPassword);

      toast({
        title: "登录成功",
        status: "success",
        duration: 3000,
      });
      onClose();
      setLoginUsername("");
      setLoginPassword("");

      // 登录成功后直接提交评分
      await submitReview(loggedInUser.id);
    } catch (error) {
      toast({
        title: "登录失败",
        description:
          error instanceof Error ? error.message : "请检查用户名和密码",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 提取提交评分的逻辑到单独的函数
  const submitReview = async (userId?: string) => {
    // 验证观影感受是否填写
    if (!comment.trim()) {
      toast({
        title: "请填写观影感受",
        description: "观影感受是必填项，请分享您的观影体验",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 确定要使用的用户ID
      const currentUserId = userId || user?.id;

      if (!currentUserId) {
        throw new Error("用户信息获取失败，请重新登录");
      }

      // 1. 创建评论
      await apiClient.createReview({
        userId: currentUserId,
        filmId,
        score,
        comment: comment.trim(),
        timestamp: Date.now(),
      });

      // 2. 获取该电影的所有评论
      const reviews = await apiClient.getReviews(filmId);

      // 3. 计算新的平均评分
      const newAverageRating = calculateAverageRating(reviews);
      const newRatingCount = reviews.length;
      const newTotalRating = reviews.reduce(
        (sum, review) => sum + review.score,
        0
      );

      // 4. 更新电影的平均评分数据
      await apiClient.updateFilmRating(filmId, {
        ratingCount: newRatingCount,
        totalRating: newTotalRating,
        averageRating: newAverageRating,
      });

      toast({
        title: "评分提交成功",
        status: "success",
        duration: 3000,
      });

      setScore(5); // 重置为默认五颗星
      setComment("");
      onReviewSubmitted();
    } catch (error) {
      toast({
        title: "评分提交失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      // 如果未登录，显示登录模态框
      onOpen();
      return;
    }

    await submitReview();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Button
        key={index}
        size="sm"
        variant={index < score ? "solid" : "outline"}
        colorScheme={index < score ? "yellow" : "gray"}
        onClick={() => setScore(index + 1)}
        _hover={{ transform: "scale(1.1)" }}
      >
        ★
      </Button>
    ));
  };

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={{ open: isOpen, onOpenChange: onClose }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>电影评分</Dialog.Header>
            <Dialog.CloseTrigger />

            <Box as="form" onSubmit={handleSubmit} p={6}>
              <Field.Root>
                <Field.Label>评分</Field.Label>
                <HStack spacing={2}>
                  {renderStars()}
                  <Text ml={2} color="gray.600">
                    {score} 星
                  </Text>
                </HStack>
              </Field.Root>

              <Field.Root mt={4}>
                <Field.Label>评论</Field.Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="请输入评论（可选）"
                  rows={4}
                />
              </Field.Root>

              <Button type="submit" colorScheme="blue" width="100%" mt={6}>
                提交评分
              </Button>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* 登录模态框 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>请先登录</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleLogin}>
              <VStack spacing={4}>
                <Text color="gray.600" fontSize="sm">
                  登录后即可提交您的评分和评论
                </Text>

                <FormControl isRequired>
                  <FormLabel>用户名</FormLabel>
                  <Input
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="请输入用户名"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>密码</FormLabel>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="请输入密码"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  isLoading={isLoginLoading}
                >
                  登录并提交评分
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
