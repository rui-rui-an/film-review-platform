"use client";

import { Header } from "@/components/header";
import { RatingForm } from "@/components/rating-form";
import { useAuth } from "@/hooks/useAuth";
import { useFilm } from "@/hooks/useFilms";
import { apiClient } from "@/lib/api";
import { Film, Review, User } from "@/types";
import { formatDate } from "@/utils/helpers";
import {
  Badge,
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ReviewWithUser extends Review {
  user?: User;
}

export default function FilmDetailPage() {
  const params = useParams();
  const filmId = params.id as string;
  const { film: initialFilm, loading } = useFilm(filmId);
  const [film, setFilm] = useState<Film | null>(null);
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // 当初始电影数据加载完成后，更新本地状态
  useEffect(() => {
    if (initialFilm) {
      setFilm(initialFilm);
    }
  }, [initialFilm]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await apiClient.getReviews(filmId);

      // 获取每个评论的用户信息
      const reviewsWithUsers = await Promise.all(
        reviewsData.map(async (review) => {
          try {
            const userData = await apiClient.getUser(review.userId);
            return { ...review, user: userData };
          } catch (error) {
            console.error(`Failed to fetch user ${review.userId}:`, error);
            return { ...review, user: undefined };
          }
        })
      );

      // 按时间戳倒序排列，最新的评论在前面
      const sortedReviews = reviewsWithUsers.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setReviews(sortedReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  }, [filmId]);

  const handleReviewSubmitted = useCallback(async () => {
    // 重新获取评论
    await fetchReviews();

    // 重新获取电影数据以更新评分
    try {
      const updatedFilm = await apiClient.getFilm(filmId);
      setFilm(updatedFilm);
    } catch (error) {
      console.error("Failed to fetch updated film data:", error);
    }
  }, [fetchReviews, filmId]);

  useEffect(() => {
    if (filmId) {
      fetchReviews();
    }
  }, [filmId, fetchReviews]);

  // 显示加载状态 - 只要在加载中或没有电影数据就显示加载
  if (loading || !film) {
    return (
      <>
        <Header />
        <VStack minH="80vh" justify="center">
          <Spinner size="xl" />
          <Text>加载中...</Text>
        </VStack>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxW="1200px" py={8} mx="auto">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          <GridItem>
            <Image
              src={film.posterUrl || "/movie-poster.jpeg"}
              alt={film.movieName}
              borderRadius="lg"
            />
          </GridItem>

          <GridItem>
            <VStack align="start" gap={4}>
              <Heading size="xl">{film.movieName}</Heading>

              <HStack gap={2} flexWrap="wrap">
                {film.sort.map((genre) => (
                  <Badge key={genre} colorScheme="blue" variant="subtle">
                    {genre}
                  </Badge>
                ))}
              </HStack>

              <Text fontSize="lg" lineHeight="tall">
                {film.des}
              </Text>

              <HStack gap={4}>
                <Text>上映日期: {formatDate(film.publichTime)}</Text>
                <Text>
                  评分: {film.fraction.toFixed(1)} ({film.commentCount} 评价)
                </Text>
              </HStack>
            </VStack>
          </GridItem>
        </Grid>

        <Box borderTop="1px" borderColor="gray.200" my={8} />

        <VStack gap={8} align="stretch">
          <Heading size="lg">用户评价</Heading>

          {reviewsLoading ? (
            <VStack py={8}>
              <Spinner />
              <Text>加载评价中...</Text>
            </VStack>
          ) : reviews.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              还没有用户评价，成为第一个评价的人吧！
            </Text>
          ) : (
            <VStack gap={4} align="stretch">
              {reviews.map((review) => (
                <Box
                  key={review.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                >
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" width="100%">
                      <Text fontWeight="bold">
                        {review.user
                          ? review.user.username
                          : `用户 ${review.userId}`}
                      </Text>
                      <HStack gap={1}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Text
                            key={i}
                            color={i < review.score ? "yellow.400" : "gray.300"}
                          >
                            ★
                          </Text>
                        ))}
                        <Text fontSize="sm" color="gray.500">
                          {review.score} 星
                        </Text>
                      </HStack>
                    </HStack>

                    {review.comment && (
                      <Text color="gray.700">{review.comment}</Text>
                    )}

                    <Text fontSize="sm" color="gray.500">
                      {formatDate(review.timestamp)}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>

        <Box mt={8}>
          <RatingForm
            filmId={filmId}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </Box>
      </Container>
    </>
  );
}
