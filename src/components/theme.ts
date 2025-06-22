import { defineConfig } from "@chakra-ui/react";

export const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0f9ff" },
          100: { value: "#e0f2fe" },
          500: { value: "#0ea5e9" },
          600: { value: "#0284c7" },
          700: { value: "#0369a1" },
        },
      },
    },
  },
});
