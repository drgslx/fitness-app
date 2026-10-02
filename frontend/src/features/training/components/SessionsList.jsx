import React from "react";
import Button from "../../../components/ui/Button";
import ResponsiveTable from "../../../components/ui/ResponsiveTable";

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
    <ResponsiveTable
      caption="Sesiunile planificate"
      rows={plans}
      rowKey={(plan) => plan.id}
      columns={[
        { key: "day", label: "Data" },
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
              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${plan.completed ? "bg-accent/20 text-accent" : "bg-raised text-copy"}`}
            >
              {plan.completed ? "Executat" : "Planificat"}
            </span>
          ),
        },
        {
          key: "actions",
          label: "Actiuni",
          render: (plan) => (
            <div className="flex flex-wrap gap-2">
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
      ]}
    />
  );
}
