"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Film } from "@/types";
import { apiClient } from "@/lib/api";

interface FilmsResponse {
  data: Film[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

interface FilmsState {
  films: Film[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: FilmsState = {
  films: [],
  loading: true,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: 12,
  },
};

export function useFilms() {
  const [state, setState] = useState<FilmsState>(initialState);

  const fetchFilms = useCallback(async (params?: { 
    search?: string; 
    sort?: string;
    page?: number;
    pageSize?: number;
    showLoading?: boolean;
  }) => {
    try {
      // 只有在需要时才显示加载状态
      if (params?.showLoading !== false) {
        setState(prev => ({ ...prev, loading: true }));
      }
      setState(prev => ({ ...prev, error: null }));
      
      const page = params?.page || state.pagination.currentPage;
      const pageSize = params?.pageSize || state.pagination.pageSize;
      
      const response: FilmsResponse = await apiClient.getFilms({
        search: params?.search,
        sort: params?.sort,
        page,
        pageSize,
      });
      
      setState(prev => ({
        ...prev,
        films: response.data,
        pagination: {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
          pageSize,
        },
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "获取电影列表失败",
        loading: false,
      }));
    }
  }, [state.pagination.currentPage, state.pagination.pageSize]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const changePage = useCallback((page: number) => {
    fetchFilms({ page, showLoading: false });
  }, [fetchFilms]);

  const changePageSize = useCallback((pageSize: number) => {
    fetchFilms({ pageSize, page: 1, showLoading: false });
  }, [fetchFilms]);

  const refetch = useCallback((params?: { search?: string; sort?: string }) => {
    fetchFilms({
      ...params,
      page: 1,
      showLoading: true,
    });
  }, [fetchFilms]);

  // 使用 useMemo 优化返回值，避免不必要的重渲染
  const memoizedPagination = useMemo(() => state.pagination, [state.pagination]);

  return {
    films: state.films,
    loading: state.loading,
    error: state.error,
    pagination: memoizedPagination,
    refetch,
    changePage,
    changePageSize,
  };
}

export function useFilm(id: string) {
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFilm = useCallback(async () => {
    if (!id) {
      setFilm(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await apiClient.getFilm(id);
      setFilm(data);
    } catch (err) {
      // 静默处理错误，不设置错误状态
      console.error("Failed to fetch film:", err);
      setFilm(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFilm();
  }, [fetchFilm]);

  return { 
    film, 
    loading,
    refetch: fetchFilm 
  };
} 