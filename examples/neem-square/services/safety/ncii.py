"""Priority queue for intimate-image and impersonation reports."""
from datetime import timedelta

from services import db, paging
from services.moderation import takedown

NCII_SLA = timedelta(hours=24)
PAGE_AFTER = timedelta(hours=12)


def enqueue(ticket):
    db.insert("priority_queue", {
        "ticket_id": ticket["id"],
        "content_url": ticket["content_url"],
        "due_at": ticket["received_at"] + NCII_SLA,
        "page_at": ticket["received_at"] + PAGE_AFTER,
    })
    paging.notify("safety-priority", f"New priority report {ticket['number']}")


def action(ticket, reviewer, confirmed):
    if confirmed:
        takedown.disable_content(
            content_id=db.content_id_for(ticket["content_url"]),
            reason=f"grievance:{ticket['category']}",
            actor=reviewer,
        )
    db.update("priority_queue", ticket["id"], {"actioned_by": reviewer})
