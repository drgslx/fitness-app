from copy import deepcopy
from datetime import date
from types import SimpleNamespace

from app.training.progress_service import build_report, catalog, period_ranges


def log(ident, day, exercises, sport="Sala"):
    return SimpleNamespace(id=ident, day=date.fromisoformat(day), snapshot={"sport": sport, "title": "Upper body", "exercises": exercises})


def exercise(weight=60, reps=8, sets=3, ident=17, name="Ramat"):
    return {"exercise_id": ident, "name": name, "weight_kg": weight, "reps": reps, "sets": sets, "minutes": None}


def test_monthly_weight_progress_duplicate_rows_and_snapshot_isolation():
    logs = [log(1, "2026-08-01", [exercise()]), log(2, "2026-08-15", [exercise()]),
            log(3, "2026-09-25", [exercise(62), exercise(40, 10, 1)])]
    original = deepcopy(logs[2].snapshot)
    report = build_report(logs, "Sala", "id:17", date(2026, 9, 25), "month")
    assert report["metrics"]["weight_kg"]["delta"] == 2
    assert report["metrics"]["repetitions"]["current"] == 34
    assert len(report["rows"]) == 2
    assert report["sessions"] == 1 and report["previous_sessions"] == 2
    assert report["points"][0]["weight_kg"] is None
    assert logs[2].snapshot == original


def test_contact_minutes_and_missing_fields_are_not_zero():
    logs = [log(1, "2026-09-25", [{"exercise_id": 2, "name": "Directe", "sets": 4, "reps": 20, "minutes": 12}], "Muay Thai")]
    result = build_report(logs, "Muay Thai", "id:2", date(2026, 9, 25), "week")
    assert result["metrics"]["repetitions"]["current"] == 80
    assert result["metrics"]["minutes"]["current"] == 12
    assert result["metrics"]["weight_kg"]["current"] is None
    assert result["metrics"]["minutes"]["delta"] is None


def test_same_id_renamed_and_legacy_names_kept_separate():
    logs = [log(1, "2026-08-01", [exercise(name="Ramat vechi")]),
            log(2, "2026-09-01", [exercise(62, name="Ramat nou"), exercise(30, ident=None, name="Ramat nou")])]
    items = catalog(logs)[0]["exercises"]
    assert len(items) == 2
    assert next(item for item in items if item["key"] == "id:17")["name"] == "Ramat nou"
    result = build_report(logs, "Sala", "id:17", date(2026, 9, 25), "month")
    assert result["metrics"]["weight_kg"]["delta"] == 2
    assert len(result["rows"]) == 1


def test_period_boundaries():
    start, end, ps, pe = period_ranges(date(2024, 3, 31), "month")
    assert str(ps) == "2024-02-01" and str(pe) == "2024-02-29"
    assert str(end) == "2024-03-31"
    start, end, ps, pe = period_ranges(date(2026, 1, 1), "week")
    assert str(start) == "2025-12-29" and str(end) == "2026-01-04"
    assert (pe - ps).days == 6


def test_zero_weight_is_real_and_empty_report_has_no_delta():
    result = build_report([log(1, "2026-09-25", [exercise(0)])], "Sala", "id:17", date(2026, 9, 25), "month")
    assert result["metrics"]["weight_kg"]["current"] == 0
    assert result["metrics"]["weight_kg"]["delta"] is None
    assert build_report([], "Sala", "id:17", date(2026, 9, 25), "month")["rows"] == []
