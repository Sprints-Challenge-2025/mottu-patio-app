import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "../services/api";
import { Alert } from "react-native";

interface Usuario {
  id?: string;
  nome: string;
  cpf: string;
}

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (cpf: string, senha: string) => Promise<void>;
  register: (nome: string, cpf: string, senha: string) => Promise<void>;
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
      const usuarioStr = await AsyncStorage.getItem("usuario");
      if (token && usuarioStr) {
        setUser(JSON.parse(usuarioStr));
      }
    } catch (err) {
      console.error("Erro restaurando token:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (cpf: string, senha: string) => {
    setLoading(true);
    try {
      const payload = { cpf, senha };
      // espera que o backend retorne { token: '...', usuario: { id, nome, cpf } }
      const data = await apiPost("/auth/login", payload);
      if (!data || !data.token) throw new Error("Resposta inválida do servidor.");
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));
      setUser(data.usuario);
    } catch (err: any) {
      console.error("Login erro:", err);
      throw new Error(err.message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome: string, cpf: string, senha: string) => {
    setLoading(true);
    try {
      // espera que /users crie o usuário e retorne o usuário criado
      const data = await apiPost("/users", { nome, cpf, senha });
      // opcionalmente fazer login automático se backend retornar token:
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));
        setUser(data.usuario);
      } else {
        // salvar usuário localmente para experiência offline mínima
        await AsyncStorage.setItem("usuario", JSON.stringify(data));
        setUser(data);
      }
    } catch (err: any) {
      console.error("Register erro:", err);
      throw new Error(err.message || "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // tentar avisar backend (opcional). Ignorar falhas.
      try {
        await apiPost("/auth/logout", {});
      } catch (e) {
        // sem problemas
      }
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("usuario");
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
