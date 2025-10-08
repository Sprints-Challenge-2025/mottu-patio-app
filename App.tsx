import React, { ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text } from "react-native";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // You may want to log this to an error reporting service
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            Ops — ocorreu um erro na interface. Reinicie o app ou veja o console.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
