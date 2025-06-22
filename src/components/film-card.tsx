"use client";

import {
  Box,
  Image,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Film } from "@/types";
import { formatDate } from "@/utils/helpers";
import Link from "next/link";
import moviePoster from "@/assets/movie-poster.jpeg";

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Link href={`/film/${film.id}`}>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
        cursor="pointer"
      >
        <Image
          src={film.posterUrl || moviePoster.src}
          alt={film.title}
          height="300px"
          width="100%"
          objectFit="cover"
          fallbackSrc={moviePoster.src}
        />
        
        <Box p={4}>
          <VStack align="start" spacing={2}>
            <Heading size="md" noOfLines={2}>
              {film.title}
            </Heading>
            
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {film.description}
            </Text>
            
            <HStack spacing={2} flexWrap="wrap">
              {film.genre.slice(0, 3).map((genre) => (
                <Badge key={genre} colorScheme="blue" variant="subtle">
                  {genre}
                </Badge>
              ))}
            </HStack>
            
            <HStack justify="space-between" width="100%">
              <Text fontSize="sm" color="gray.500">
                {formatDate(film.releaseDate)}
              </Text>
              <HStack spacing={1}>
                <Text fontSize="sm" fontWeight="bold">
                  {film.averageRating.toFixed(1)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  ({film.ratingCount} 评价)
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Link>
  );
} 