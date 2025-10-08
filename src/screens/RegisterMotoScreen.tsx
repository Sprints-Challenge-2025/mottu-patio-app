import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { createMoto, updateMoto } from "../services/api"; // Usar as novas funções
import { Moto } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterMotoScreen({ route, navigation }: any) {
  const motoParam: Moto | undefined = route.params?.moto;
  const [brand, setBrand] = useState(motoParam?.brand ?? "");
  const [model, setModel] = useState(motoParam?.model ?? "");
  const [year, setYear] = useState(motoParam?.year ? String(motoParam.year) : ""); // Ano como string para TextInput
  const [licensePlate, setLicensePlate] = useState(motoParam?.licensePlate ?? "");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  

  const handleSalvar = async () => {
    if (!brand || !model || !year || !licensePlate) {
      Alert.alert("Validação", "Preencha todos os campos: Marca, Modelo, Ano e Placa.");
      return;
    }
    if (isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear() + 1) {
      Alert.alert("Validação", "O ano deve ser um número válido entre 1900 e o ano atual + 1.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
        logout();
        return;
      }

      const motoData: Moto = {
        brand,
        model,
        year: Number(year),
        licensePlate,
      };

      if (motoParam && motoParam.id) {
        await updateMoto(motoParam.id, motoData, token);
        Alert.alert("Sucesso", "Moto atualizada.");
      } else {
        await createMoto(motoData, token);
        Alert.alert("Sucesso", "Moto cadastrada.");
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{motoParam ? "Editar Moto" : "Cadastrar Nova Moto"}</Text>

      <TextInput placeholder="Marca" value={brand} onChangeText={setBrand} style={styles.input} />
      <TextInput placeholder="Modelo" value={model} onChangeText={setModel} style={styles.input} />
      <TextInput placeholder="Ano" value={year} onChangeText={setYear} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Placa" value={licensePlate} onChangeText={setLicensePlate} style={styles.input} />

      <TouchableOpacity onPress={handleSalvar} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 8 },
  button: { backgroundColor: "#21D445FF", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

