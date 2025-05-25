import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../contexts/AuthContext"; 

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      await register(nome, email, senha);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.goBack(); // volta para tela de login
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cadTitle}>Bem vindo a <Text style={styles.destaqTitle}>MottuSense!</Text></Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        style={styles.input}
      />

      {/* Botão de cadastrar */}
      <TouchableOpacity onPress={handleRegister} style={styles.cadButton}>
        <Text style={styles.cadText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  linkText: {
    marginTop: 16,
    textAlign: "center",
    color: "#176419FF",
    fontSize: 16,
  },
  cadButton: {
    backgroundColor: "#29b12c",
    borderRadius: 8, 
    padding: 12,
  },
  cadText: {
    color: "#ffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  cadTitle: {
    color: "#fff",
    textAlign: "left",
    padding: 8,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  destaqTitle: {
    color: "#29b12c",
  },
});
