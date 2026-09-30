import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export default function FoodDialog({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus?.(); };
  }, []);
  return createPortal(<dialog ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}
    className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-xl border border-white/15 bg-[#111b15] p-4 text-[#e8eee9] shadow-2xl backdrop:bg-black/70">
    <div className="mb-3 flex items-start justify-between gap-3"><h2 id={titleId} className="text-xl font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="Inchide">✕</button></div>
    {children}
  </dialog>, document.body);
}
