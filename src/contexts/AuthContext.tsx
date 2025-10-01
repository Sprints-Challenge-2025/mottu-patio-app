import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../services/api";
import { Alert } from "react-native";

interface Usuario {
  id?: number;
  username: string;
  token?: string;
}

interface AuthContextType {
  user: Usuario | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  // 🔹 Registrar usuário
  const register = async (userData: { username: string; password: string }) => {
    try {
      await registerUser(userData);
      Alert.alert("Sucesso", "Usuário registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
    }
  };

  // 🔹 Login do usuário
  const login = async (username: string, password: string) => {
    try {
      const data = await loginUser({ username, password });
      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao logar:", error);
      Alert.alert("Erro", "Credenciais inválidas.");
    }
  };

  // 🔹 Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
