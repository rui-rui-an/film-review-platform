"use client";

import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { calculateAverageRating } from "@/utils/helpers";
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface RatingFormProps {
  filmId: string;
  onReviewSubmitted: () => void;
}

// 简单的Toast组件
function Toast({
  message,
  isVisible,
  onClose,
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      top="80px"
      right="20px"
      bg="green.500"
      color="white"
      px={4}
      py={3}
      borderRadius="md"
      boxShadow="lg"
      zIndex={9999}
      maxW="300px"
    >
      <HStack justify="space-between" gap={3}>
        <HStack gap={2}>
          <Text fontSize="sm">✓</Text>
          <Text fontWeight="medium">{message}</Text>
        </HStack>
        <Button
          size="sm"
          variant="ghost"
          color="white"
          onClick={onClose}
          _hover={{ bg: "green.600" }}
          minW="auto"
          p={1}
        >
          ✕
        </Button>
      </HStack>
    </Box>
  );
}

export function RatingForm({ filmId, onReviewSubmitted }: RatingFormProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuth();
  const [loginUsername, setLoginUsername] = useState("bob");
  const [loginPassword, setLoginPassword] = useState("123456");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const {
    open: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setError("");

    try {
      // 直接调用API获取用户数据
      const loggedInUser = await apiClient.login(loginUsername, loginPassword);

      // 同时更新认证状态
      await login(loginUsername, loginPassword);

      onLoginClose();
      setLoginUsername("");
      setLoginPassword("");

      // 登录成功后直接提交评分
      await submitReview(loggedInUser.id);
    } catch (error) {
      setError("登录失败，请检查用户名和密码");
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 提取提交评分的逻辑到单独的函数
  const submitReview = async (userId?: string) => {
    // 验证观影感受是否填写
    if (!comment.trim()) {
      setError("请填写观影感受");
      return;
    }

    setIsSubmitting(true);
    setError("");
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
        commentCount: newRatingCount,
        totalCommentNum: newTotalRating,
        fraction: newAverageRating,
      });

      setScore(5); // 重置为默认五颗星
      setComment("");

      // 显示toast通知
      setShowToast(true);

      onReviewSubmitted();
    } catch (error) {
      setError("评分提交失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      // 如果未登录，显示登录对话框
      onLoginOpen();
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
        onClick={() => {
          setScore(index + 1);
        }}
        _hover={{ transform: "scale(1.1)" }}
      >
        ★
      </Button>
    ));
  };

  return (
    <>
      <Toast
        message="评分提交成功！"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <Box borderTop="1px" borderColor="gray.200" pt={8}>
        <VStack gap={6} align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            发表评价
          </Text>

          {error && (
            <Box
              p={4}
              bg="red.50"
              border="1px"
              borderColor="red.200"
              borderRadius="md"
            >
              <Text color="red.600">{error}</Text>
            </Box>
          )}

          {/* 评分表单 - 始终显示 */}
          <Box p={6} border="1px" borderColor="gray.200" borderRadius="lg">
            <VStack gap={4} align="stretch">
              <Box>
                <Text mb={2} fontWeight="medium">
                  评分
                </Text>
                <HStack gap={2}>
                  {renderStars()}
                  <Text ml={2} color="gray.600">
                    {score} 星
                  </Text>
                </HStack>
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">
                  观影感受{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>
                <Textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  placeholder="请分享您的观影感受（必填）..."
                  rows={4}
                  required
                />
              </Box>

              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
                size="lg"
              >
                {isSubmitting
                  ? "提交中..."
                  : !comment.trim()
                    ? "请填写观影感受"
                    : !user
                      ? "请登录后再提交评分"
                      : "提交评分"}
              </Button>
            </VStack>
          </Box>

          {/* 登录对话框 */}
          {isLoginOpen && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(0, 0, 0, 0.5)"
              zIndex={1000}
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={onLoginClose}
            >
              <Box
                bg="white"
                borderRadius="lg"
                p={6}
                maxW="400px"
                w="90%"
                onClick={(e) => e.stopPropagation()}
              >
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    用户登录
                  </Text>
                  <Button size="sm" variant="ghost" onClick={onLoginClose}>
                    ✕
                  </Button>
                </HStack>

                <Box as="form" onSubmit={handleLogin}>
                  <VStack gap={4}>
                    <Box width="100%">
                      <Text mb={2} fontWeight="medium">
                        用户名
                      </Text>
                      <Input
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="请输入密码"
                        required
                      />
                    </Box>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="100%"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "登录中..." : "登录"}
                    </Button>
                  </VStack>
                </Box>
              </Box>
            </Box>
          )}
        </VStack>
      </Box>
    </>
  );
}
