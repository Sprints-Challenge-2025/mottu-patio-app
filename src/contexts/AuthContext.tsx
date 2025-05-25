import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Usuario {
  nome: string;
  cpf: string;
  senha: string;
}

interface AuthContextType {
  user: Usuario | null;
  login: (cpf: string, senha: string) => Promise<void>;
  register: (nome: string, cpf: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  };

  const senhaForte = (senha: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(senha);
  };

  const register = async (nome: string, cpf: string, senha: string) => {
    const cleanedCpf = cpf.replace(/[^\d]+/g, "");

    if (!validarCPF(cleanedCpf)) {
      throw new Error("CPF inválido");
    }

    if (!senhaForte(senha)) {
      throw new Error("A senha deve ter pelo menos 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.");
    }

    try {
      const usersJSON = await AsyncStorage.getItem("users");
      const users: Usuario[] = usersJSON ? JSON.parse(usersJSON) : [];

      const cpfExiste = users.some((u) => u.cpf === cleanedCpf);
      if (cpfExiste) {
        throw new Error("Já existe um usuário com esse CPF.");
      }

      const novoUsuario: Usuario = { nome, cpf: cleanedCpf, senha };
      const novosUsuarios = [...users, novoUsuario];
      await AsyncStorage.setItem("users", JSON.stringify(novosUsuarios));
      await AsyncStorage.setItem("token", "mock-token");
      await AsyncStorage.setItem("logado", "true");
      await AsyncStorage.setItem("usuario", JSON.stringify(novoUsuario));
      setUser(novoUsuario);
    } catch (error: any) {
      throw new Error(error.message || "Erro ao registrar usuário");
    }
  };

  const login = async (cpf: string, senha: string) => {
    try {
      const cleanedCpf = cpf.replace(/[^\d]+/g, "");
      const usersJSON = await AsyncStorage.getItem("users");
      const users: Usuario[] = usersJSON ? JSON.parse(usersJSON) : [];

      console.log("Tentando login com CPF:", cleanedCpf, "Senha:", senha);
      console.log("Usuários cadastrados:", users);

      const usuario = users.find((u) => u.cpf === cleanedCpf && u.senha === senha);
      if (!usuario) {
        throw new Error("CPF ou senha inválidos");
      }

      await AsyncStorage.setItem("token", "mock-token");
      await AsyncStorage.setItem("logado", "true");
      await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
      setUser(usuario);
    } catch (error: any) {
      throw new Error(error.message || "Erro ao fazer login");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("logado");
    await AsyncStorage.removeItem("usuario");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
