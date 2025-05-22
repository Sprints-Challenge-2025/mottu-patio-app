import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function MotoDetailsScreen({ route }: any) {
const { moto } = route.params;

return (
<View style={styles.container}>
{moto.foto && (
<Image source={{ uri: moto.foto }} style={styles.image} />
)}
<Text style={styles.text}>ID: {moto.id}</Text>
<Text style={styles.text}>OS: {moto.os}</Text>
<Text style={styles.text}>Serviço: {moto.servico}</Text>
<Text style={styles.text}>Status: {moto.status}</Text>
<Text style={styles.text}>Placa: {moto.placa}</Text>
<Text style={styles.text}>Motor: {moto.motor}</Text>
</View>
);
}

const styles = StyleSheet.create({
container: { padding: 20 },
image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 20 },
text: { fontSize: 16, marginBottom: 10 }
});
