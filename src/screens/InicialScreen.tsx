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

const FULL_WORD = "TECNOLOGIA";
const TYPING_INTERVAL = 100;

export default function InicialScreen({ navigation }: { navigation: any }) {
  const [typedWord, setTypedWord] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedWord(FULL_WORD.slice(0, i + 1));
      i++;
      if (i === FULL_WORD.length) clearInterval(interval);
    }, TYPING_INTERVAL);
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
          <Text style={styles.subtitle}>
            Transforme sua rotina com <Text style={styles.bold}>inovação</Text>
          </Text>

          <TouchableOpacity
            style={styles.greenButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.greenButtonText}>SOU NOVO AQUI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blackButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
          >
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
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 30,
  },
  bold: {
    fontWeight: "bold",
    color: "#fff",
  },
  greenButton: {
    backgroundColor: "#29b12c",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 6,
    width: "100%",
    marginBottom: 10,
    elevation: 2,
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
    elevation: 2,
  },
  blackButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
