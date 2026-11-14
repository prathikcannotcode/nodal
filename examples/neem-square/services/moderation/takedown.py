"""Content removal. Every removal path ends in disable_content()."""
from datetime import datetime, timezone

from services import db, mailer


def disable_content(content_id, reason, actor):
    """Hide a post everywhere at once. Works on a post id or a media id; no deploy needed."""
    now = datetime.now(timezone.utc)
    post = db.update("posts", content_id, {"status": "removed", "removed_at": now, "removed_reason": reason})
    db.insert("audit_log", {
        "action": "disable_content", "content_id": content_id, "reason": reason, "actor": actor, "at": now,
    })
    db.insert("moderation_events", {"post_id": content_id, "event": "removed", "reason": reason, "at": now})
    return post


def remove_on_order(content_url, order_ref, actor):
    """Court orders and government notices. See docs/runbooks/legal-orders.md."""
    return disable_content(db.content_id_for(content_url), reason=f"order:{order_ref}", actor=actor)


def remove_for_policy(content_id, rule, reviewer):
    """A moderator or the classifier found a Community Guidelines breach."""
    return disable_content(content_id, reason=f"policy:{rule}", actor=reviewer)


def remove_for_copyright(content_id, claim_ref, reviewer):
    post = disable_content(content_id, reason=f"copyright:{claim_ref}", actor=reviewer)
    mailer.send_template("moderation/copyright_notice.txt", to=db.owner_email(post), claim_ref=claim_ref,
                         counter_notice_url="https://neemsquare.example/help/legal/copyright")
    return post
