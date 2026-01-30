import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";

export default function AppLayout() {
  const { token, isLoading } = useAuth();

  // käynnistyksessä voidaan näyttää tyhjä (tai loader)
  if (isLoading) return null;

  // ei tokenia -> takaisin login
  if (!token) return <Redirect href="/login" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Etusivu" }} />
    </Stack>
  );
}
