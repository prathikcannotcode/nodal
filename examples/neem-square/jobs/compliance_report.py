"""Builds last month's compliance report and publishes it at /transparency. Schedule: config/schedules.yaml."""
from services import db, publisher
from services.dates import previous_month

TEMPLATE = "docs/compliance/monthly-report-template.md"


def run():
    start, end = previous_month()
    figures = {
        "period": f"{start:%B %Y}",
        "complaints_received": db.count("tickets", received_between=(start, end)),
        "complaints_by_category": db.count_by("tickets", "category", received_between=(start, end)),
        "complaints_actioned": db.count("tickets", closed_between=(start, end), decision="actioned"),
        "complaints_not_actioned": db.count("tickets", closed_between=(start, end), decision="no_action"),
        "proactive_removals": db.count("moderation_events", event="removed", reason_prefix="policy:auto",
                                       between=(start, end)),
        "orders_received": db.count("audit_log", action="disable_content", reason_prefix="order:",
                                    between=(start, end)),
    }
    publisher.publish_page("/transparency", template=TEMPLATE, context=figures, archive=True)
