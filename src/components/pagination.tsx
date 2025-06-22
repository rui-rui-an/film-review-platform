"use client";

import {
  HStack,
  Button,
  Box,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  // 滚动到页面顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  // 防抖处理页面切换，并滚动到顶部
  const handlePageChange = useCallback((page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
      // 页面切换后滚动到顶部
      scrollToTop();
    }
  }, [currentPage, onPageChange, scrollToTop]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数少于等于最大可见页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否则显示部分页码
      if (currentPage <= 3) {
        // 当前页在前3页
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后3页
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box py={6}>
      <HStack justify="center" align="center" spacing={2}>
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrevious}
          isDisabled={currentPage === 1}
          leftIcon={<ChevronLeftIcon />}
          _hover={{ bg: "gray.50" }}
          transition="all 0.2s"
        >
          上一页
        </Button>

        {renderPageNumbers().map((page, index) => (
          <Button
            key={index}
            size="sm"
            variant={page === currentPage ? "solid" : "outline"}
            colorScheme={page === currentPage ? "brand" : "gray"}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            isDisabled={page === "..."}
            minW="40px"
            _hover={page !== "..." ? { bg: page === currentPage ? "brand.600" : "gray.50" } : {}}
            transition="all 0.2s"
          >
            {page}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={handleNext}
          isDisabled={currentPage === totalPages}
          rightIcon={<ChevronRightIcon />}
          _hover={{ bg: "gray.50" }}
          transition="all 0.2s"
        >
          下一页
        </Button>
      </HStack>
    </Box>
  );
} 