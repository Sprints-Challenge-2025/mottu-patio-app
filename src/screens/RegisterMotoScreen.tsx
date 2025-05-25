import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Moto } from "../types";
import { Image } from "react-native";

export default function RegisterMotoScreen({ navigation }: any) {
  const [placa, setPlaca] = useState("");
  const [status, setStatus] = useState("");
  const [servico, setServico] = useState("");
  const [os, setOs] = useState("");
  const [motor, setMotor] = useState("");

  const handleSalvar = async () => {
    if (!placa || !status) {
      alert("Preencha pelo menos a placa e o status.");
      return;
    }

    const novaMoto: Moto = {
      id: Date.now(),
      placa,
      status,
      servico,
      os,
      motor,
    };

    const motosSalvas = await AsyncStorage.getItem("motos");
    const listaAtual = motosSalvas ? JSON.parse(motosSalvas) : [];

    const novaLista = [...listaAtual, novaMoto];
    await AsyncStorage.setItem("motos", JSON.stringify(novaLista));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.titulo}>Cadastrar Nova Moto</Text>

      <TextInput placeholder="Placa" value={placa} onChangeText={setPlaca} style={styles.input} />
      <TextInput placeholder="Status" value={status} onChangeText={setStatus} style={styles.input} />
      <TextInput placeholder="Serviço" value={servico} onChangeText={setServico} style={styles.input} />
      <TextInput placeholder="OS" value={os} onChangeText={setOs} style={styles.input} />
      <TextInput placeholder="Data Motor (ISO)" value={motor} onChangeText={setMotor} style={styles.input} />

      <TouchableOpacity onPress={handleSalvar} style={styles.botao}>
        <Text style={styles.textoBotao}>Salvar Moto</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} >
        <Text style={styles.linkVoltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 16, marginTop: 90 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: "#2DAB26FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  topBar: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  linkVoltar: {
    marginTop: 16,
    textAlign: "center",
    color: "#2DAB26FF",
    fontSize: 17,
  },
});
