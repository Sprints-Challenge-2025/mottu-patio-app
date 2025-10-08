import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch, registerUser } from "../services/api";
import { Alert } from "react-native";

interface Usuario {
  id?: number;
  username: string;
  token?: string;
}

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("user");
        if (isMounted && raw) {
          setUser(JSON.parse(raw));
        }
      } catch (error) {
        console.warn("Erro ao carregar usuário do storage", error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const resp = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const loggedUser: Usuario = {
        username,
        token: resp?.token,
        id: resp?.id,
      };
      setUser(loggedUser);
      await AsyncStorage.setItem("user", JSON.stringify(loggedUser));
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", error?.message ?? "Erro ao efetuar login");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      await registerUser(data);
      Alert.alert("Sucesso", "Usuário registrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      Alert.alert("Erro", error?.message ?? "Erro ao realizar registro");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
