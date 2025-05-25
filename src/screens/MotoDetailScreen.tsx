import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Moto } from "../types";

export default function MotoDetailsScreen({ route, navigation }: any) {
  const { moto }: { moto: Moto } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes da Moto</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Placa:</Text>
        <Text style={styles.valor}>{moto.placa}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.valor}>{moto.status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>OS:</Text>
        <Text style={styles.valor}>{moto.os}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Serviço:</Text>
        <Text style={styles.valor}>{moto.servico}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Motor:</Text>
        <Text style={styles.valor}>{moto.motor}</Text>
      </View>

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
    backgroundColor: "#1C1C1C",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
    color: "#fff",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  valor: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
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
