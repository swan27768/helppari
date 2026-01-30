import { View, Text, Button } from "react-native";
import { http } from "../../src/api/http";

export default function Home() {
  const testMe = async () => {
    try {
      const me = await http.get("/auth/me");
      console.log("AUTH /me:", me);
      alert(JSON.stringify(me, null, 2));
    } catch (err: any) {
      console.error("AUTH /me ERROR:", err);
      alert("Virhe: " + err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Etusivu</Text>
      <Button title="Testaa /auth/me" onPress={testMe} />
    </View>
  );
}
