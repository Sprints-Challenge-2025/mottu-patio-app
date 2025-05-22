import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../api/api";

export default function RegisterScreen({ navigation }: any) {
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");

const handleRegister = async () => {
try {
await api.post("/auth/register", { nome, email, senha });
Alert.alert("Sucesso", "Cadastro realizado com sucesso");
navigation.navigate("Login");
} catch (err: any) {
const msg = err.response?.data?.mensagem || "Erro ao cadastrar";
Alert.alert("Erro", msg);
}
};

return (
<View style={styles.container}>
<TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
<TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
<TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={styles.input} />
<Button title="Cadastrar" onPress={handleRegister} />
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: "center", padding: 20 },
input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }
});