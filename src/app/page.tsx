"use client";

import { FilmList } from "@/components/film-list";
import { Header } from "@/components/header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { useFilms } from "@/hooks/useFilms";
import { filterFilmsByGenre, searchFilms } from "@/utils/helpers";
import { Container, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { Alert } from "@chakra-ui/react/alert";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  // 使用 useMemo 优化过滤逻辑，避免不必要的重新计算
  const filteredFilms = useMemo(() => {
    let result = films;

    if (searchQuery) {
      result = searchFilms(result, searchQuery);
    }

    if (selectedSort) {
      result = filterFilmsByGenre(result, selectedSort);
    }

    return result;
  }, [films, searchQuery, selectedSort]);

  // 使用 useCallback 优化事件处理函数
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSelectedSort(sort);
  }, []);

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
    searchQuery || selectedSort ? "没有找到匹配的电影" : "暂无电影数据";

  return (
    <>
      <Header />
      <Container maxW="1200px" py={8}>
        <Stack direction="column" gap={8}>
          <Heading textAlign="center" size="xl">
            电影评分平台
          </Heading>

          <SearchBar
            films={films}
            onSearch={handleSearch}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
          />

          {error && films.length > 0 && (
            <Alert.Root status="error" mb={4}>
              <FiAlertTriangle />
              <Text ml={2}>{error}</Text>
            </Alert.Root>
          )}

          <FilmList
            films={filteredFilms}
            loading={loading}
            error={error}
            emptyMessage={emptyMessage}
          />

          {filteredFilms.length > 0 && (
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
    </>
  );
}
