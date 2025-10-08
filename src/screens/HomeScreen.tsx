import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Moto } from "../types";
import { getMotos, deleteMoto } from "../services/api"; 
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: any) {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const fetchMotos = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token"); 
      if (!token) {
        Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
        logout();
        return;
      }
      const data = await getMotos(token); 
      setMotos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível carregar motos.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      fetchMotos();
    });
    fetchMotos();
    return unsub;
  }, [navigation, fetchMotos]);

  const handleDelete = (moto: Moto) => {
    Alert.alert("Excluir", `Deseja excluir a moto ${moto.licensePlate}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
              logout();
              return;
            }
            await deleteMoto(motos.id!, token); 
            Alert.alert("Sucesso", "Moto excluída.");
            await fetchMotos();
          } catch (err: any) {
            Alert.alert("Erro", err.message || "Não foi possível excluir.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MotoDetails", { moto: item })}
    >
      <Text style={styles.placa}>{item.licensePlate}</Text> 
      <Text style={styles.sub}>{item.brand} - {item.model} ({item.year})</Text> 
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterMoto", { moto: item })}>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Text style={[styles.actionText, { color: "#ff4444" }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.username ?? "Usuário"}</Text> 
        <TouchableOpacity onPress={() => logout()}>
          <Text style={{ color: "#f00" }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("RegisterMoto")}>
        <Text style={{ color: "#fff" }}>+ Nova Moto</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList data={motos} keyExtractor={(i) => String(i.id)} renderItem={renderItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700" },
  addBtn: { backgroundColor: "#21D445FF", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  card: { padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 10 },
  placa: { fontSize: 16, fontWeight: "700" },
  sub: { color: "#666" },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionText: { marginLeft: 12, color: "#21D445FF" },
});

