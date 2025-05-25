import React, { useEffect, useState } from "react";
import { View, TextInput, Alert, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext"; 

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.replace("Home");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await login(email, senha);
      navigation.replace("Home");
    } catch (err) {
      Alert.alert("Erro", "Email ou senha incorretos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>MottuSense</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate("Register")} style={styles.linkText}>
        Não tem conta? Cadastre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  linkText: { marginTop: 16, textAlign: "center", color: "#176419FF" },
  button: { backgroundColor: "#29b12c", borderRadius: 8, padding: 12 },
  buttonText: { color: "#ffff", textAlign: "center" },
  appTitle: { color: "#29b12c", textAlign: "center", padding: 8, fontSize: 26, fontWeight: "bold" }
});
