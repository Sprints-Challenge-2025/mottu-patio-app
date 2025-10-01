import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { apiGetMotos } from "../services/api"; // Usar a nova função
import { Moto } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

export default function MotoDetailsScreen({ route, navigation }: any) {
  const { moto: motoParam } = route.params;
  const [moto, setMoto] = useState<Moto | null>(motoParam);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (motoParam && motoParam.id) {
      (async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
            logout();
            return;
          }
          // apiGetMotos retorna uma lista, precisamos encontrar a moto específica
          const allMotos: Moto[] = await apiGetMotos(token);
          const freshMoto = allMotos.find(m => m.id === motoParam.id);
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
      })();
    }
  }, [motoParam, logout, navigation]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!moto) return <Text style={styles.container}>Moto não encontrada.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Moto</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Marca:</Text>
        <Text style={styles.value}>{moto.brand}</Text>

        <Text style={styles.label}>Modelo:</Text>
        <Text style={styles.value}>{moto.model}</Text>

        <Text style={styles.label}>Ano:</Text>
        <Text style={styles.value}>{moto.year}</Text>

        <Text style={styles.label}>Placa:</Text>
        <Text style={styles.value}>{moto.licensePlate}</Text>
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

