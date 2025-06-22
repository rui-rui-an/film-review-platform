"use client";

import { Film } from "@/types";
import { formatDate } from "@/utils/helpers";
import { Badge, Box, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  // 使用固定的颜色值，因为 Chakra UI v3 的颜色模式处理方式不同
  const bgColor = "white";
  const borderColor = "gray.200";

  return (
    <Link href={`/film/${film.id}`} style={{ textDecoration: "none" }}>
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        transition="all 0.2s"
        _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        height="500px"
        display="flex"
        flexDirection="column"
      >
        <img
          src={film.posterUrl || "/movie-poster.jpeg"}
          alt={film.movieName}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />

        <Box p={4} flex="1" display="flex" flexDirection="column">
          <VStack align="start" gap={3} flex="1">
            <Text
              fontSize="lg"
              fontWeight="bold"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: "1.4",
                minHeight: "2.8em",
              }}
            >
              {film.movieName}
            </Text>

            <Text
              fontSize="sm"
              color="gray.600"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: "1.4",
                minHeight: "2.8em",
              }}
              flex="1"
            >
              {film.des}
            </Text>

            <HStack gap={2} flexWrap="wrap" mt="auto">
              {film.sort.map((genre: string) => (
                <Badge key={genre} colorScheme="blue" variant="subtle">
                  {genre}
                </Badge>
              ))}
            </HStack>

            <HStack gap={2} fontSize="sm" color="gray.500">
              <Text>{formatDate(film.publichTime)}</Text>
              <Text>•</Text>
              <Text>
                评分: {film.fraction ? film.fraction.toFixed(1) : "暂无"}（
                {film.commentCount ?? 0} 评价）
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Link>
  );
}
