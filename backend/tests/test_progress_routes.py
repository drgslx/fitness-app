from datetime import date
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from app.db.base import Base
from app.models.tracking import ExerciseDefinition, SportType, Workout, WorkoutLog
from app.training import progress_router


def test_reports_only_include_authenticated_users_completed_sessions():
    engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        for uid, weight in [('owner', 62), ('stranger', 999)]:
            sport = SportType(user_id=uid, name='Sala', is_active=True)
            db.add(sport)
            db.flush()
            definition = ExerciseDefinition(user_id=uid, sport_type_id=sport.id,
                                            name='Ramat', tracking_type='strength')
            db.add(definition)
            db.flush()
            exercise = {'exercise_id': definition.id, 'name': 'Ramat', 'sets': 3,
                        'reps': 8, 'weight_kg': weight}
            plan = Workout(user_id=uid, day=date(2026, 9, 25), title=uid,
                           sport='Sala', sport_type_id=sport.id, exercises=[exercise])
            db.add(plan)
            db.flush()
            db.add(WorkoutLog(workout_id=plan.id, user_id=uid, day=plan.day,
                              snapshot={'sport': 'Sala', 'title': uid, 'exercises': [exercise]}))
            if uid == 'owner':
                exercise_key = f'id:{definition.id}'
        db.commit()
        app = FastAPI()
        app.include_router(progress_router.router, prefix='/api/v1')
        app.dependency_overrides[progress_router.get_db] = lambda: db
        app.dependency_overrides[progress_router.current_user] = lambda: {'uid':'owner'}
        with TestClient(app) as client:
            params = {'sport':'Sala', 'exercise_key':exercise_key, 'anchor':'2026-09-25','period':'month'}
            result = client.get('/api/v1/training-progress', params=params)
            assert result.status_code == 200, result.text
            assert result.json()['metrics']['weight_kg']['current'] == 62
            assert len(result.json()['rows']) == 1
            catalog = client.get('/api/v1/training-progress/catalog').json()
            assert len(catalog) == 1
            assert [item['key'] for item in catalog[0]['exercises']] == [exercise_key]
            assert client.get('/api/v1/training-progress', params={**params,'period':'invalid'}).status_code == 422
            assert client.get('/api/v1/training-progress', params={**params,'anchor':'2026-02-30'}).status_code == 422
    engine.dispose()
