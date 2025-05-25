import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();

  useEffect(() => {
    const verificarLogin = async () => {
      const logado = await AsyncStorage.getItem("logado");
      if (logado === "true") {
        navigation.replace("Home");
      }
    };
    verificarLogin();
  }, []);

  const validarCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/[^\d]+/g, "");
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i);
    let check1 = (sum * 10) % 11;
    if (check1 === 10 || check1 === 11) check1 = 0;
    if (check1 !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i);
    let check2 = (sum * 10) % 11;
    if (check2 === 10 || check2 === 11) check2 = 0;
    return check2 === parseInt(cleaned.charAt(10));
  };

  const handleLogin = async () => {
    if (!cpf || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const cpfLimpo = cpf.replace(/[^\d]/g, "");

    if (!validarCPF(cpfLimpo)) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await login(cpfLimpo, senha);
      navigation.replace("Home");
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", error.message || "CPF ou senha incorretos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>MottuSense</Text>
      <TextInput
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <Text
        onPress={() => navigation.navigate("Register")}
        style={styles.linkText}
      >
        Não tem conta? Cadastre-se
      </Text>
      <Text
        onPress={() => navigation.navigate("Inicial")}
        style={styles.linkText}
      >
        Voltar para o início
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1C1C1C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: "#ccc",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#29b12c",
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 16,
    textAlign: "center",
    color: "#228B22",
    fontSize: 17,
  },
  appTitle: {
    color: "#29b12c",
    textAlign: "center",
    padding: 8,
    fontSize: 28,
    fontWeight: "bold",
  },
});
