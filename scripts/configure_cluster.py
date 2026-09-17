"""Create namespace and DB Secret without putting passwords in shell arguments."""
import argparse
import getpass
import json
import os
import subprocess
from urllib.parse import quote

parser = argparse.ArgumentParser()
parser.add_argument("--cloud", action="store_true")
args = parser.parse_args()
namespace = "sport-platform"
def apply(document):
    subprocess.run(["kubectl", "apply", "-f", "-"], input=json.dumps(document), text=True, check=True)
if args.cloud:
    project = os.environ["GCP_PROJECT"]
    host = os.environ["DB_HOST"]
    secret = os.environ["DB_SECRET"]
    password = subprocess.check_output(["gcloud","secrets","versions","access","latest","--secret",secret,"--project",project],text=True).strip()
else:
    host = "postgres"
    password = os.environ.get("POSTGRES_PASSWORD") or getpass.getpass("Local PostgreSQL password: ")
    if not password: raise SystemExit("A non-empty password is required.")
url = "postgresql+psycopg://sport:" + quote(password,safe="") + "@" + host + ":5432/sportdb"
apply({"apiVersion":"v1","kind":"Namespace","metadata":{"name":namespace}})
apply({"apiVersion":"v1","kind":"Secret","metadata":{"name":"sport-db","namespace":namespace},"type":"Opaque","stringData":{"DATABASE_URL":url,"POSTGRES_PASSWORD":password}})
print("Namespace and DB Secret configured. No password printed.")
