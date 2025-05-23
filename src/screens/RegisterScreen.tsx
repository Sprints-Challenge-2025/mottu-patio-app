import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }: any) {
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [confirmarSenha, setConfirmarSenha] = useState("");

const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
  
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
  
    const user = { nome, email, senha };
    await AsyncStorage.setItem("usuario", JSON.stringify(user));
    Alert.alert("Sucesso", "Cadastro realizado!");
    navigation.goBack();
  };

return (
<View style={styles.container}>
<TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
<TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
<TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={styles.input} />
<TextInput
  placeholder="Confirmar senha"
  value={confirmarSenha}
  onChangeText={setConfirmarSenha}
  secureTextEntry
  style={styles.input}
/>
<Button title="Cadastrar" onPress={handleRegister} />
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: "center", padding: 20 },
input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }
});