import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setTokenState(storedToken);
      }
      setLoading(false);
    }
    loadToken();
  }, []);

  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem("token", newToken);
    } else {
      await AsyncStorage.removeItem("token");
    }
  };

  return <AuthContext.Provider value={{ token, setToken, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
