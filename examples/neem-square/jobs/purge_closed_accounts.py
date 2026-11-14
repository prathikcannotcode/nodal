"""Nightly: finish closing accounts, as the Privacy Policy promises."""
from datetime import datetime, timedelta, timezone

from services import db

GRACE = timedelta(days=30)


def run():
    cutoff = datetime.now(timezone.utc) - GRACE
    for user in db.find("users", status="closed", closed_before=cutoff):
        db.delete("sessions", user_id=user["id"])
        db.delete("follows", user_id=user["id"])
        db.delete("signup_records", user_id=user["id"])     # email, phone, date of birth, signup IP and time
        db.delete("users", id=user["id"])
