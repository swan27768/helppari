import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { fetchComments, Comment } from "../api/comments";
import { timeAgo } from "../utils/time";

type Props = {
  postId: number;
  refreshKey?: number;
};

export function CommentList({ postId, refreshKey }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    fetchComments(postId)
      .then((data) => {
        if (mounted) setComments(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId, refreshKey]);

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 8 }} />;
  }

  if (comments.length === 0) {
    return (
      <Text
        style={{
          fontSize: 12,
          color: "#9ca3af",
          marginBottom: 8,
        }}
      >
        Ei vielä kommentteja
      </Text>
    );
  }

  return (
    <View style={{ marginBottom: 8 }}>
      {comments.map((c) => (
        <View key={c.id} style={{ marginBottom: 6 }}>
          <Text style={{ fontSize: 13, lineHeight: 18 }}>
            <Text style={{ fontWeight: "600" }}>{c.user.firstName}</Text>{" "}
            {c.body}
          </Text>
          <Text style={{ fontSize: 11, color: "#9ca3af" }}>
            {timeAgo(c.createdAt)}
          </Text>
        </View>
      ))}
    </View>
  );
}
