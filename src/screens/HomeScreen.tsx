import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Moto } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: any) {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("logado");
    navigation.replace("Login");
  };

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("usuario");
        if (usuarioSalvo) {
          const user = JSON.parse(usuarioSalvo);
          setNomeUsuario(user.nome);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };

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

    buscarUsuario();
    fetchMotos();
  }, []);

  const renderItem = ({ item }: { item: Moto }) => (
    <TouchableOpacity
      style={styles.motoCard}
      onPress={() => navigation.navigate("MotoDetails", { moto: item })}
    >
      <Text style={styles.motoText}>
        {item.placa} - {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.bemVindo}>
          Olá, {nomeUsuario.length > 0 ? nomeUsuario : "Visitante"}!
        </Text>
        <Text style={{ color: "#98FB98", fontSize: 16, marginBottom: 20 }}>
          Bem-vindo ao sistema de controle de motos.
        </Text>
      </View>

      {/* Card com lista de motos */}
      <View style={styles.cardLista}>
        <Text style={styles.cardTitle}>Motos Cadastradas</Text>
        {motos.length === 0 ? (
          <Text style={styles.semMotos}>Nenhuma moto cadastrada ainda.</Text>
        ) : (
          <FlatList
            data={motos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 8 }}
            style={{ width: "100%" }}
          />
        )}

        {/* Botão cadastrar moto */}
      <View style={styles.centerContent}>
        <TouchableOpacity
          style={styles.cadMoto}
          onPress={() => navigation.navigate("RegisterMoto")}
        >
          <Text style={styles.textButton}>Cadastrar Moto</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Botão sair */}
      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
        <Text style={styles.textoSair}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1C1C1C",
  },
  header: {
    width: "100%",
    marginBottom: 20,
  },
  bemVindo: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 50,
    color: "#fff",
  },
  centerContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  cadMoto: {
    backgroundColor: "#21D445FF",
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  textButton: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cardLista: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: "120%",
    maxHeight: 250,
    width: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1C1C1C",
  },
  semMotos: {
    color: "#555",
    textAlign: "center",
    fontStyle: "italic",
  },
  motoCard: {
    backgroundColor: "#e6e6e6",
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  motoText: {
    fontSize: 15,
  },
  botaoSair: {
    backgroundColor: "#21D445FF",
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
  },
  textoSair: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
