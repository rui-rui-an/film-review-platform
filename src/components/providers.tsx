"use client";

import { ChakraProvider, createSystem } from "@chakra-ui/react";
import { theme } from "./theme";

const system = createSystem(theme);

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
