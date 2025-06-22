"use client";

import {
  Input,
  Select,
  Button,
  HStack,
  VStack,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, KeyboardEvent } from "react";
import { Film } from "@/types";
import { getUniqueGenres } from "@/utils/helpers";

interface SearchBarProps {
  films: Film[];
  onSearch: (query: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export function SearchBar({
  films,
  onSearch,
  selectedSort,
  onSortChange,
}: SearchBarProps) {
  const genres = getUniqueGenres(films);
  const [inputValue, setInputValue] = useState("");

  // 处理搜索
  const handleSearch = () => {
    onSearch(inputValue);
  };

  // 处理回车键搜索
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 处理类型变化
  const handleSortChange = (sort: string) => {
    onSortChange(sort);
  };

  return (
    <Box mb={6}>
      {/* 大屏幕布局：所有元素在同一行 */}
      <HStack spacing={4} display={{ base: "none", md: "flex" }}>
        <Select
          placeholder="选择类型"
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          width="200px"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
        
        <Input
          placeholder="搜索电影标题、描述或类型..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          flex={1}
        />
        
        <Button
          colorScheme="blue"
          leftIcon={<SearchIcon />}
          onClick={handleSearch}
          px={6}
        >
          搜索
        </Button>
      </HStack>

      {/* 小屏幕布局：类型选择单独一行，输入框和按钮在第二行 */}
      <VStack spacing={4} align="stretch" display={{ base: "flex", md: "none" }}>
        <Select
          placeholder="选择类型"
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          width="100%"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
        
        <HStack spacing={4}>
          <Input
            placeholder="搜索电影标题、描述或类型..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            flex={1}
          />
          
          <Button
            colorScheme="blue"
            leftIcon={<SearchIcon />}
            onClick={handleSearch}
            px={6}
          >
            搜索
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 