import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { Moto } from "../types";

export function HomeScreen({ navigation }: any) {
  const { token } = useAuth();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMotos() {
      try {
        const res = await api.get("/motos", { headers: { Authorization: `Bearer ${token}` } });
        setMotos(res.data);
      } catch {
        alert("Erro ao carregar motos");
      }
      setLoading(false);
    }
    loadMotos();
  }, [token]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={motos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("MotoDetails", { id: item.id })}>
            <Text style={styles.placa}>{item.placa}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhuma moto encontrada</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  placa: { fontWeight: "bold", fontSize: 16 },
});
