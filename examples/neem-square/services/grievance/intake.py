"""Grievance and report intake. POST /api/grievances lands here."""
from datetime import datetime, timedelta, timezone

from services import config, db, mailer, paging
from services.safety import ncii

SLA = config.load("support.yaml")["grievance"]
QUEUES = config.load("support.yaml")["queues"]
FAST_TRACK = {"intimate_imagery", "impersonation"}


def next_ticket_number(now):
    seq = db.next_value("ticket_seq")
    return f"{SLA['ticket_prefix']}-{now.year}-{seq:07d}"


def due_at(category, received_at):
    if category in FAST_TRACK:
        return received_at + ncii.NCII_SLA
    if category in ("content_removal", "synthetic_media"):
        return received_at + timedelta(hours=SLA["content_removal_hours"])
    return received_at + timedelta(days=SLA["resolve_days"])


def create(form):
    now = datetime.now(timezone.utc)
    ticket = db.insert("tickets", {
        "number": next_ticket_number(now),
        "category": form["category"],
        "content_url": form["content_url"],
        "details": form.get("details", ""),
        "reply_to": form["reply_to"],
        "on_behalf": bool(form.get("on_behalf")),
        "received_at": now,
        "ack_due_at": now + timedelta(hours=SLA["ack_hours"]),
        "due_at": due_at(form["category"], now),
        "queue": QUEUES[form["category"]],
        "status": "open",
    })
    mailer.send_template("grievance/ack_email.txt", to=ticket["reply_to"], ticket=ticket)
    db.update("tickets", ticket["id"], {"acknowledged_at": datetime.now(timezone.utc)})
    if ticket["category"] in FAST_TRACK:
        ncii.enqueue(ticket)
    return ticket


def status(ticket_number):
    """Backs the public status page: /help/report/status?ticket=NS-2026-0000123"""
    ticket = db.find_one("tickets", number=ticket_number)
    return {"number": ticket["number"], "status": ticket["status"], "due_at": ticket["due_at"]}


def close(ticket_id, decision, reasons, actor):
    ticket = db.update("tickets", ticket_id, {
        "status": "closed", "decision": decision, "closed_at": datetime.now(timezone.utc), "closed_by": actor,
    })
    mailer.send_template("grievance/closure_email.txt", to=ticket["reply_to"], ticket=ticket, reasons=reasons)


def escalate_due():
    cutoff = datetime.now(timezone.utc) + timedelta(hours=SLA["escalate_before_due_hours"])
    for ticket in db.find("tickets", status="open", due_before=cutoff):
        paging.notify(ticket["queue"], f"Ticket {ticket['number']} is near its due time")
