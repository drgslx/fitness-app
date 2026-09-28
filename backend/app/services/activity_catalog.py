"""Conservative session-level assumptions, informed by the 2024 Adult Compendium.
Intensity bands below are app mappings, NOT individually validated measurements.
Duration defaults are editable UX suggestions, never inferred execution records.
"""
CATALOG = {
    "strength": ("Sala / forta", "strength", 60, (3.5, 5.0, 6.0)),
    "cardio": ("Cardio general", "cardio", 30, (4.0, 6.0, 8.0)),
    "running": ("Alergare", "cardio", 30, (6.5, 8.5, 10.5)),
    "cycling": ("Ciclism", "sport", 45, (4.0, 6.8, 8.0)),
    "swimming": ("Inot", "sport", 45, (5.8, 8.0, 9.8)),
    "football": ("Fotbal", "sport", 60, (5.0, 7.0, 9.0)),
    "basketball": ("Baschet", "sport", 60, (4.5, 6.0, 8.0)),
    "tennis": ("Tenis", "sport", 60, (5.0, 7.3, 8.0)),
    "combat": ("Sport de contact", "sport", 90, (4.0, 6.0, 8.0)),
    "boxing": ("Box", "sport", 90, (4.0, 6.0, 8.0)),
    "kickboxing": ("Kickboxing", "sport", 90, (4.0, 6.0, 7.3)),
    "muay_thai": ("Muay Thai", "sport", 90, (4.0, 6.0, 8.0)),
    "bjj": ("BJJ", "sport", 90, (4.0, 6.0, 8.0)),
    "mma": ("MMA", "sport", 90, (4.0, 6.0, 8.0)),
    "hiking": ("Drumetie", "sport", 90, (3.8, 5.3, 6.0)),
    "other": ("Alta activitate", "other", 30, (2.5, 4.0, 6.0)),
}
INTENSITIES = ("moderate", "high", "very_high")
SOURCE = "https://pacompendium.com/"


def activity_catalog():
    return [dict(key=key, label=value[0], category=value[1], duration_minutes=value[2],
                 mets=dict(zip(INTENSITIES, value[3])), source=SOURCE,
                 assumption="Estimare medie pe sesiune, inclusiv pauze; nu MET specific masurat.")
            for key, value in CATALOG.items()]


def net_calories(kind, intensity, minutes, weight):
    met = CATALOG[kind][3][INTENSITIES.index(intensity)]
    return (met - 1) * weight * minutes / 60
