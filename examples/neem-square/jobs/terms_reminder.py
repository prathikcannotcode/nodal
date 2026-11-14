"""Policy reminder to every active user, by email and as an in-app card. Schedule: config/schedules.yaml."""
from services import db, mailer, notices

SUBJECT = "A reminder about our Terms"
BODY = """Hello {name},

Thanks for being part of Neem Square. This is a reminder that our Terms of Use, Privacy Policy and
Community Guidelines apply whenever you use Neem Square. You can read them at https://neemsquare.example/terms.

If you do not follow them, we may remove your content or suspend or close your account straight away.

Neem Square
"""


def run():
    for user in db.find("users", status="active"):
        mailer.send(to=user["email"], subject=SUBJECT, body=BODY.format(name=user["display_name"]))
        notices.show_card(user["id"], title=SUBJECT, link="/terms")
    db.insert("job_runs", {"job": "terms_reminder"})
