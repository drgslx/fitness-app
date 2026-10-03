import React, { useEffect, useRef, useState } from "react";

export const INTENSITY_LABELS = {
  moderate: "Moderata",
  high: "Ridicata",
  very_high: "Foarte ridicata",
};

export default function WorkoutCompletionDialog({ session, onSave, onCancel }) {
  const dialogRef = useRef(null);
  const savingRef = useRef(false);
  const [duration, setDuration] = useState(session.completed ? session.duration_minutes ?? "" : "");
  const [intensity, setIntensity] = useState(session.completed ? session.intensity ?? "" : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (savingRef.current) return;
    savingRef.current = true;
    setBusy(true);
    setError("");
    try {
      await onSave({ duration_minutes: Number(duration), intensity });
    } catch (err) {
      setError(err.message);
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="completion-title" aria-describedby="completion-session"
      className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-2xl border border-white/15 bg-surface p-5 text-copy shadow-xl backdrop:bg-black/70"
      onCancel={(event) => {
        event.preventDefault();
        if (!savingRef.current) onCancel();
      }}>
      <h3 id="completion-title">{session.completed ? "Detaliile antrenamentului" : "Finalizeaza antrenamentul"}</h3>
      <p id="completion-session" className="mb-4 text-sm text-muted">{session.title} · {session.day}</p>
      <form onSubmit={submit} className="grid gap-4">
        <label>Cate minute a durat antrenamentul?
          <input type="number" min="0.1" max="600" step="0.1" required autoFocus disabled={busy}
            value={duration} onChange={(event) => setDuration(event.target.value)} />
        </label>
        <label>Cum a fost sesiunea?
          <select required disabled={busy} value={intensity} onChange={(event) => setIntensity(event.target.value)}>
            <option value="">Alege intensitatea</option>
            {Object.entries(INTENSITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <p className="text-xs text-muted">Durata include pauzele. Aceste date sunt folosite la calculul mentinerii.</p>
        {error && <p role="alert" className="text-[#ffaaaa]">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" disabled={busy} onClick={onCancel}>Anuleaza</button>
          <button type="submit" disabled={busy}>{busy ? "Se salveaza..." : session.completed ? "Salveaza detaliile" : "Confirma executarea"}</button>
        </div>
      </form>
    </dialog>
  );
}
