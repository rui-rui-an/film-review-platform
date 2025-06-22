import { AuthProvider } from "@/hooks/useAuth";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, RenderOptions } from "@testing-library/react";
import React from "react";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };
