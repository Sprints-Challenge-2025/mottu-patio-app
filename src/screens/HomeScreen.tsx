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
    const unsubscribe = navigation.addListener("focus", fetchMotos);
    fetchMotos();
    return unsubscribe;
  }, [navigation, fetchMotos]);

  const handleDelete = async (moto: Moto) => {
    Alert.alert("Excluir", `Deseja excluir a moto ${moto.licensePlate}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
              logout();
              return;
            }
            await deleteMoto(moto.id!.toString(), token);
            Alert.alert("Sucesso", "Moto excluída.");
            fetchMotos();
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
      activeOpacity={0.8}
    >
      <Text style={styles.placa}>{item.licensePlate}</Text>
      <Text style={styles.sub}>{item.brand} - {item.model} ({item.year})</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterMoto", { moto: item })}
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.actionBtn}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.username ?? "Usuário"}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("RegisterMoto")}
        activeOpacity={0.8}
      >
        <Text style={styles.addBtnText}>+ Nova Moto</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={motos.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma moto cadastrada.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700" },
  logoutText: { color: "#f00", fontWeight: "600" },
  addBtn: {
    backgroundColor: "#21D445FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  placa: { fontSize: 16, fontWeight: "700" },
  sub: { color: "#666", marginTop: 2 },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  actionText: { color: "#21D445FF", fontWeight: "600" },
  deleteText: { color: "#ff4444" },
  loader: { marginTop: 40 },
  emptyList: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#aaa", fontSize: 16, marginTop: 40 },
});
