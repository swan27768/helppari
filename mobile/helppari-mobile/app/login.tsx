import { Redirect } from "expo-router";
import { View, Text, TextInput, Alert, Pressable } from "react-native";
import { useState } from "react";
import { useAuth } from "../src/auth/AuthContext";

export default function Login() {
  const { token, signIn } = useAuth();

  // Jos käyttäjä on jo kirjautunut, ohjaa appiin
  if (token) {
    return <Redirect href="/(app)" />;
  }

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("salasana");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await signIn(email, password);
      // onnistunut login → redirect hoituu automaattisesti tokenin kautta
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      Alert.alert(
        "Kirjautuminen epäonnistui",
        err?.message ?? "Tuntematon virhe",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Kirjaudu</Text>

      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#9ca3af" : "#2563eb",
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {loading ? "Kirjaudutaan..." : "Kirjaudu"}
        </Text>
      </Pressable>
    </View>
  );
}
