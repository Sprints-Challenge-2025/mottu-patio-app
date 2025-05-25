import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function HomeScreen({ navigation }: any) {
  const [typedWord, setTypedWord] = useState("");
  const fullWord = "TECNOLOGIA";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedWord(fullWord.slice(0, i + 1));
      i++;
      if (i === fullWord.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            VIVA MAIS <Text style={styles.typing}>{typedWord}</Text>
          </Text>
          <Text style={styles.subtitle}>Transforme sua rotina com <Text style={{fontWeight: "bold"}}>inovação</Text></Text>

          <TouchableOpacity style={styles.greenButton} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.greenButtonText}>SOU NOVO AQUI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.blackButtonText}>JÁ SOU CLIENTE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  typing: {
    color: "#32CD32",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 30,
  },
  greenButton: {
    backgroundColor: "#29b12c",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 6,
    width: "100%",
    marginBottom: 10,
  },
  greenButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  blackButton: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
    width: "100%",
  },
  blackButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
