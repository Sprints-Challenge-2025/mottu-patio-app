import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const senhaForte = (senha: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(senha);
  };

  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calc = (x: number) =>
      cpf
        .split("")
        .slice(0, x)
        .reduce((s, v, i) => s + parseInt(v) * (x + 1 - i), 0);

    const dig1 = (calc(9) * 10) % 11 % 10;
    const dig2 = (calc(10) * 10) % 11 % 10;

    return dig1 === +cpf[9] && dig2 === +cpf[10];
  };

  const handleRegister = async () => {
    if (!nome || !cpf || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!senhaForte(senha)) {
      Alert.alert(
        "Erro",
        "A senha deve ter pelo menos 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos."
      );
      return;
    }

    try {
      const usuario = { nome, cpf, senha };
      await AsyncStorage.setItem("usuario", JSON.stringify(usuario));

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.replace("Home");
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      Alert.alert("Erro", "Não foi possível salvar o usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cadTitle}>
        Bem vindo a <Text style={styles.destaqTitle}>MottuSense!</Text>
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholderTextColor="#888"
      />

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
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <Text style={styles.passwordHint}>
        A senha deve conter:
        {"\n"}• 8+ caracteres
        {"\n"}• Letras maiúsculas e minúsculas
        {"\n"}• Números
        {"\n"}• Caracteres especiais (!@#$%)
      </Text>

      <TextInput
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity onPress={handleRegister} style={styles.cadButton}>
        <Text style={styles.cadText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#1C1C1C" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: "#ccc",
    fontSize: 16,
  },
  linkText: {
    marginTop: 16,
    textAlign: "center",
    color: "#176419FF",
    fontSize: 17,
  },
  cadButton: {
    backgroundColor: "#29b12c",
    borderRadius: 8,
    padding: 12,
  },
  cadText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  cadTitle: {
    color: "#fff",
    textAlign: "left",
    padding: 8,
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 20,
  },
  destaqTitle: {
    color: "#29b12c",
  },
  passwordHint: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 12,
  },
});
