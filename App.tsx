import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MotoDetailsScreen } from "./src/screens/MotoDetailScreen";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Pátio de Motos" }} />
          <Stack.Screen name="MotoDetails" component={MotoDetailsScreen} options={{ title: "Detalhes da Moto" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Cadastro" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
