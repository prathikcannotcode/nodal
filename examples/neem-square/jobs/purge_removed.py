"""Nightly: clear out posts that moderation removed."""
from datetime import datetime, timedelta, timezone

from services import db, storage

KEEP_REMOVED = timedelta(days=30)


def run():
    cutoff = datetime.now(timezone.utc) - KEEP_REMOVED
    for post in db.find("posts", status="removed", removed_before=cutoff):
        storage.delete_renditions(post["media_id"])
        db.delete("moderation_events", post_id=post["id"])
        db.delete("comments", post_id=post["id"])
        db.delete("posts", id=post["id"])
