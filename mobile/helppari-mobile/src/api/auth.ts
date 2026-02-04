import { api } from "../lib/api";

export type LoginResponse = {
  accessToken: string;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return res.data;
}

export type MeResponse = {
  userId: number;
  email: string;
  role: string;
};

export async function fetchMe(): Promise<MeResponse> {
  const res = await api.get<MeResponse>("/auth/me");
  return res.data;
}
