import { Stack } from "expo-router";
import { AuthProvider } from "../src/auth/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Julkinen */}
        <Stack.Screen name="login" />

        {/* Suojattu */}
        <Stack.Screen name="(app)" />
      </Stack>
    </AuthProvider>
  );
}
