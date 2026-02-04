import { api } from "../../src/lib/api";

export type Comment = {
  id: number;
  body: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
  };
};

export async function fetchComments(postId: number): Promise<Comment[]> {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data;
}

export async function createComment(postId: number, body: string) {
  return api.post(`/posts/${postId}/comments`, { body });
}
