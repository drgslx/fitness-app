"""Run only with trusted server credentials."""
import argparse
import firebase_admin
from firebase_admin import auth
parser = argparse.ArgumentParser()
parser.add_argument("uid")
parser.add_argument("--project", required=True)
parser.add_argument("--revoke", action="store_true")
args = parser.parse_args()
firebase_admin.initialize_app(options={"projectId": args.project})
user = auth.get_user(args.uid)
claims = dict(user.custom_claims or {})
if args.revoke:
    claims.pop("admin", None)
else:
    claims["admin"] = True
auth.set_custom_user_claims(args.uid, claims)
auth.revoke_refresh_tokens(args.uid)
print("Admin role updated. Sign out and sign in again.")
