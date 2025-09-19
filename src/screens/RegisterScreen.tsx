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
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const { register, loading } = useAuth();

  const validarCPF = (cpfRaw: string) => {
    const cleaned = cpfRaw.replace(/[^\d]+/g, "");
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
    if (check2 !== parseInt(cleaned.charAt(10))) return false;
    return true;
  };

  const validarSenhaForte = (s: string) => {
    return s.length >= 8 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);
  };

  const handleRegister = async () => {
    if (!nome || nome.length < 2) {
      Alert.alert("Nome inválido", "Informe um nome válido.");
      return;
    }
    if (!validarCPF(cpf)) {
      Alert.alert("CPF inválido", "Informe um CPF válido.");
      return;
    }
    if (!validarSenhaForte(senha)) {
      Alert.alert(
        "Senha fraca",
        "A senha deve ter pelo menos 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos."
      );
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Confirmação", "As senhas não coincidem.");
      return;
    }

    try {
      await register(nome, cpf.replace(/[^\d]+/g, ""), senha);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível cadastrar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      <TextInput
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Cadastrar</Text>}
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
