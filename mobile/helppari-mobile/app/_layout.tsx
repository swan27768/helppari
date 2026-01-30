import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/auth/AuthContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ title: "Kirjaudu" }} />
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
