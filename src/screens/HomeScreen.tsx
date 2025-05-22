import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import api from "../api/api";
import { Moto } from "../types";

export default function HomeScreen({ navigation }: any) {
const [motos, setMotos] = useState<Moto[]>([]); // ✅ use tipagem correta

useEffect(() => {
const fetchMotos = async () => {
try {
const res = await api.get<Moto[]>("/motos"); // opcional: ajuda o TS a entender a resposta
setMotos(res.data);
} catch (err) {
console.error("Erro ao buscar motos", err);
}
};

fetchMotos();
}, []);

const renderItem = ({ item }: { item: Moto }) => (
<TouchableOpacity
style={styles.card}
onPress={() => navigation.navigate("MotoDetails", { moto: item })}
>
<Text style={styles.title}>{item.placa} - {item.status}</Text>
</TouchableOpacity>
);

return (
<View style={styles.container}>
<FlatList
data={motos}
keyExtractor={(item) => String(item.id)}
renderItem={renderItem}
/>
</View>
);
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    card: {
      padding: 16,
      backgroundColor: "#f2f2f2",
      marginBottom: 12,
      borderRadius: 8
    },
    title: { fontSize: 16, fontWeight: "bold" }
  });