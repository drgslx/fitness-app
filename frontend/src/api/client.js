import { auth } from "../auth";
export async function api(path, options = {}) {
  if (!auth?.currentUser) throw new Error("Autentifică-te pentru a continua.");
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(
    (import.meta.env.VITE_API_URL || "/api/v1") + path,
    {
      ...options,
      headers: {
        Authorization: "Bearer " + token,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    }
  );
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Date invalide sau serviciu indisponibil (" + response.status + ")."
    );
  return data;
}
export const send = (path, method, data) =>
  api(path, {
    method,
    body: data === undefined ? undefined : JSON.stringify(data),
  });
export function localDate(value = new Date()) {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");
}
