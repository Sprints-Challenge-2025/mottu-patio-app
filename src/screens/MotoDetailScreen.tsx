import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { Moto } from "../types";

export function MotoDetailsScreen({ route }: any) {
  const { id } = route.params;
  const { token } = useAuth();
  const [moto, setMoto] = useState<Moto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoto() {
      try {
        const res = await api.get(`/motos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setMoto(res.data);
      } catch {
        alert("Erro ao carregar moto");
      }
      setLoading(false);
    }
    fetchMoto();
  }, [id, token]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!moto) return <Text>Moto não encontrada</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Moto</Text>
      <Text>ID: {moto.id}</Text>
      <Text>OS: {moto.os}</Text>
      <Text>Serviço: {moto.servico}</Text>
      <Text>Status: {moto.status}</Text>
      <Text>Placa: {moto.placa}</Text>
      <Text>Motor: {moto.motor}</Text>
      {moto.foto ? <Image source={{ uri: moto.foto }} style={styles.image} resizeMode="contain" /> : <Text>Sem foto disponível</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  image: { width: 250, height: 180, marginTop: 15 },
});
