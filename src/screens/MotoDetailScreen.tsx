import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Moto } from "../types";

export default function MotoDetailsScreen({ route, navigation }: any) {
  const { moto }: { moto: Moto } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes da Moto</Text>
      <Text style={styles.item}>Placa: {moto.placa}</Text>
      <Text style={styles.item}>Status: {moto.status}</Text>
      <Text style={styles.item}>OS: {moto.os}</Text>
      <Text style={styles.item}>Serviço: {moto.servico}</Text>
      <Text style={styles.item}>Motor: {moto.motor}</Text>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.textoVoltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
  },
  botaoVoltar: {
    marginTop: 30,
    backgroundColor: "#21D445FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoVoltar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
