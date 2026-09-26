import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, useAuth } from "../auth";
export default function LoginPage() {
  const { user, loading } = useAuth();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!auth)
    return (
      <main>
        Autentificarea necesită configurarea Firebase. Urmează secțiunea
        „Autentificare” din README.
      </main>
    );
  if (loading) return <main>Se verifică sesiunea…</main>;
  if (user) return <Navigate to="/" replace />;
  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError("Autentificarea nu a reușit: " + (e.code || "eroare"));
    } finally {
      setBusy(false);
    }
  }
  function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    run(() =>
      (register ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(
        auth,
        data.get("email"),
        data.get("password")
      )
    );
  }
  return (
    <main className="mx-auto max-w-[760px]">
      <h1>{register ? "Creează un cont" : "Autentificare"}</h1>
      <form onSubmit={submit}>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          Parolă
          <input
            type="password"
            name="password"
            minLength={6}
            autoComplete={register ? "new-password" : "current-password"}
            required
          />
        </label>
        <button disabled={busy}>
          {register ? "Înregistrare" : "Conectare"}
        </button>
      </form>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          className="w-full"
          disabled={busy}
          onClick={() =>
            run(() => signInWithPopup(auth, new GoogleAuthProvider()))
          }
        >
          Continuă cu Google
        </button>
        <button
          type="button"
          className="w-full"
          disabled={busy}
          onClick={() => setRegister(!register)}
        >
          {register ? "Am deja cont" : "Creează un cont"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]">
          {error}
        </p>
      )}
      <p className="mt-5">
        <Link to="/">Înapoi la homepage</Link>
      </p>
    </main>
  );
}
