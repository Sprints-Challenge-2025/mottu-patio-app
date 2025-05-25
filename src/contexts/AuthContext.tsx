import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Usuario {
  nome: string;
  email: string;
  senha: string;
}

interface AuthContextType {
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  user: Usuario | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const login = async (email: string, senha: string) => {
    const storedUser = await AsyncStorage.getItem("usuario");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === email && parsedUser.senha === senha) {
        await AsyncStorage.setItem("logado", "true");
        setUser(parsedUser);
        return;
      }
    }

    throw new Error("Credenciais inválidas");
  };

  const register = async (nome: string, email: string, senha: string) => {
    const existingUser = await AsyncStorage.getItem("usuario");
    if (existingUser) {
      const user = JSON.parse(existingUser);
      if (user.email === email) {
        throw new Error("Este email já está cadastrado.");
      }
    }

    const newUser = { nome, email, senha };
    await AsyncStorage.setItem("usuario", JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("logado");
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
