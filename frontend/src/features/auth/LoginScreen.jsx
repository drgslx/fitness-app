import Button from "../../components/ui/Button";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, useAuth } from "../../auth";
export default function LoginScreen() {
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
        data.get("password"),
      ),
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
        <Button disabled={busy}>
          {register ? "Înregistrare" : "Conectare"}
        </Button>
      </form>
      <div className="mt-5 form-grid">
        <Button
          type="button"
          className="w-full"
          disabled={busy}
          onClick={() =>
            run(() => signInWithPopup(auth, new GoogleAuthProvider()))
          }
        >
          Continuă cu Google
        </Button>
        <Button
          type="button"
          className="w-full"
          disabled={busy}
          onClick={() => setRegister(!register)}
        >
          {register ? "Am deja cont" : "Creează un cont"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-4 notice-error">
          {error}
        </p>
      )}
      <p className="mt-5">
        <Link to="/">Înapoi la homepage</Link>
      </p>
    </main>
  );
}
