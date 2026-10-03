import React from "react";
import Button from "../../../components/ui/Button";
import { INTENSITY_LABELS } from "./workouts/WorkoutCompletionDialog";
function ExerciseSummary({ exercise }) {
  const details = [`${exercise.sets} seturi`];

  if (exercise.reps != null) {
    details.push(`${exercise.reps} repetari`);
  }

  if (exercise.minutes != null) {
    details.push(`${exercise.minutes} min`);
  }

  if (exercise.weight_kg != null) {
    details.push(`${exercise.weight_kg} kg`);
  }

  return (
    <li>
      <strong>{exercise.name}</strong>
      <span> - {details.join(", ")}</span>
      {exercise.notes && <span> - {exercise.notes}</span>}
    </li>
  );
}

export default function SessionsList({ plans, busy, onEdit, onDelete, onToggle, onCompletion }) {
  return (
    <div className="grid min-w-0 gap-3">
      {plans.map((plan) => (
        <article key={plan.id} aria-label={`Sesiune ${plan.title} din ${plan.day}`}
          className={`min-w-0 overflow-hidden rounded-xl border ${plan.completed ? "border-accent/30 bg-[#102419]" : "border-white/10 bg-ink/40"}`}>
          <details name="week-sessions" className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="shrink-0 text-xl text-accent transition-transform group-open:rotate-90">›</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted"><time dateTime={plan.day}>{plan.day}</time> · {plan.sport}</p>
                <strong className={`block break-words ${plan.completed ? "text-muted line-through" : ""}`}>{plan.title}</strong>
                <small className="block text-muted">{plan.exercises.length} exercitii</small>
                {plan.completed && plan.duration_minutes && <small className="block text-muted">
                  {plan.duration_minutes} min · {INTENSITY_LABELS[plan.intensity] || "Intensitate lipsa"}
                </small>}
              </div>
              <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-bold ${plan.completed
                ? "border-accent bg-accent text-ink" : "border-[#65756c] bg-[#18241d] text-[#cbd5cf]"}`}>
                {plan.completed ? "Executat" : "Planificat"}
              </span>
            </summary>
            <div className="grid gap-3 border-t border-white/10 p-4">
              {plan.notes && <p className="break-words text-sm text-muted">{plan.notes}</p>}
              {plan.exercises.length ? <ul className="grid min-w-0 list-none gap-2 p-0 sm:grid-cols-2 [&_li]:grid [&_li]:min-w-0 [&_li]:gap-1 [&_li]:break-words [&_li]:rounded-lg [&_li]:border [&_li]:border-white/10 [&_li]:bg-[#111f17] [&_li]:p-3 [&_li_span]:text-xs [&_li_span]:text-[#adbbb2]">
                {plan.exercises.map((exercise, index) => <ExerciseSummary key={`${plan.id}-${index}`} exercise={exercise} />)}
              </ul> : <p className="text-sm text-muted">Sesiune fara exercitii individuale.</p>}
            </div>
          </details>
          {plan.can_complete === false && <p className="px-4 pb-3 text-xs text-muted">
            Sesiune planificata in viitor. Executarea va fi disponibila din {plan.day}.
            {plan.has_completion && " Executarea inregistrata anterior nu este inclusa in rapoarte; o poti anula."}
          </p>}
          <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3 [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs">
            <Button type="button" disabled={busy || (!(plan.completed || plan.has_completion) && plan.can_complete === false)}
              onClick={() => onToggle(plan)}>
              {plan.completed || plan.has_completion ? "Anuleaza" : "Executat"}
            </Button>
            {plan.completed && <Button type="button" disabled={busy} onClick={() => onCompletion(plan)}>
              Durata si intensitate
            </Button>}
            <Button type="button" className="!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]"
              disabled={busy} onClick={() => onEdit(plan)}>Editeaza</Button>
            <Button type="button" className="!border-[#82433f] !bg-[#321a18] !text-[#ffaaa3] hover:!border-[#ff766e] hover:!bg-[#46211e]"
              disabled={busy} onClick={() => onDelete(plan)}>Sterge</Button>
          </div>
        </article>
      ))}
    </div>
  );
}
