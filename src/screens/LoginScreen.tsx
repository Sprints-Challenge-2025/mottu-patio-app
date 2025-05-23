import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    const verificarLogin = async () => {
      const logado = await AsyncStorage.getItem("logado");
      if (logado === "true") {
        navigation.replace("Home");
      }
    };
  
    verificarLogin();
  }, []);
  

  const handleLogin = async () => {
    const storedUser = await AsyncStorage.getItem("usuario");
  
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email && user.senha === senha) {
        await AsyncStorage.setItem("logado", "true");
        navigation.replace("Home");
        return;
      }
    }
  
    Alert.alert("Erro", "Email ou senha incorretos.");
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>MottuSense</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
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
  button: {backgroundColor: "#29b12c",borderRadius: 8, padding: 12 },
  buttonText: {color: "#ffff", textAlign: "center"},
  appTitle: {color: "#29b12c", textAlign: "center", padding: 8, fontSize: 26, fontWeight: "bold"}
});
