import { api } from "../lib/api";

/* ---------- Types ---------- */

export type Post = {
  id: number;
  title: string;
  body: string;
  type: string;
  createdAt: string;
  user: {
    firstName: string;
  };
};

export type PostsResponse = {
  items: Post[];
  nextCursor: string | null;
};

/* ---------- Fetch feed ---------- */

export async function fetchPosts(cursor?: string) {
  const res = await api.get("/posts", {
    params: { cursor },
  });
  return res.data;
}

/* ---------- Create post ---------- */

export async function createPost(input: {
  title: string;
  body: string;
  type: string;
}) {
  return http.post("/posts", input);
}
/* ---------- Delete post ---------- */

export async function deletePost(postId: number): Promise<void> {
  await http.del(`/posts/${postId}`);
}
