import { http } from "./http";

export async function login(payload: { email: string; password: string }) {
  const res = await http.post<{ accessToken: string }>("/auth/login", payload);

  return res.accessToken;
}
