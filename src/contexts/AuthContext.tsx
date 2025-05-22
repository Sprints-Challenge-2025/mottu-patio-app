import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "../api/api";

interface AuthContextType {
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, senha: string) => {
    const res = await api.post("/auth/login", { email, senha });
    const usuarioLogado = res.data;
    setUser(usuarioLogado);
    // Aqui você pode salvar token com AsyncStorage se desejar
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
