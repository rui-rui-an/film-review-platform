"use client";

import { Film } from "@/types";
import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RatingForm } from "./rating-form";

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 使用固定的颜色值，因为 Chakra UI v3 的颜色模式处理方式不同
  const bgColor = "white";
  const borderColor = "gray.200";

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
    >
      <Image
        src={film.poster || "/movie-poster.jpeg"}
        alt={film.title}
        width="100%"
        height="300px"
        objectFit="cover"
      />

      <Box p={4}>
        <VStack align="start" spacing={3}>
          <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
            {film.title}
          </Text>

          <Text fontSize="sm" color="gray.600" noOfLines={3}>
            {film.description}
          </Text>

          <HStack spacing={2} flexWrap="wrap">
            {film.genre.split(", ").map((genre) => (
              <Badge key={genre} colorScheme="blue" variant="subtle">
                {genre}
              </Badge>
            ))}
          </HStack>

          <HStack justify="space-between" width="100%">
            <Text fontSize="sm" color="gray.500">
              评分: {film.rating || "暂无"}
            </Text>
            <Button size="sm" colorScheme="blue" onClick={onOpen}>
              评分
            </Button>
          </HStack>
        </VStack>
      </Box>

      <RatingForm filmId={film.id} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
