"""Remove expired search entries; never removes catalog foods or the rate gate."""
import time
from sqlalchemy import delete
from app.db.session import SessionLocal
from app.models.tracking import FoodSearchCache

if __name__ == '__main__':
    with SessionLocal() as db:
        count = db.execute(delete(FoodSearchCache).where(FoodSearchCache.key != 'rate', FoodSearchCache.expires < time.time())).rowcount
        db.commit()
        print(f'Removed {count} expired search entries')
