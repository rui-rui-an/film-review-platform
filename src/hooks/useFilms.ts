"use client";

import { apiClient } from "@/lib/api";
import { Film } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

// 全局同步search/sort
type SearchSort = { search: string; sort: string };

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
  const [searchSort, setSearchSort] = useState<SearchSort>({
    search: "",
    sort: "",
  });
  const searchSortRef = useRef<SearchSort>({ search: "", sort: "" });

  // 同步ref和state
  useEffect(() => {
    searchSortRef.current = searchSort;
  }, [searchSort]);

  const fetchFilms = useCallback(
    async (params?: {
      search?: string;
      sort?: string;
      page?: number;
      pageSize?: number;
      showLoading?: boolean;
    }) => {
      try {
        // 只有在需要时才显示加载状态
        if (params?.showLoading !== false) {
          setState((prev) => ({ ...prev, loading: true }));
        }
        setState((prev) => ({ ...prev, error: null }));

        const page =
          params?.page !== undefined
            ? params.page
            : state.pagination.currentPage;
        const pageSize =
          params?.pageSize !== undefined
            ? params.pageSize
            : state.pagination.pageSize;
        // 搜索和排序参数：优先使用传入的参数，否则使用当前状态
        const search =
          params?.search !== undefined
            ? params.search
            : searchSortRef.current.search
              ? searchSortRef.current.search
              : undefined;
        const sort =
          params?.sort !== undefined
            ? params.sort
            : searchSortRef.current.sort
              ? searchSortRef.current.sort
              : undefined;

        const response: FilmsResponse = await apiClient.getFilms({
          search,
          sort,
          page,
          pageSize,
        });

        setState((prev) => ({
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
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "获取电影列表失败",
          loading: false,
        }));
      }
    },
    [state.pagination.currentPage, state.pagination.pageSize]
  );

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const changePage = useCallback(
    (page: number) => {
      fetchFilms({ page, showLoading: false });
    },
    [fetchFilms]
  );

  const changePageSize = useCallback(
    (pageSize: number) => {
      fetchFilms({ pageSize, page: 1, showLoading: false });
    },
    [fetchFilms]
  );

  const refetch = useCallback(
    (params?: { search?: string; sort?: string }) => {
      if (params?.search !== undefined || params?.sort !== undefined) {
        setSearchSort((prev) => ({
          search: params?.search !== undefined ? params.search : prev.search,
          sort: params?.sort !== undefined ? params.sort : prev.sort,
        }));
      }
      fetchFilms({
        search: params?.search,
        sort: params?.sort,
        page: 1,
        showLoading: true,
      });
    },
    [fetchFilms]
  );

  // 使用 useMemo 优化返回值，避免不必要的重渲染
  const memoizedPagination = useMemo(
    () => state.pagination,
    [state.pagination]
  );

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
    refetch: fetchFilm,
  };
}
