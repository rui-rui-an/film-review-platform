import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "电影评分平台",
  description: "发现精彩电影，分享你的观影感受",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <Providers>
            <AuthProvider>
              {children}
            </AuthProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
} 