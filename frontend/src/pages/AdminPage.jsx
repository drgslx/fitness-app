import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createArticle } from "../api/articles";
import CatalogAdmin from "../components/CatalogAdmin";
export default function AdminPage() {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const element = e.currentTarget;
    const form = new FormData(element);
    const images = form.getAll("images").filter((file) => file.size > 0);
    form.delete("images");
    images.forEach((file) => form.append("images", file));
    if (images.length > 2) {
      setMessage("Alege maximum două imagini.");
      return;
    }
    setBusy(true);
    setMessage("");
    setSaved(null);
    try {
      const article = await createArticle(form);
      setSaved(article);
      element.reset();
      setMessage("Articol publicat. ID: " + article.id);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin">
      <h1>Publică un articol</h1>
      <form onSubmit={submit}>
        <label>
          Titlu
          <input name="title" minLength={3} maxLength={180} required />
        </label>
        <label>
          Rezumat
          <textarea name="summary" minLength={10} maxLength={500} required />
        </label>
        <label>
          Conținut
          <textarea name="content" rows={12} minLength={20} required />
        </label>
        <label>
          Imagini (maximum 2)
          <input
            name="images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
          />
        </label>
        <button disabled={busy}>{busy ? "Se publică…" : "Publică"}</button>
        <p role="status">{message}</p>
        {saved && (
          <Link to={"/articles/" + saved.slug}>Vezi articolul publicat</Link>
        )}
      </form>
      <CatalogAdmin />
    </main>
  );
}
