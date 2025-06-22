"use client";

import { Film } from "@/types";
import { getUniqueGenres } from "@/utils/helpers";
import { Box, Button, Input } from "@chakra-ui/react";
import { KeyboardEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";

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
    if (e.key === "Enter") {
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
      <Box display={{ base: "none", md: "flex" }} gap={4}>
        <select
          value={selectedSort}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleSortChange(e.target.value)
          }
          style={{
            width: "200px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
          }}
        >
          <option value="">选择类型</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <Input
          placeholder="搜索电影标题、描述或类型..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          flex={1}
        />

        <Button colorScheme="blue" onClick={handleSearch} px={6}>
          <FiSearch style={{ marginRight: "8px" }} />
          搜索
        </Button>
      </Box>

      {/* 小屏幕布局：类型选择单独一行，输入框和按钮在第二行 */}
      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        gap={4}
      >
        <select
          value={selectedSort}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleSortChange(e.target.value)
          }
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
          }}
        >
          <option value="">选择类型</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <Box display="flex" gap={4}>
          <Input
            placeholder="搜索电影标题、描述或类型..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            flex={1}
          />

          <Button colorScheme="blue" onClick={handleSearch} px={6}>
            <FiSearch style={{ marginRight: "8px" }} />
            搜索
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
