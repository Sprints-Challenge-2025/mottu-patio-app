import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { getMotos } from "../services/api";
import { Moto } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

export default function MotoDetailsScreen({ route, navigation }: any) {
  const { moto: motoParam } = route.params;
  const [moto, setMoto] = useState<Moto | null>(motoParam);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchMotoDetails = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
          logout();
          return;
        }
        const allMotos = await getMotos(token);
        const freshMoto = allMotos.find((m: Moto) => m.id === motoParam.id);
        if (freshMoto) {
          setMoto(freshMoto);
        } else {
          Alert.alert("Erro", "Moto não encontrada.");
          navigation.goBack();
        }
      } catch (err: any) {
        Alert.alert("Erro", err.message || "Não foi possível carregar detalhes.");
      } finally {
        setLoading(false);
      }
    };

    if (motoParam?.id) {
      fetchMotoDetails();
    }
  }, [motoParam, logout, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#21D445FF" />
      </View>
    );
  }

  if (!moto) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Moto não encontrada.</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc" }]} onPress={() => navigation.goBack()}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Moto</Text>
      <View style={styles.card}>
        <DetailRow label="Marca" value={moto.brand} />
        <DetailRow label="Modelo" value={moto.model} />
        <DetailRow label="Ano" value={String(moto.year)} />
        <DetailRow label="Placa" value={moto.licensePlate} />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RegisterMoto", { moto })}
        accessibilityLabel="Editar moto"
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ccc", marginTop: 8 }]}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Voltar"
      >
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#21D445FF" },
  card: { padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#eee", marginBottom: 20, backgroundColor: "#f9f9f9" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  label: { fontWeight: "600", color: "#555" },
  value: { color: "#333" },
  button: { backgroundColor: "#21D445FF", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  errorText: { color: "#d32f2f", fontSize: 16, marginBottom: 12 },
});
