import { http } from "./http";

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
  const query = new URLSearchParams();
  if (cursor) query.append("cursor", cursor);

  return http.get<PostsResponse>(`/posts?${query.toString()}`);
}

/* ---------- Create post ---------- */

export async function createPost(input: {
  title: string;
  body: string;
  type: string;
}) {
  return http.post("/posts", input);
}
