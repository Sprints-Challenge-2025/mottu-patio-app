import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MotoDetailsScreen from "../screens/MotoDetailScreen";
import RegisterMotoScreen from "../screens/RegisterMotoScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitle: "MottuSense",
        headerTintColor: "#21D445FF",
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="MotoDetails" component={MotoDetailsScreen} options={{title: "Detalhes da Moto", headerShown: false }}/>
      <Stack.Screen name="RegisterMoto" component={RegisterMotoScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
