"""Stream a downloaded OFF JSONL[.gz] export; never crawl the API."""
import argparse
import gzip
import json
from app.db.session import SessionLocal
from app.services.food_catalog import import_product

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file")
    parser.add_argument("--country", default="en:romania")
    parser.add_argument("--limit", type=int, default=0, help="0 = all matching usable products")
    parser.add_argument("--refresh", action="store_true", help="Update OFF rows only; diary and recipe snapshots stay unchanged")
    args = parser.parse_args()
    opener = gzip.open if args.file.endswith(".gz") else open
    scanned = matched = usable = 0
    with opener(args.file, "rt", encoding="utf-8") as stream, SessionLocal() as db:
        for line in stream:
            scanned += 1
            try: product = json.loads(line)
            except (ValueError, TypeError): continue
            if not isinstance(product, dict): continue
            if args.country not in (product.get("countries_tags") or []): continue
            matched += 1
            if import_product(db, product, refresh=args.refresh): usable += 1
            if matched % 500 == 0:
                db.commit()
                print(f"Scanned={scanned}; Romania={matched}; usable={usable}", flush=True)
            if args.limit and usable >= args.limit: break
        db.commit()
    print(f"Finished: scanned={scanned}; matched={matched}; usable={usable}")

if __name__ == "__main__": main()
