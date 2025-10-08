import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const { register, loading } = useAuth();

  const validarSenhaForte = (s: string) => {
    return s.length >= 6; 
  };

  const handleRegister = async () => {
    if (!username || username.length < 3) {
      Alert.alert("Nome de usuário inválido", "Informe um nome de usuário válido (mínimo 3 caracteres).");
      return;
    }
    if (!validarSenhaForte(password)) {
      Alert.alert(
        "Senha fraca",
        "A senha deve ter pelo menos 6 caracteres."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Confirmação", "As senhas não coincidem.");
      return;
    }

    try {
      await register(username, password);
      
      navigation.replace("Login"); 
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível cadastrar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput placeholder="Nome de Usuário" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#21D445FF" }}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, marginBottom: 10, borderRadius: 8 },
  button: { backgroundColor: "#21D445FF", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
});

