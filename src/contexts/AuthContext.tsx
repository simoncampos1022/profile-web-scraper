"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthContextProps } from "@/types";

export const Context = createContext<AuthContextProps>({
  isLoading: false,
  isAuthenticated: false,
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token and user in localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    setIsAuthenticated(!!newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const handleSetUser = (newUser: any | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("userId", newUser.id);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  };
  
  return (
    <Context.Provider value={{ 
      isLoading, 
      isAuthenticated, 
      token, 
      user, 
      setToken: handleSetToken,
      setUser: handleSetUser
    }}>
      {children}
    </Context.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
