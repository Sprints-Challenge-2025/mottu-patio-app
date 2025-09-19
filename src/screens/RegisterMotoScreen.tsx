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
import { apiPost, apiPut, apiGet } from "../services/api";

export default function RegisterMotoScreen({ route, navigation }: any) {
  const motoParam = route.params?.moto;
  const [placa, setPlaca] = useState(motoParam?.placa ?? "");
  const [status, setStatus] = useState(motoParam?.status ?? "");
  const [servico, setServico] = useState(motoParam?.servico ?? "");
  const [os, setOs] = useState(motoParam?.os ?? "");
  const [motor, setMotor] = useState(motoParam?.motor ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (motoParam && motoParam.id) {
      // opcional: carregar versão atualizada da moto via API
      (async () => {
        try {
          setLoading(true);
          const fresh = await apiGet(`/motos/${motoParam.id}`);
          setPlaca(fresh.placa || placa);
          setStatus(fresh.status || status);
          setServico(fresh.servico || servico);
          setOs(fresh.os || os);
          setMotor(fresh.motor || motor);
        } catch (e) {
          // ignorar
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  const validarPlaca = (p: string) => p.trim().length >= 4;

  const handleSalvar = async () => {
    if (!validarPlaca(placa) || !status) {
      Alert.alert("Validação", "Preencha a placa (mín. 4 chars) e o status.");
      return;
    }
    setLoading(true);
    try {
      if (motoParam && motoParam.id) {
        await apiPut(`/motos/${motoParam.id}`, { placa, status, servico, os, motor });
        Alert.alert("Sucesso", "Moto atualizada.");
      } else {
        await apiPost("/motos", { placa, status, servico, os, motor });
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

      <TextInput placeholder="Placa" value={placa} onChangeText={setPlaca} style={styles.input} />
      <TextInput placeholder="Status" value={status} onChangeText={setStatus} style={styles.input} />
      <TextInput placeholder="Serviço" value={servico} onChangeText={setServico} style={styles.input} />
      <TextInput placeholder="OS" value={os} onChangeText={setOs} style={styles.input} />
      <TextInput placeholder="Motor" value={motor} onChangeText={setMotor} style={styles.input} />

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
