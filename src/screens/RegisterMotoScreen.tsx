import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createMoto, updateMoto } from "../services/api";
import { Moto } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterMotoScreen({ route, navigation }: any) {
  const motoParam: Moto | undefined = route.params?.moto;
  const [brand, setBrand] = useState(motoParam?.brand ?? "");
  const [model, setModel] = useState(motoParam?.model ?? "");
  const [year, setYear] = useState(motoParam?.year ? String(motoParam.year) : "");
  const [licensePlate, setLicensePlate] = useState(motoParam?.licensePlate ?? "");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const validateFields = () => {
    if (!brand.trim() || !model.trim() || !year.trim() || !licensePlate.trim()) {
      Alert.alert("Validação", "Preencha todos os campos: Marca, Modelo, Ano e Placa.");
      return false;
    }
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > currentYear + 1
    ) {
      Alert.alert("Validação", `O ano deve ser entre 1900 e ${currentYear + 1}.`);
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro de autenticação", "Token não encontrado. Faça login novamente.");
        logout();
        return;
      }

      const motoData: Moto = {
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        licensePlate: licensePlate.trim(),
      };

      if (motoParam?.id) {
        await updateMoto(String(motoParam.id), motoData, token);
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{motoParam ? "Editar Moto" : "Cadastrar Nova Moto"}</Text>

        <TextInput
          placeholder="Marca"
          value={brand}
          onChangeText={setBrand}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInput
          placeholder="Modelo"
          value={model}
          onChangeText={setModel}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInput
          placeholder="Ano"
          value={year}
          onChangeText={setYear}
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          returnKeyType="next"
        />
        <TextInput
          placeholder="Placa"
          value={licensePlate}
          onChangeText={setLicensePlate}
          style={styles.input}
          autoCapitalize="characters"
          maxLength={7}
          returnKeyType="done"
        />

        <TouchableOpacity
          onPress={handleSalvar}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#21D445FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
