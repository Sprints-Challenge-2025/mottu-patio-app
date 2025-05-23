import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Moto } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RegisterMotoScreen from "./RegisterMotoScreen";

export default function HomeScreen({ navigation }: any) {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState("");

  const [novaPlaca, setNovaPlaca] = useState("");
  const [novoStatus, setNovoStatus] = useState("");
  const [novoServico, setNovoServico] = useState("");
  const [novaOS, setNovaOS] = useState("");
  const [novoMotor, setNovoMotor] = useState("");

  const handleCadastrarMoto = async () => {
    if (!novaPlaca || !novoStatus) {
      alert("Preencha pelo menos a placa e o status");
      return;
    }

    const novaMoto: Moto = {
      id: Date.now(),
      placa: novaPlaca,
      status: novoStatus,
      servico: novoServico,
      os: novaOS,
      motor: novoMotor,
    };

    const novaLista = [...motos, novaMoto];
    setMotos(novaLista);
    await AsyncStorage.setItem("motos", JSON.stringify(novaLista));

    // Limpa os campos
    setNovaPlaca("");
    setNovoStatus("");
    setNovoServico("");
    setNovaOS("");
    setNovoMotor("");
  };

  useEffect(() => {
    const fetchMotos = async () => {
      try {
        const storedMotos = await AsyncStorage.getItem("motos");
        if (storedMotos) {
          setMotos(JSON.parse(storedMotos));
        }
      } catch (err) {
        console.error("Erro ao buscar motos localmente", err);
      }
    };

    const buscarUsuario = async () => {
      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      if (usuarioSalvo) {
        const user = JSON.parse(usuarioSalvo);
        setNomeUsuario(user.nome);
      }
    };

    fetchMotos();
    buscarUsuario();
  }, []);

  const renderItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MotoDetails", { moto: item })}
    >
      <Text style={styles.title}>
        {item.placa} - {item.status}
      </Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("logado");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bemVindo}>Olá, {nomeUsuario}!</Text>
      <RegisterMotoScreen/>
      <FlatList
        data={motos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
        <Text style={styles.textoSair}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bemVindo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  formTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  botaoCadastrar: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  textoCadastrar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoSair: {
    backgroundColor: "#21D445FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  textoSair: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
