import React from "react";
import Button from "../../../components/ui/Button";

function ExerciseSummary({ exercise }) {
  const details = [`${exercise.sets} seturi`];
  if (exercise.reps != null) details.push(`${exercise.reps} repetari`);
  if (exercise.minutes != null) details.push(`${exercise.minutes} min`);
  if (exercise.weight_kg != null) details.push(`${exercise.weight_kg} kg`);
  return (
    <li className="rounded-lg border border-white/10 bg-raised/40 p-2">
      <strong>{exercise.name}</strong>
      <span className="block text-xs text-muted">{details.join(", ")}</span>
      {exercise.notes && (
        <span className="block text-xs text-muted">{exercise.notes}</span>
      )}
    </li>
  );
}

export default function SessionsList({
  plans,
  busy,
  onEdit,
  onDelete,
  onToggle,
}) {
  return (
    <section aria-label="Sesiunile planificate" className="space-y-2 pt-3">
      {plans.map((plan) => (
        <details key={plan.id} className="group min-w-0 rounded-xl border border-white/10 bg-surface">
          <summary className="flex min-h-12 list-none items-center gap-2 px-3 text-sm hover:bg-raised/50 [&::-webkit-details-marker]:hidden sm:gap-4 sm:px-4">
            <span className="min-w-0 max-w-[25%] truncate text-muted" title={plan.sport}>{plan.sport}</span>
            <strong className={`min-w-0 flex-1 truncate ${plan.completed ? "text-muted line-through" : "text-copy"}`} title={plan.title}>{plan.title}</strong>
            <time dateTime={plan.day} className="shrink-0 whitespace-nowrap text-xs text-muted sm:text-sm">{plan.day}</time>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <dl className="grid gap-4 border-t border-white/10 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[7rem_minmax(0,1fr)_5rem_minmax(0,1.4fr)_6rem_7rem]">
            {[
        {
          key: "day",
          label: "Data",
          render: (plan) => (
            <time dateTime={plan.day} className="whitespace-nowrap">
              {plan.day}
            </time>
          ),
        },
        {
          key: "title",
          label: "Sesiune",
          render: (plan) => (
            <>
              <strong>{plan.title}</strong>
              {plan.duration_minutes && (
                <small className="block text-muted">
                  {plan.duration_minutes} min · {plan.intensity}
                </small>
              )}
              {plan.notes && <p className="text-xs text-muted">{plan.notes}</p>}
            </>
          ),
        },
        { key: "sport", label: "Sport" },
        {
          key: "exercises",
          label: "Exercitii",
          render: (plan) => (
            <ul className="space-y-2">
              {plan.exercises.map((exercise, index) => (
                <ExerciseSummary key={index} exercise={exercise} />
              ))}
            </ul>
          ),
        },
        {
          key: "completed",
          label: "Status",
          render: (plan) => (
            <span
              className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${plan.completed ? "bg-accent/20 text-accent" : "bg-raised text-copy"}`}
            >
              {plan.completed ? "Executat" : "Planificat"}
            </span>
          ),
        },
        {
          key: "actions",
          label: "Actiuni",
          render: (plan) => (
            <div className="flex flex-wrap gap-2 [&_button]:whitespace-nowrap lg:flex-col lg:items-start">
              <Button
                type="button"
                disabled={busy}
                onClick={() => onToggle(plan)}
              >
                {plan.completed ? "Anuleaza" : "Executat"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => onEdit(plan)}
              >
                Editeaza
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={busy}
                onClick={() => onDelete(plan)}
              >
                Sterge
              </Button>
            </div>
          ),
        },
            ].map((column) => (
              <div key={column.key} className={`min-w-0 ${column.key === "exercises" || column.key === "actions" ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <dt className="mb-2 text-xs text-muted lg:uppercase lg:text-accent">{column.label}</dt>
                <dd className="min-w-0 break-words text-sm">{column.render ? column.render(plan) : plan[column.key]}</dd>
              </div>
            ))}
          </dl>
        </details>
      ))}
    </section>
  );
}
