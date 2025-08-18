import { Platform } from "react-native";

const BASE_URL =
  process.env.BASE_URL ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000");

export async function apiFetch(
  endpoint: string,
  options?: RequestInit,
  isForm?: boolean,
) {
  const url = `${BASE_URL}/api/v1${endpoint}`;
  const headers: Record<string, string> = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  return fetch(url, {
    credentials: "include",
    ...options,
    headers: { ...headers, ...(options?.headers || {}) },
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "API error");
    return data;
  });
}

export async function uploadPhoto(file: any): Promise<{ id: string; url: string; hash: string }> {
  const form = new FormData();
  form.append("photo", {
    uri: file.uri,
    type: file.type || "image/jpeg",
    name: file.fileName || "photo.jpg",
  });
  return apiFetch("/uploads/photos", { method: "POST", body: form } as any, true);
}