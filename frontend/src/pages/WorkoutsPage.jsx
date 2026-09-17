import React, { useEffect, useState } from "react";
import { api, send, localDate } from "../api/client";

const blankExercise = () => ({name:"",sets:1,reps:null,minutes:null,weight_kg:null,notes:""});
const blank = day => ({day,title:"",sport:"Forță",notes:"",exercises:[blankExercise()]});
function weekRange(day) {
  const start = new Date(day + "T12:00:00"); start.setDate(start.getDate() - (start.getDay()+6)%7);
  const end = new Date(start); end.setDate(end.getDate()+6);
  return { start:localDate(start), end:localDate(end) };
}
export default function WorkoutsPage() {
  const [day,setDay] = useState(localDate());
  const [form,setForm] = useState(blank(localDate()));
  const [editing,setEditing] = useState(null);
  const [plans,setPlans] = useState([]); const [history,setHistory] = useState([]);
  const [error,setError] = useState(""); const [busy,setBusy] = useState(false);
  const range = weekRange(day);
  async function load() {
    const query = "?start=" + range.start + "&end=" + range.end;
    const [p,h] = await Promise.all([api("/workouts"+query),api("/workout-history"+query)]);
    setPlans(p); setHistory(h);
  }
  useEffect(() => { load().catch(e=>setError(e.message)); }, [range.start,range.end]);
  async function action(fn) {
    setBusy(true); setError("");
    try { await fn(); await load(); } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  function exercise(index,key,value) {
    setForm({...form,exercises:form.exercises.map((e,i)=>i===index?{...e,[key]:value}:e)});
  }
  function edit(plan) {
    setEditing(plan.id); setForm({day:plan.day,title:plan.title,sport:plan.sport,notes:plan.notes,exercises:plan.exercises});
    document.getElementById("workout-form").scrollIntoView({behavior:"smooth"});
  }
  function submit(e) {
    e.preventDefault();
    action(async()=>{await send(editing?"/workouts/"+editing:"/workouts",editing?"PUT":"POST",form); setEditing(null); setForm(blank(day));});
  }
  return <main><h1>Planul de antrenament</h1><p>Construiește săptămâna, ajustează exercițiile și înregistrează ce ai făcut.</p>
    <label>Săptămâna care conține<input type="date" required value={day} onChange={e=>e.target.value && setDay(e.target.value)}/></label>
    <p>{range.start} — {range.end}</p>{error && <p className="error" role="alert">{error}</p>}
    <div className="grid">{plans.map(p=><section className="card card-body" key={p.id}>
      <p className="meta">{p.day} · {p.sport}</p><h2>{p.title}</h2>
      <ul>{p.exercises.map((x,i)=><li key={i}>{x.name}: {x.sets} seturi{x.reps && ", "+x.reps+" repetări"}{x.minutes && ", "+x.minutes+" min"}{x.weight_kg != null && ", "+x.weight_kg+" kg"} {x.notes}</li>)}</ul>
      <p>{p.notes}</p><div className="actions">
        <button disabled={busy} onClick={()=>action(()=>send("/workouts/"+p.id+"/completion",p.completed?"DELETE":"PUT"))}>{p.completed?"✓ Executat · anulează bifarea":"Bifează executat"}</button>
        <button disabled={busy} onClick={()=>edit(p)}>Editează</button>
        <button disabled={busy} onClick={()=>action(()=>send("/workouts/"+p.id,"DELETE"))}>Șterge planul</button>
      </div>
    </section>)}</div>
    {!plans.length && <p>Nu ai sesiuni planificate pentru această săptămână.</p>}
    <section className="panel" id="workout-form"><h2>{editing?"Editează sesiunea":"Adaugă o sesiune"}</h2>
      <form onSubmit={submit}><div className="form-grid">
        <label>Data<input type="date" required value={form.day} onChange={e=>setForm({...form,day:e.target.value})}/></label>
        <label>Titlu<input required maxLength={160} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
        <label>Sport<input required maxLength={80} list="sports" value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})}/><datalist id="sports"><option>Forță</option><option>Muay Thai</option><option>Box la sac</option><option>Alergare</option></datalist></label>
      </div><label>Note<textarea maxLength={2000} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
      {form.exercises.map((x,i)=><fieldset key={i}><legend>Exercițiul {i+1}</legend><div className="form-grid">
        <label>Nume / combinație<input required maxLength={160} value={x.name} onChange={e=>exercise(i,"name",e.target.value)}/></label>
        {["sets","reps","minutes","weight_kg"].map((key,k)=><label key={key}>{["Seturi","Repetări","Minute","Kg"][k]}<input type="number" step={key==="sets"||key==="reps"?"1":"0.1"} min={key==="weight_kg"?0:1} required={key==="sets"} value={x[key]??""} onChange={e=>exercise(i,key,e.target.value===""?null:Number(e.target.value))}/></label>)}
      </div><label>Detalii<input value={x.notes} maxLength={500} onChange={e=>exercise(i,"notes",e.target.value)}/></label>
      <button type="button" onClick={()=>setForm({...form,exercises:form.exercises.filter((_,j)=>j!==i)})}>Elimină exercițiul</button></fieldset>)}
      <button type="button" onClick={()=>setForm({...form,exercises:[...form.exercises,blankExercise()]})}>+ Exercițiu</button>
      <button disabled={busy}>{editing?"Salvează modificările":"Adaugă în plan"}</button>
      {editing && <button type="button" onClick={()=>{setEditing(null);setForm(blank(day));}}>Anulează editarea</button>}
      </form></section>
    <section className="panel"><h2>Istoricul săptămânii · {history.length} sesiuni</h2>
      <p>Bifarea păstrează o copie a sesiunii. Editarea sau ștergerea planului nu rescrie acea copie. Anularea bifării șterge înregistrarea de execuție.</p>
      {history.map(h=><details key={h.id}><summary>{h.day} · {h.snapshot.title} · {h.snapshot.sport}</summary><ul>{h.snapshot.exercises.map((x,i)=><li key={i}>{x.name} · {x.sets} seturi · {x.reps??"—"} repetări · {x.minutes??"—"} min</li>)}</ul></details>)}
    </section>
  </main>;
}
