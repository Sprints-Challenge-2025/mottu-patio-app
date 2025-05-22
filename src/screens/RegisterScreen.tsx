import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import api from "../api/api";

export function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    setError("");
    try {
      await api.post("/register", { email, senha });
      alert("Cadastro realizado! Faça login.");
      navigation.goBack();
    } catch {
      setError("Erro ao cadastrar");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      {!!error && <Text style={styles.error}>{error}</Text>}
      {loading ? <ActivityIndicator /> : <Button title="Cadastrar" onPress={handleRegister} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 15, paddingHorizontal: 10, height: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  error: { color: "red", marginBottom: 10 },
});
