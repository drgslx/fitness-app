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
import { api, localDate, send } from "../../api/client";
import PersonalProfileFields from "../profile/PersonalProfileFields";
import { blankProfile, profilePayload } from "../profile/profileForm";

export default function LoginScreen() {
  const { user, loading } = useAuth();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(blankProfile);
  const [pendingProfile, setPendingProfile] = useState(null);
  const [destination, setDestination] = useState("/");

  if (!auth)
    return (
      <main>
        Autentificarea necesita configurarea Firebase. Urmeaza sectiunea
        „Autentificare” din README.
      </main>
    );
  // Firebase publishes the user before the profile API finishes. Keep the form
  // mounted until persistence succeeds or the user chooses the recovery route.
  if (loading && !busy && !pendingProfile) return <main>Se verifica sesiunea...</main>;
  if (user && !busy && !pendingProfile) return <Navigate to={destination} replace />;

  function change(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function persistProfile(payload) {
    try {
      await send("/profile", "PUT", payload);
      setPendingProfile(null);
      setDestination("/profile");
    } catch (err) {
      setError(`Contul a fost creat, dar profilul nu a putut fi salvat: ${err.message} Reincearca salvarea sau completeaza profilul din pagina Profil.`);
    }
  }

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError("Autentificarea nu a reusit: " + (err.code || "eroare"));
    } finally {
      setBusy(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (register && fields.get("password") !== fields.get("confirm_password")) {
      setError("Parolele nu coincid.");
      return;
    }
    const payload = profilePayload(form);
    run(async () => {
      if (register) {
        await createUserWithEmailAndPassword(auth, fields.get("email"), fields.get("password"));
        // Retain only profile data for retry; never retain either password.
        setPendingProfile(payload);
        await persistProfile(payload);
      } else {
        await signInWithEmailAndPassword(auth, fields.get("email"), fields.get("password"));
      }
    });
  }

  function googleLogin() {
    run(async () => {
      await signInWithPopup(auth, new GoogleAuthProvider());
      // Google creates accounts outside our form. Their first profile is filled
      // on /profile; existing Google accounts keep their regular landing page.
      try {
        const data = await api("/profile");
        setDestination(data.profile ? "/" : "/profile");
      } catch {
        setDestination("/profile");
      }
    });
  }

  return (
    <main className="mx-auto max-w-[760px]">
      <h1>{pendingProfile ? "Finalizeaza profilul" : register ? "Creeaza un cont" : "Autentificare"}</h1>
      {pendingProfile ? (
        <div className="space-y-3">
          <p>Contul este creat. Datele personale asteapta salvarea.</p>
          <Button type="button" disabled={busy} onClick={() => run(() => persistProfile(pendingProfile))}>
            {busy ? "Se salveaza..." : "Reincearca salvarea profilului"}
          </Button>
          {!busy && <p><Link to="/profile">Completeaza profilul din pagina Profil</Link></p>}
        </div>
      ) : (
        <>
          <form onSubmit={submit}>
            <fieldset disabled={busy} className="border-0 p-0">
              <label>
                Email
                <input type="email" name="email" autoComplete="email" required />
              </label>
              <label>
                Parola
                <input type="password" name="password" minLength={6}
                  autoComplete={register ? "new-password" : "current-password"} required />
              </label>
              {register && (
                <>
                  <label>
                    Confirma parola
                    <input type="password" name="confirm_password" minLength={6} autoComplete="new-password" required />
                  </label>
                  <PersonalProfileFields form={form} change={change} today={localDate()} registration />
                  <p className="text-xs text-muted">
                    Sexul si data nasterii se pastreaza dupa crearea profilului.
                    Obiectivul poate fi editat ulterior, iar inaltimea doar pana la 18 ani.
                    Nivelul de activitate poate fi editat cand nu ai antrenamente finalizate
                    de peste 15 minute in ultimele 7 zile. Dupa inregistrarea lor, nivelul
                    se stabileste automat dupa numarul de antrenamente.
                  </p>
                </>
              )}
              <Button disabled={busy}>
                {busy ? "Se proceseaza..." : register ? "Inregistrare" : "Conectare"}
              </Button>
            </fieldset>
          </form>
          <div className="mt-5 form-grid">
            <Button type="button" className="w-full" disabled={busy} onClick={googleLogin}>
              Continua cu Google
            </Button>
            <Button type="button" className="w-full" disabled={busy}
              onClick={() => { setRegister(!register); setError(""); }}>
              {register ? "Am deja cont" : "Creeaza un cont"}
            </Button>
          </div>
        </>
      )}
      {error && <p role="alert" className="mt-4 notice-error">{error}</p>}
      <p className="mt-5"><Link to="/">Inapoi la homepage</Link></p>
    </main>
  );
}
