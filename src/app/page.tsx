"use client";

import { FilmList } from "@/components/film-list";
import { Header } from "@/components/header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { useFilms } from "@/hooks/useFilms";
import {
  Box,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Alert } from "@chakra-ui/react/alert";
import { useCallback, useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function HomePage() {
  const {
    films,
    loading,
    error,
    pagination,
    refetch,
    changePage,
    changePageSize,
  } = useFilms();

  // 只用后端搜索和筛选
  const searchRef = useRef("");
  const sortRef = useRef("");

  const handleSearch = useCallback(
    (query: string) => {
      searchRef.current = query;
      refetch({ search: query, sort: sortRef.current });
    },
    [refetch]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      sortRef.current = sort;
      refetch({ search: searchRef.current, sort });
    },
    [refetch]
  );

  // 页面获得焦点时刷新数据
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetch]);

  // 只在初始加载时显示全屏加载状态
  if (loading && films.length === 0) {
    return (
      <Stack minH="100vh" justify="center" align="center">
        <Spinner size="xl" />
        <Text>加载中...</Text>
      </Stack>
    );
  }

  if (error && films.length === 0) {
    return (
      <Stack minH="100vh" justify="center" align="center">
        <Alert.Root status="error">
          <FiAlertTriangle />
          <Text ml={2}>{error}</Text>
        </Alert.Root>
      </Stack>
    );
  }

  const emptyMessage =
    searchRef.current || sortRef.current
      ? "没有找到匹配的电影"
      : "暂无电影数据";

  return (
    <Box>
      <Header />
      <Container maxW="1200px" mx="auto" py={8}>
        <Stack direction="column" gap={8}>
          <Heading textAlign="center" size="xl">
            电影评分平台
          </Heading>

          <SearchBar
            films={films}
            onSearch={handleSearch}
            selectedSort={sortRef.current}
            onSortChange={handleSortChange}
          />

          {error && films.length > 0 && (
            <Alert.Root status="error" mb={4}>
              <FiAlertTriangle />
              <Text ml={2}>{error}</Text>
            </Alert.Root>
          )}

          <FilmList
            films={films}
            loading={loading}
            error={error}
            emptyMessage={emptyMessage}
          />

          {films.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              pageSize={pagination.pageSize}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}
