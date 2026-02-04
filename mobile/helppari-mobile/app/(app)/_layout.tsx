import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";

export default function AppLayout() {
  const { token, isLoading } = useAuth();

  if (isLoading) return null;

  // 🔐 EI TOKENIA → LOGIN
  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
