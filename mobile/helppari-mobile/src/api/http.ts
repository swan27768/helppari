// src/api/http.ts
import { getToken } from "../storage/token";

const API_URL = "http://192.168.1.139:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: any,
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API error");
  }

  return res.json();
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: any) => request<T>("POST", path, body),
  put: <T>(path: string, body?: any) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
