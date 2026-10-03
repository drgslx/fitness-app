from fastapi import HTTPException
from sqlalchemy import select
from app.models.tracking import SportType, ExerciseDefinition
from app.services.activity_catalog import CATALOG

ENERGY_FIELDS = ("sport_type_id", "activity_type")


def validate_session(db, uid, values):
    if values.get("activity_type") is not None and values["activity_type"] not in CATALOG:
        raise HTTPException(422, "Tip energetic necunoscut.")
    sport_id = values.get("sport_type_id")
    if sport_id:
        sport = db.get(SportType, sport_id)
        if sport is None or sport.user_id not in (uid, "__system__") or not sport.is_active:
            raise HTTPException(422, "Sportul nu este disponibil.")
        values["sport"] = sport.name
    else:
        sport = db.scalar(select(SportType).where(SportType.name == values["sport"],
                          SportType.user_id.in_([uid, "__system__"]), SportType.is_active.is_(True)))
        if sport: values["sport_type_id"] = sport.id
    for exercise in values.get("exercises", []):
        if exercise.get("exercise_id"):
            definition = db.get(ExerciseDefinition, exercise["exercise_id"])
            if definition is None or definition.user_id not in (uid, "__system__"):
                raise HTTPException(422, "Exercitiul nu este disponibil in biblioteca ta.")
            if sport and definition.sport_type_id != sport.id:
                raise HTTPException(422, "Exercitiul apartine altui sport.")
            exercise["name"] = definition.name
    return values
