"use client";

import {
  Container,
  VStack,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { FilmList } from "@/components/film-list";
import { Pagination } from "@/components/pagination";
import { useFilms } from "@/hooks/useFilms";
import { searchFilms, filterFilmsByGenre } from "@/utils/helpers";

export default function HomePage() {
  const { 
    films, 
    loading, 
    error, 
    pagination, 
    refetch, 
    changePage, 
    changePageSize 
  } = useFilms();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // 使用 useMemo 优化过滤逻辑，避免不必要的重新计算
  const filteredFilms = useMemo(() => {
    let result = films;
    
    if (searchQuery) {
      result = searchFilms(result, searchQuery);
    }
    
    if (selectedGenre) {
      result = filterFilmsByGenre(result, selectedGenre);
    }
    
    return result;
  }, [films, searchQuery, selectedGenre]);

  // 使用 useCallback 优化事件处理函数
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    changePage(1); // 重置到第一页
  }, [changePage]);

  const handleGenreChange = useCallback((genre: string) => {
    setSelectedGenre(genre);
    changePage(1); // 重置到第一页
  }, [changePage]);

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
      <VStack minH="100vh" justify="center">
        <Spinner size="xl" />
        <Text>加载中...</Text>
      </VStack>
    );
  }

  if (error && films.length === 0) {
    return (
      <VStack minH="100vh" justify="center">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </VStack>
    );
  }

  const emptyMessage = searchQuery || selectedGenre 
    ? "没有找到相关电影" 
    : "暂无电影数据";

  return (
    <>
      <Header />
      <Container maxW="1200px" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" size="xl">
            电影评分平台
          </Heading>
          
          <SearchBar
            films={films}
            searchQuery={searchQuery}
            selectedGenre={selectedGenre}
            onSearchChange={handleSearchChange}
            onGenreChange={handleGenreChange}
          />
          
          {error && films.length > 0 && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
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
        </VStack>
      </Container>
    </>
  );
} 