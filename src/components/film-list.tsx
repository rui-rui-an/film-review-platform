import { Film } from "@/types";
import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { FilmCard } from "./film-card";

interface FilmListProps {
  films: Film[];
  loading: boolean;
  error?: string | null;
  emptyMessage?: string;
}

// 骨架屏组件
const FilmListSkeleton = memo(() => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} height="400px" borderRadius="md" />
    ))}
  </SimpleGrid>
));

FilmListSkeleton.displayName = "FilmListSkeleton";

// 优化的电影列表组件
export const FilmList = memo<FilmListProps>(
  ({ films, loading, error, emptyMessage = "暂无电影数据" }) => {
    // 使用 useMemo 优化渲染
    const memoizedFilms = useMemo(() => films, [films]);

    if (loading) {
      return <FilmListSkeleton />;
    }

    if (error) {
      return (
        <Text textAlign="center" color="red.500" py={8}>
          {error}
        </Text>
      );
    }

    if (memoizedFilms.length === 0) {
      return (
        <Text textAlign="center" color="gray.500" py={12}>
          {emptyMessage}
        </Text>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
        {memoizedFilms.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </SimpleGrid>
    );
  }
);

FilmList.displayName = "FilmList";
