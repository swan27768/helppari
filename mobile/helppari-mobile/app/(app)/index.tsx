import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { fetchPosts, Post } from "../../src/api/posts";

export default function Home() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /**
   * 🔄 Lataa feed alusta (käytetään kun näkymä saa fokuksen,
   * esim. palattaessa create-näkymästä)
   */
  const reloadFeed = useCallback(async () => {
    setInitialLoading(true);
    setCursor(null);

    try {
      const res = await fetchPosts();
      setPosts(res.items);
      setCursor(res.nextCursor);
    } catch (e) {
      console.error("RELOAD FEED ERROR:", e);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  /**
   * 📥 Lataa lisää postauksia (pagination)
   */
  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;

    setLoading(true);
    try {
      const res = await fetchPosts(cursor);

      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const newItems = res.items.filter((p) => !ids.has(p.id));
        return [...prev, ...newItems];
      });

      setCursor(res.nextCursor);
    } catch (e) {
      console.error("FETCH POSTS ERROR:", e);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  /**
   * ⭐ Ajetaan aina kun etusivu saa fokuksen
   */
  useFocusEffect(
    useCallback(() => {
      reloadFeed();
    }, [reloadFeed]),
  );

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ➕ LUO UUSI PYYNTÖ */}
      <Pressable
        onPress={() => router.push("/(app)/create")}
        style={{
          backgroundColor: "#2563eb",
          padding: 14,
          margin: 16,
          borderRadius: 8,
        }}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          + Luo uusi pyyntö
        </Text>
      </Pressable>

      {posts.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Ei vielä naapuriapupyyntöjä.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          extraData={posts}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{ margin: 16 }} /> : null
          }
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                {item.title} – {item.user.firstName}
              </Text>
              <Text>{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
