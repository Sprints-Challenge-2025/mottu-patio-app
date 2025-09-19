import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { getMotos } from "../services/api";

export default function MotoDetailsScreen({ route, navigation }: any) {
  const { moto: motoParam } = route.params;
  const [moto, setMoto] = useState<any>(motoParam);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (motoParam && motoParam.id) {
      (async () => {
        setLoading(true);
        try {
          const fresh = await getMotos(`/motos/${motoParam.id}`);
          setMoto(fresh);
        } catch (err: any) {
          Alert.alert("Erro", err.message || "Não foi possível carregar detalhes.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [motoParam]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Moto</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Placa:</Text>
        <Text style={styles.value}>{moto?.placa}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{moto?.status}</Text>

        <Text style={styles.label}>Serviço:</Text>
        <Text style={styles.value}>{moto?.servico}</Text>

        <Text style={styles.label}>OS:</Text>
        <Text style={styles.value}>{moto?.os}</Text>

        <Text style={styles.label}>Motor:</Text>
        <Text style={styles.value}>{moto?.motor}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RegisterMoto", { moto })}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc", marginTop: 8 }]} onPress={() => navigation.goBack()}>
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
  label: { marginTop: 8, fontWeight: "600" },
  value: { marginTop: 4, color: "#333" },
  button: { backgroundColor: "#21D445FF", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
