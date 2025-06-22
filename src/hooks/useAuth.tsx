"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { User, UserSession } from "@/types";
import { apiClient } from "@/lib/api";

interface AuthContextType {
  user: UserSession | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const userData = await apiClient.login(username, password);
      const userSession: UserSession = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
      };
      
      setUser(userSession);
      localStorage.setItem("user", JSON.stringify(userSession));
    } catch (error) {
      throw new Error("登录失败，请检查用户名和密码");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 