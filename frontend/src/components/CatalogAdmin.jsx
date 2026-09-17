import React, { useState } from "react";
import { send } from "../api/client";
export default function CatalogAdmin() {
  const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
  async function submit(e,path) {
    e.preventDefault();const element=e.currentTarget;const body=Object.fromEntries(new FormData(element));
    setBusy(true);setMessage("");
    try{await send(path,"POST",body);element.reset();setMessage("Definiție adăugată. Este disponibilă în Alimentație.");}catch(err){setMessage(err.message);}finally{setBusy(false);}
  }
  return <section className="panel"><h2>Configurare catalog și obiective</h2><p>Cheia trebuie să fie unică: litere mici, cifre, underscore; de exemplu fibre sau endurance. Unitățile existente nu se schimbă retroactiv.</p>
    <form onSubmit={e=>submit(e,"/nutrients")}><h3>Nutrient nou (opțional)</h3><label>Cheie<input name="key" pattern="[a-z][a-z0-9_]{0,59}" required/></label><label>Nume<input name="label" maxLength={100} required/></label><label>Unitate<select name="unit"><option>g</option><option>mg</option><option>mcg</option></select></label><button disabled={busy}>Adaugă nutrient</button></form>
    <form onSubmit={e=>submit(e,"/goal-types")}><h3>Tip de obiectiv nou</h3><label>Cheie<input name="key" pattern="[a-z][a-z0-9_]{0,59}" required/></label><label>Nume<input name="label" maxLength={100} required/></label><label>Descriere<textarea name="description" maxLength={500}/></label><button disabled={busy}>Adaugă obiectiv</button></form>
    <p role="status">{message}</p>
  </section>;
}
