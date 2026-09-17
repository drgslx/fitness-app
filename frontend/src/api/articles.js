import { auth } from "../auth";
const API = import.meta.env.VITE_API_URL || "/api/v1";
export const imageUrl = path => API.startsWith("http") ? new URL(API).origin + path : path;
async function read(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(response.status === 404 ? "Articolul nu există sau nu este publicat." : typeof body.detail === "string" ? body.detail : "Cererea nu a reușit.");
  }
  return response.json();
}
export const getArticles = () => fetch(API + "/articles").then(read);
export const getArticle = slug => fetch(API + "/articles/" + encodeURIComponent(slug)).then(read);
export async function createArticle(form) {
  if (!auth?.currentUser) throw new Error("Autentifică-te pentru a continua.");
  const token = await auth.currentUser.getIdToken();
  return read(await fetch(API + "/articles", { method: "POST", headers: { Authorization: "Bearer " + token }, body: form }));
}
