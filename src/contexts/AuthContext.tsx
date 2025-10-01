import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../services/api"; // Importar as novas funções
import { Alert } from "react-native";

interface Usuario {
  id?: number; // Alterado para number para corresponder ao backend .NET
  username: string; // Alterado de 'nome' para 'username'
}

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>; // Alterado para username e password
  register: (username: string, password: string) => Promise<void>; // Alterado para username e password
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    restoreToken();
  }, []);

  const restoreToken = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const username = await AsyncStorage.getItem("username"); // Armazenar username em vez de usuario completo
      if (token && username) {
        setUser({ username }); // Criar objeto Usuario com username
      }
    } catch (err) {
      console.error("Erro restaurando token:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginUser(username, password); // Usar a nova função loginUser
      if (!data || !data.token) throw new Error("Resposta inválida do servidor.");
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("username", username); // Armazenar apenas o username
      setUser({ username }); // Definir o usuário com o username
    } catch (err: any) {
      console.error("Login erro:", err);
      Alert.alert("Erro", err.message || "Erro ao autenticar.");
      throw new Error(err.message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    try {
      await registerUser(username, password); // Usar a nova função registerUser
      Alert.alert("Sucesso", "Usuário registrado com sucesso! Faça login para continuar.");
      // Não faz login automático, o usuário deve fazer login após o registro
    } catch (err: any) {
      console.error("Register erro:", err);
      Alert.alert("Erro", err.message || "Erro ao registrar.");
      throw new Error(err.message || "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("username");
      setUser(null);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível deslogar corretamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, restoreToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
