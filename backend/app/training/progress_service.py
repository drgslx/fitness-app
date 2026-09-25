"""Reporting exclusively from completed-session snapshots. No database writes."""
from collections import defaultdict
from datetime import date, timedelta
from math import isfinite

METRICS = {
    "weight_kg": {"label": "Greutate maxima", "unit": "kg", "aggregation": "max"},
    "repetitions": {"label": "Repetari totale (seturi x repetari)", "unit": "repetari", "aggregation": "sum"},
    "sets": {"label": "Seturi / runde inregistrate", "unit": "seturi", "aggregation": "sum"},
    "minutes": {"label": "Minute inregistrate", "unit": "min", "aggregation": "sum"},
    "distance_km": {"label": "Distanta inregistrata", "unit": "km", "aggregation": "sum"},
}


def period_ranges(anchor, period):
    if period == "week":
        start = anchor - timedelta(days=anchor.weekday())
        end = start + timedelta(days=6)
        previous_start, previous_end = start - timedelta(days=7), start - timedelta(days=1)
    else:
        start = anchor.replace(day=1)
        next_month = (start.replace(day=28) + timedelta(days=4)).replace(day=1)
        end = next_month - timedelta(days=1)
        previous_end = start - timedelta(days=1)
        previous_start = previous_end.replace(day=1)
    return start, end, previous_start, previous_end


def exercise_key(exercise):
    ident = exercise.get("exercise_id")
    return f"id:{ident}" if ident is not None else "name:" + exercise.get("name", "").strip()


def number(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not isfinite(value) or value < 0:
        return None
    return value


def metric_value(exercise, metric):
    if metric == "repetitions":
        sets, reps = number(exercise.get("sets")), number(exercise.get("reps"))
        return sets * reps if sets is not None and reps is not None else None
    return number(exercise.get(metric))


def aggregate(values, metric):
    valid = [value for value in values if value is not None]
    if not valid:
        return None
    return round(max(valid) if metric == "weight_kg" else sum(valid), 2)


def catalog(logs):
    sports = defaultdict(dict)
    # Latest recorded name wins for the same exercise ID. Legacy names stay separate.
    for log in logs:
        snapshot = log.snapshot or {}
        sport = snapshot.get("sport", "").strip()
        if not sport:
            continue
        for exercise in snapshot.get("exercises", []):
            name = exercise.get("name", "").strip()
            if name:
                key = exercise_key(exercise)
                sports[sport][key] = {"key": key, "name": name, "legacy": exercise.get("exercise_id") is None}
    return [{"name": sport, "exercises": sorted(items.values(), key=lambda x: x["name"].casefold())}
            for sport, items in sorted(sports.items())]


def build_report(logs, sport, key, anchor, period):
    start, end, previous_start, previous_end = period_ranges(anchor, period)
    current_rows, previous_rows = [], []
    for log in logs:
        snapshot = log.snapshot or {}
        if snapshot.get("sport", "").strip() != sport:
            continue
        if not previous_start <= log.day <= end:
            continue
        for index, exercise in enumerate(snapshot.get("exercises", [])):
            if exercise_key(exercise) != key:
                continue
            record = {
                "log_id": log.id, "index": index, "day": log.day.isoformat(),
                "session": snapshot.get("title", "Sesiune"),
                "exercise": dict(exercise),
            }
            (current_rows if start <= log.day <= end else previous_rows).append(record)
    current_rows.sort(key=lambda row: (row["day"], row["log_id"], row["index"]))
    by_day = defaultdict(list)
    for row in current_rows:
        by_day[row["day"]].append(row)
    summaries = {}
    for metric, definition in METRICS.items():
        current_values = [metric_value(row["exercise"], metric) for row in current_rows]
        previous_values = [metric_value(row["exercise"], metric) for row in previous_rows]
        current = aggregate(current_values, metric)
        previous = aggregate(previous_values, metric)
        summaries[metric] = {**definition, "current": current, "previous": previous,
                             "delta": round(current - previous, 2) if current is not None and previous is not None else None,
                             "missing_current": sum(value is None for value in current_values)}
    points = []
    for offset in range((end - start).days + 1):
        day = (start + timedelta(days=offset)).isoformat()
        rows = by_day.get(day, [])
        points.append({"day": day, **{metric: aggregate([metric_value(row["exercise"], metric) for row in rows], metric)
                                      for metric in METRICS}})
    return {"start": start.isoformat(), "end": end.isoformat(),
            "previous_start": previous_start.isoformat(), "previous_end": previous_end.isoformat(),
            "sessions": len({row["log_id"] for row in current_rows}),
            "previous_sessions": len({row["log_id"] for row in previous_rows}),
            "metrics": summaries, "points": points, "rows": current_rows}
