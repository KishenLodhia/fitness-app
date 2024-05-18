// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  userToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  const login = async (token: string) => {
    setUserToken(token);
    await AsyncStorage.setItem("userToken", token);
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem("userToken");
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return <AuthContext.Provider value={{ userToken, login, logout }}>{children}</AuthContext.Provider>;
};
