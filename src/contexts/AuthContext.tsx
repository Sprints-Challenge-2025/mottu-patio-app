import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  register: (userData: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);



  // 🔹 Login do usuário (implementação mock para integração)
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Simular uma chamada de API de login
      const response = await apiFetch("/auth/login", { // Assumindo um endpoint de login no backend Java
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      // Assumindo que a resposta contém um token e informações do usuário
      const data = { username: response.username, token: response.token };
      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
      Alert.alert("Sucesso", "Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao logar:", error);
      Alert.alert("Erro", error.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Registrar usuário
  const register = async (userData: { username: string; password: string }) => {
    setLoading(true);
    try {
      await registerUser(userData);
      Alert.alert("Sucesso", "Usuário registrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      Alert.alert("Erro", error.message || "Não foi possível registrar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
