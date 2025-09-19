import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const { login, loading } = useAuth();

  const validarCPF = (cpfRaw: string) => {
    const cleaned = cpfRaw.replace(/[^\d]+/g, "");
    return cleaned.length === 11;
  };

  const handleLogin = async () => {
    const cpfLimpo = cpf.replace(/[^\d]+/g, "");
    if (!validarCPF(cpfLimpo)) {
      Alert.alert("CPF inválido", "Informe um CPF válido com 11 dígitos.");
      return;
    }
    if (!senha || senha.length < 6) {
      Alert.alert("Senha inválida", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      await login(cpfLimpo, senha);
      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Erro de autenticação", err.message || "CPF ou senha incorretos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#21D445FF" }}>Ainda não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#21D445FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
});
